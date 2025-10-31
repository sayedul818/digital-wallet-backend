"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    sender: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: [true, 'Amount is required'], min: [0, 'Amount cannot be negative'] },
    type: { type: String, enum: ['deposit', 'withdraw', 'transfer', 'cash-in', 'cash-out'], required: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success' },
    handledBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String },
}, { timestamps: true });
transactionSchema.index({ sender: 1, createdAt: -1 });
transactionSchema.index({ receiver: 1, createdAt: -1 });
transactionSchema.index({ handledBy: 1, createdAt: -1 });
const Transaction = mongoose_1.default.model('Transaction', transactionSchema);
exports.default = Transaction;
