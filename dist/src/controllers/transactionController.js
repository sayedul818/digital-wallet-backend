"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = exports.getTransactions = exports.cashOut = exports.cashIn = exports.sendMoney = exports.getWalletBalance = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const User_1 = __importDefault(require("../models/User"));
const getWalletBalance = async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?._id;
        const user = await User_1.default.findById(userId).select('balance');
        res.json({ balance: user?.balance ?? 0 });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getWalletBalance = getWalletBalance;
const sendMoney = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { receiverPhone, amount } = req.body;
        if (amount <= 0)
            throw new Error('Amount must be greater than 0');
        // @ts-ignore
        const sender = await User_1.default.findById(req.user._id).session(session);
        const receiver = await User_1.default.findOne({ phone: receiverPhone }).session(session);
        if (!receiver)
            throw new Error('Receiver not found');
        if (!sender)
            throw new Error('Sender not found');
        if (sender.balance < amount)
            throw new Error('Insufficient funds');
        sender.balance -= amount;
        receiver.balance += amount;
        await sender.save();
        await receiver.save();
        const transaction = await Transaction_1.default.create([
            {
                sender: sender._id,
                receiver: receiver._id,
                amount,
                type: 'transfer',
                status: 'success',
            },
        ], { session });
        await session.commitTransaction();
        res.json({ message: 'Transfer successful', transaction: transaction[0] });
    }
    catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    }
    finally {
        session.endSession();
    }
};
exports.sendMoney = sendMoney;
const cashIn = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { userPhone, amount } = req.body;
        if (amount <= 0)
            throw new Error('Amount must be greater than 0');
        // @ts-ignore
        const agent = await User_1.default.findById(req.user._id).session(session);
        const user = await User_1.default.findOne({ phone: userPhone }).session(session);
        if (!user)
            throw new Error('User not found');
        if (!agent)
            throw new Error('Agent not found');
        if (agent.balance < amount)
            throw new Error('Insufficient agent balance');
        agent.balance -= amount;
        user.balance += amount;
        await agent.save();
        await user.save();
        const transaction = await Transaction_1.default.create([
            {
                sender: agent._id,
                receiver: user._id,
                amount,
                type: 'cash-in',
                handledBy: agent._id,
                status: 'success',
            },
        ], { session });
        await session.commitTransaction();
        res.json({ message: 'Cash in successful', transaction: transaction[0] });
    }
    catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    }
    finally {
        session.endSession();
    }
};
exports.cashIn = cashIn;
const cashOut = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { userPhone, amount } = req.body;
        if (amount <= 0)
            throw new Error('Amount must be greater than 0');
        // @ts-ignore
        const agent = await User_1.default.findById(req.user._id).session(session);
        const user = await User_1.default.findOne({ phone: userPhone }).session(session);
        if (!user)
            throw new Error('User not found');
        if (!agent)
            throw new Error('Agent not found');
        if (user.balance < amount)
            throw new Error('Insufficient user balance');
        user.balance -= amount;
        agent.balance += amount;
        await user.save();
        await agent.save();
        const transaction = await Transaction_1.default.create([
            {
                sender: user._id,
                receiver: agent._id,
                amount,
                type: 'cash-out',
                handledBy: agent._id,
                status: 'success',
            },
        ], { session });
        await session.commitTransaction();
        res.json({ message: 'Cash out successful', transaction: transaction[0] });
    }
    catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    }
    finally {
        session.endSession();
    }
};
exports.cashOut = cashOut;
const getTransactions = async (req, res) => {
    try {
        const { type, startDate, endDate, page = 1, limit = 10 } = req.query;
        // @ts-ignore
        const userId = req.user._id;
        const query = {
            $or: [{ sender: userId }, { receiver: userId }],
        };
        if (type)
            query.type = type;
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        const transactions = await Transaction_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .populate('sender', 'name phone')
            .populate('receiver', 'name phone')
            .populate('handledBy', 'name phone');
        const total = await Transaction_1.default.countDocuments(query);
        res.json({ transactions, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getTransactions = getTransactions;
const searchUsers = async (req, res) => {
    try {
        const { search, limit = 10 } = req.query;
        if (!search)
            return res.status(400).json({ message: 'Search query is required' });
        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ],
            role: 'user',
        };
        const users = await User_1.default.find(query).select('name phone balance email').limit(Number(limit)).lean();
        res.json({ users });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.searchUsers = searchUsers;
