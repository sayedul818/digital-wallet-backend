import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'deposit' | 'withdraw' | 'transfer' | 'cash-in' | 'cash-out';
export type TransactionStatus = 'success' | 'failed' | 'pending';

export interface ITransaction extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  handledBy?: mongoose.Types.ObjectId;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const transactionSchema: Schema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: [true, 'Amount is required'], min: [0, 'Amount cannot be negative'] },
    type: { type: String, enum: ['deposit', 'withdraw', 'transfer', 'cash-in', 'cash-out'], required: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success' },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String },
  },
  { timestamps: true }
);

transactionSchema.index({ sender: 1, createdAt: -1 });
transactionSchema.index({ receiver: 1, createdAt: -1 });
transactionSchema.index({ handledBy: 1, createdAt: -1 });

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
