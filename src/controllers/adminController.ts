import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction';
import User from '../models/User';

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const totalTransactions = await Transaction.countDocuments();

    const walletVolume = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalAgents,
      totalTransactions,
      totalVolume: walletVolume[0]?.total || 0
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query as any;

    const query: any = {};

    if (role) query.role = role;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({ users, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = isActive;
    await user.save();

    res.json({ message: `User ${isActive ? 'unblocked' : 'blocked'} successfully` });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const approveAgent = async (req: Request, res: Response) => {
  try {
    const agent = await User.findById(req.params.id);

    if (!agent || agent.role !== 'agent') return res.status(404).json({ message: 'Agent not found' });

    agent.isApproved = true;
    await agent.save();

    res.json({ message: 'Agent approved successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const { type, status, startDate, endDate, page = 1, limit = 10 } = req.query as any;

    const query: any = {};

    if (type) query.type = type;
    if (status) query.status = status;
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

export const creditUserByAdmin = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount } = req.body;
    const userId = req.params.id;

    if (!amount || Number(amount) <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // @ts-ignore
    const adminId = req.user?._id;

    const user = await User.findById(userId).session(session);
    const admin = await User.findById(adminId).session(session);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // credit the user's balance
    user.balance = (user.balance || 0) + Number(amount);
    await user.save();

    // create a deposit transaction (admin -> user)
    const tx = await Transaction.create(
      [
        {
          sender: admin._id,
          receiver: user._id,
          amount: Number(amount),
          type: 'deposit',
          status: 'success',
          handledBy: admin._id,
          note: `Admin credited ${Number(amount)} to user ${user._id}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.json({ message: 'User credited successfully', transaction: tx[0] });
  } catch (error: any) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
