"use strict";
// import express from 'express';
// import cors from 'cors';
// import morgan from 'morgan';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
// import connectDB from './config/db';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // Routes
// import authRoutes from './routes/authRoutes';
// import userRoutes from './routes/userRoutes';
// import agentRoutes from './routes/agentRoutes';
// import adminRoutes from './routes/adminRoutes';
// dotenv.config();
// const app = express();
// // Connect to database
// connectDB()
//   .then(() => console.log('✅ MongoDB connected successfully'))
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err);
//     process.exit(1);
//   });
// app.use(cors({
//   origin: [
//     "http://localhost:8080",
//     "https://digital-wallet-frontend-sable-seven.vercel.app"
//   ],
//   credentials: true,
// }));
// app.use(morgan('dev'));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cookieParser());
// app.get('/', (req, res) => {
//   res.json({
//     status: 'ok',
//     message: 'Role-wise Wallet API',
//     version: '1.0.0',
//   });
// });
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/agents', agentRoutes);
// app.use('/api/admin', adminRoutes);
// app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error('❌ Error:', err.message);
//   if (err.message === 'Not allowed by CORS') {
//     return res.status(403).json({ error: 'CORS_ERROR', message: 'Request origin not allowed' });
//   }
//   res.status(err.status || 500).json({
//     error: 'SERVER_ERROR',
//     message: err.message || 'Something went wrong',
//   });
// });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const agentRoutes_1 = __importDefault(require("./routes/agentRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
const allowedOrigins = [
    'http://localhost:8080',
    'https://digital-wallet-frontend-sable-seven.vercel.app'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
if (process.env.NODE_ENV !== 'production')
    app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Lazy MongoDB connection (serverless-friendly)
app.use(async (req, res, next) => {
    try {
        await (0, db_1.default)();
        next();
    }
    catch (error) {
        next(error);
    }
});
// Test route
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Role-wise Wallet API',
        version: '1.0.0',
    });
});
// API routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/agents', agentRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'CORS_ERROR', message: 'Request origin not allowed' });
    }
    res.status(err.status || 500).json({
        error: 'SERVER_ERROR',
        message: err.message || 'Something went wrong',
    });
});
// **Export app for serverless**
exports.default = app;
