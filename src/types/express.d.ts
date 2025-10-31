import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // will be populated by auth middleware
    }
  }
}

export {};
