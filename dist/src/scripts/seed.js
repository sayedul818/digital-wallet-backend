"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const seedAdmin = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || '');
        console.log('✅ Connected to MongoDB');
        // Check if admin exists
        const adminExists = await User_1.default.findOne({ email: 'admin@example.com' });
        if (adminExists) {
            console.log('ℹ️ Admin user already exists');
            process.exit(0);
        }
        // Create admin user
        const adminUser = await User_1.default.create({
            name: 'System Admin',
            email: 'admin@example.com',
            phone: '+8801700000000',
            password: 'admin123', // This will be hashed by the User model pre-save hook
            role: 'admin',
            isActive: true,
            isApproved: true,
            balance: 0
        });
        console.log('✅ Admin user created successfully:', {
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role
        });
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};
seedAdmin();
