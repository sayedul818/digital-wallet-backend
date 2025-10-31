import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction';
import User from '../models/User';

export const getWalletBalance = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user?._id;
    const user = await User.findById(userId).select('balance');
    res.json({ balance: user?.balance ?? 0 });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const sendMoney = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { receiverPhone, amount } = req.body;

    if (amount <= 0) throw new Error('Amount must be greater than 0');

    // @ts-ignore
    const sender = await User.findById(req.user._id).session(session);
    const receiver = await User.findOne({ phone: receiverPhone }).session(session);

    if (!receiver) throw new Error('Receiver not found');
    if (!sender) throw new Error('Sender not found');

    if (sender.balance < amount) throw new Error('Insufficient funds');

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    const transaction = await Transaction.create(
      [
        {
          sender: sender._id,
          receiver: receiver._id,
          amount,
          type: 'transfer',
          status: 'success',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.json({ message: 'Transfer successful', transaction: transaction[0] });
  } catch (error: any) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const cashIn = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userPhone, amount } = req.body;
    if (amount <= 0) throw new Error('Amount must be greater than 0');

    // @ts-ignore
    const agent = await User.findById(req.user._id).session(session);
    const user = await User.findOne({ phone: userPhone }).session(session);

    if (!user) throw new Error('User not found');
    if (!agent) throw new Error('Agent not found');

    if (agent.balance < amount) throw new Error('Insufficient agent balance');

    agent.balance -= amount;
    user.balance += amount;

    await agent.save();
    await user.save();

    const transaction = await Transaction.create(
      [
        {
          sender: agent._id,
          receiver: user._id,
          amount,
          type: 'cash-in',
          handledBy: agent._id,
          status: 'success',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.json({ message: 'Cash in successful', transaction: transaction[0] });
  } catch (error: any) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const cashOut = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userPhone, amount } = req.body;
    if (amount <= 0) throw new Error('Amount must be greater than 0');

    // @ts-ignore
    const agent = await User.findById(req.user._id).session(session);
    const user = await User.findOne({ phone: userPhone }).session(session);

    if (!user) throw new Error('User not found');
    if (!agent) throw new Error('Agent not found');

    if (user.balance < amount) throw new Error('Insufficient user balance');

    user.balance -= amount;
    agent.balance += amount;

    await user.save();
    await agent.save();

    const transaction = await Transaction.create(
      [
        {
          sender: user._id,
          receiver: agent._id,
          amount,
          type: 'cash-out',
          handledBy: agent._id,
          status: 'success',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.json({ message: 'Cash out successful', transaction: transaction[0] });
  } catch (error: any) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { type, startDate, endDate, page = 1, limit = 10 } = req.query as any;

    // @ts-ignore
    const userId = req.user._id;
    const query: any = {
      $or: [{ sender: userId }, { receiver: userId }],
    };

    if (type) query.type = type;
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('sender', 'name phone')
      .populate('receiver', 'name phone')
      .populate('handledBy', 'name phone');

    const total = await Transaction.countDocuments(query);

    res.json({ transactions, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { search, limit = 10 } = req.query as any;
    if (!search) return res.status(400).json({ message: 'Search query is required' });

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
      role: 'user',
    };

    const users = await User.find(query).select('name phone balance email').limit(Number(limit)).lean();
    res.json({ users });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
