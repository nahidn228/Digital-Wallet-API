# 💳 Digital Wallet Backend API

A secure, modular backend API for a digital wallet system (similar to **Bkash** or **Nagad**) built with **Express.js**, **TypeScript**, and **MongoDB** **Mongoose**. This system enables users to register, manage wallets, and perform core financial operations with role-based access control.


---

## 🚀 Features

### Core Functionality
- JWT-based authentication with role-based authorization
- Secure password hashing using **bcrypt**
- Automatic wallet creation during user registration
- Multi-role system: `Admin`, `User`, `Agent`
- Complete transaction management with audit trails
- Real-time balance management

### User Capabilities
- Register and manage account
- Deposit money to wallet
- Withdraw funds securely
- Send money to other users
- View transaction history
- Change password and manage profile

### Admin Controls
- View all users and wallets
- Manage user status (block/unblock)
- Monitor all transactions
- Update wallet status
- System-wide oversight

---

## 🛠️ Tech Stack

| Category       | Technology |
|----------------|------------|
| Runtime        | Node.js |
| Framework      | Express.js |
| Language       | TypeScript |
| Database       | MongoDB + Mongoose ODM |
| Auth           | JWT (JSON Web Tokens) |
| Security       | bcrypt (Password hashing) |
| Validation     | Zod |
| Config         | dotenv |

---

## 📋 Prerequisites
- Node.js v16+
- MongoDB v5.0+
- npm or yarn

---

## ⚡ Installation

```bash
# Clone repository
git clone https://github.com/nahidn228/Digital-Wallet-API.git
cd Digital-Wallet-API

# Install dependencies
npm install

```

## Environment Setup

### Create a .env file in the root:

```bash
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/digital_wallet

# JWT Secrets
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Other configurations
BCRYPT_SALT_ROUNDS=10
DEFAULT_WALLET_BALANCE=50

```