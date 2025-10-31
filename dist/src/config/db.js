"use strict";
// import mongoose from 'mongoose';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const connectDB = async (): Promise<typeof mongoose> => {
//   try {
//     if (!process.env.MONGODB_URI) {
//       throw new Error('MongoDB URI is not defined in environment variables');
//     }
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//     } as mongoose.ConnectOptions);
//     await conn.connection.db.admin().ping();
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//     conn.connection.on('error', (err) => {
//       console.error('MongoDB connection error:', err);
//     });
//     return conn;
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };
// export default connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false; // track connection status
const connectDB = async () => {
    if (isConnected) {
        console.log('✅ Using existing MongoDB connection');
        return mongoose_1.default;
    }
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        await conn.connection.db.admin().ping();
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        conn.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        isConnected = true;
        return conn;
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error; // Do NOT exit process in serverless
    }
};
exports.default = connectDB;
