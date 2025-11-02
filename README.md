# Digital Wallet Backend

This is the backend server for the Digital Wallet application, built with Node.js, Express, TypeScript, and MongoDB.

## Project Structure

```
digital-wallet-backend/
├── api/
│   └── index.ts          # API entry point for serverless functions
├── src/
│   ├── server.ts         # Express server setup
│   ├── config/
│   │   └── db.ts         # Database configuration
│   ├── controllers/      # Request handlers
│   │   ├── adminController.ts
│   │   ├── authController.ts
│   │   └── transactionController.ts
│   ├── middleware/       # Express middleware
│   │   ├── authMiddleware.ts
│   │   └── validationMiddleware.ts
│   ├── models/          # MongoDB models
│   │   ├── Transaction.ts
│   │   └── User.ts
│   ├── routes/          # API routes
│   │   ├── adminRoutes.ts
│   │   ├── agentRoutes.ts
│   │   ├── authRoutes.ts
│   │   └── userRoutes.ts
│   ├── scripts/         # Utility scripts
│   │   └── seed.ts      # Database seeding
│   └── types/          # TypeScript type definitions
└── vercel.json         # Vercel deployment configuration
```

## Features

- **Authentication**: Complete JWT-based authentication system
- **User Management**: Admin, Agent, and regular user role management
- **Transaction Handling**: Secure digital wallet transactions
- **Input Validation**: Request validation middleware
- **Database Integration**: MongoDB with Mongoose ORM
- **Type Safety**: Full TypeScript implementation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- TypeScript

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd digital-wallet-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
   
   You can change these credentials in the `.env` file before running the application.

4. Build the TypeScript code:
   ```bash
   npm run build
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Admin Routes
- `GET /api/admin/users` - Get all users
- `GET /api/admin/agents` - Get all agents
- `POST /api/admin/create-agent` - Create new agent

### User Routes
- `GET /api/user/balance` - Get user balance
- `POST /api/user/transfer` - Transfer money
- `GET /api/user/transactions` - Get transaction history

### Agent Routes
- `POST /api/agent/deposit` - Handle deposits
- `POST /api/agent/withdraw` - Process withdrawals

## Error Handling

The application implements comprehensive error handling:
- Input validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Resource not found (404)
- Server errors (500)
- Database connection issues (503)

## Deployment

The backend is configured for deployment on Vercel:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript code
- `npm start` - Start production server
- `npm run seed` - Run database seeding script

## Security Features

- JWT Authentication
- Password Hashing
- Request Validation
- Role-based Access Control
- Secure Headers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
