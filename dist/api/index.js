"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../src/server"));
const http_1 = require("http");
// Wrap Express app for Vercel serverless
const server = (0, http_1.createServer)(server_1.default);
exports.default = (req, res) => {
    server.emit('request', req, res);
};
