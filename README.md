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

## 📄 API Endpoints Documentation

---

### 🔑 Authentication Endpoints

| Method | Endpoint                   | Description         | Access  |
|--------|----------------------------|---------------------|---------|
| POST   | `/api/auth/register`       | User registration   | Public  |
| POST   | `/api/auth/login`          | User login          | Public  |
| POST   | `/api/auth/refreshToken`   | Refresh JWT token   | Public  |
| POST   | `/api/auth/changePassword` | Change password     | Auth    |
| POST   | `/api/auth/resetPassword`  | Reset password      | Auth    |
| POST   | `/api/auth/logout`         | Logout user         | Auth    |

---

### 👤 User Management Endpoints

| Method | Endpoint                        | Description         | Roles |
|--------|---------------------------------|---------------------|-------|
| GET    | `/api/user`                     | Get all users       | Admin |
| GET    | `/api/user/:email`              | Get user by email   | All   |
| GET    | `/api/user/profile/:userId`     | Get user by ID      | Admin |
| PUT    | `/api/user/:email`              | Update user         | All   |
| PATCH  | `/api/user/status/:userId`      | Update status       | Admin |
| DELETE | `/api/user/:userId`             | Delete user         | Admin |

---

### 💼 Wallet Management Endpoints

| Method | Endpoint                        | Description            | Roles |
|--------|---------------------------------|------------------------|-------|
| GET    | `/api/wallet/:userId`           | Get wallet by user ID  | Admin |
| GET    | `/api/wallet/profile/:email`    | Get wallet by email    | All   |
| POST   | `/api/wallet/deposit`           | Deposit to wallet      | All   |
| POST   | `/api/wallet/withdraw`          | Withdraw from wallet   | All   |
| PATCH  | `/api/wallet/status/:email`     | Update wallet status   | Admin |

---

### 💸 Transaction Endpoints

| Method | Endpoint                         | Description                | Roles |
|--------|----------------------------------|----------------------------|-------|
| POST   | `/api/transaction/deposit`       | Create deposit             | All   |
| POST   | `/api/transaction/withdraw`      | Create withdrawal          | All  |
| POST   | `/api/transaction/sendMoney`        | Send money to another user | All  |
| GET    | `/api/transaction/history/:walletId`| Get wallet transactions| All   |
| GET    | `/api/transaction/transaction`      | Get all transactions   | Admin |
| PATCH  | `/api/transaction/status/:id`       | Change transaction status| Admin |

---

## 🔐 Authentication & Authorization

### Roles
- **Admin** – Full system access  
- **User** – Wallet operations & history  
- **Agent** – *(Future)* Cash-in/out  

### JWT Token Structure
```json
{
  
  "email": "user@example.com",
  "role": "User"
}

```


## 📊 Example Requests and Response 

### 📝 User Registration

```http

POST /api/auth/register
{
            "name": "Md. Hasan",
            "email": "nHasan2@example.com",
            "phone": "+8801711111118",
            "password": "Hasan@123",
            "role": "User"
}

```

### 💰 Deposit Money

```http

POST /api/wallet/deposit
{
    "userId" : "689b75eb689a670988933526",
    "amount": 50000
}

```

### 💸 Send Money

```http

POST /api/transaction/sendMoney
{
    "receiverId" : "689b75eb689a670988933256",
    "senderId" : "689cc401b4a70b67156ef237",
    "amount": 500
}

```

---


## 📦 Response Format

### ✅ Success

```json
{
    "success": true,
    "message": "Money sent successfully",
    "data": {
        
    }
}

```

### ❌ Error

```json
{
  "success": false,
  "message": "Internal Server Error",
  "errorMessages": []
}

```


## 📈 Future Enhancements
- Agent role cash-in/cash-out
- Transaction fees & commissions
- Transaction limits
- Email/SMS notifications
- Two-factor authentication
- API rate limiting
- Advanced analytics
- Mobile app integration
- Payment gateway support

---

## 👥 Contact
**Developer:** Nahid Hasan  
**Email:** nahidn228@gmail.com  
**LinkedIn:** [LinkedIn](https://www.linkedin.com/in/nahid-hasan01/)  
**GitHub:** [GitHub](https://github.com/nahidn228)  

---

## 🙏 Acknowledgments
- Inspired by Bangladesh's fintech revolution (**Bkash**, **Nagad**)  
- Built with modern backend best practices  
- Thanks to the **Programming Hero** ❤️
- Thanks to the open-source community ❤️


