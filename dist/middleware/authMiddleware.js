"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        const user = await User_1.default.findById(decoded.id).select('-password');
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'User not found or inactive' });
        }
        // attach to req
        // @ts-ignore
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        // @ts-ignore
        const role = req.user?.role;
        if (!roles.includes(role)) {
            return res.status(403).json({ message: `Role ${role} is not authorized to access this route` });
        }
        next();
    };
};
exports.authorize = authorize;
