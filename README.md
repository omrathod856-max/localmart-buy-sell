# 🛒 LocalMart — Buy & Sell Marketplace

A full-stack, production-ready buy-and-sell marketplace built with the MERN stack.

[![CI/CD](https://github.com/omrathod856-max/localmart-buy-sell/actions/workflows/ci.yml/badge.svg)](https://github.com/omrathod856-max/localmart-buy-sell/actions/workflows/ci.yml)

## 🌐 Live URLs

| Component | URL |
|-----------|-----|
| **Frontend** | Pending Vercel deployment |
| **Backend API** | Pending Render deployment |
| **Health Check** | Pending Render deployment |
| **DB Health** | Pending Render deployment |

## 🏗️ Architecture

```
localmart-buy-sell/
├── client/                 # React + Vite frontend (Vercel)
│   ├── src/
│   │   ├── api/            # Axios centralized API client
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Route pages
│   │   └── utils/          # Constants & helpers
│   └── vercel.json         # SPA rewrite rules
├── server/                 # Node.js + Express backend (Render)
│   └── src/
│       ├── config/         # DB, Cloudinary, Logger
│       ├── controllers/    # Route handlers
│       ├── middleware/      # Auth, upload, validation
│       ├── models/         # Mongoose schemas
│       └── routes/         # Express routers
└── .github/workflows/      # CI/CD pipeline
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### Backend Setup
```bash
cd server
cp .env.example .env
# Fill in your MONGODB_URI, JWT_SECRET, CLOUDINARY_* values
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

## 🔧 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/localmart
JWT_SECRET=your-secret-min-32-chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Health
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/health` | ❌ | Server health |
| GET | `/api/health/db` | ❌ | Database health |

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get profile |
| PUT | `/api/auth/profile` | ✅ | Update profile |

### Products
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/products` | ❌ | List products (filter/sort/paginate) |
| GET | `/api/products/:id` | ❌ | Get product |
| POST | `/api/products` | ✅ | Create product |
| PUT | `/api/products/:id` | ✅ | Update product (owner only) |
| DELETE | `/api/products/:id` | ✅ | Delete product (owner only) |
| GET | `/api/products/my-listings` | ✅ | My listings |

### Upload
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/upload/image` | ✅ | Upload image to Cloudinary |
| DELETE | `/api/upload/image/:publicId` | ✅ | Delete image |

## 🚢 Deployment Guide

### 1. MongoDB Atlas
1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free M0 cluster
3. Database name: `localmart`
4. Create a user with read/write permissions
5. Allow network access from `0.0.0.0/0`
6. Copy connection string to `MONGODB_URI`

### 2. Cloudinary
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name, API Key, API Secret
3. Add to environment variables

### 3. GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit: LocalMart full-stack app"
git remote add origin https://github.com/YOUR_USERNAME/localmart-buy-sell.git
git push -u origin main
```

### 4. Render (Backend)
1. Create account at [render.com](https://render.com)
2. New → Web Service → Connect GitHub
3. Select `localmart-buy-sell` repository
4. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `20`
5. Add environment variables (see above)
6. Deploy

### 5. Vercel (Frontend)
1. Create account at [vercel.com](https://vercel.com)
2. Import `localmart-buy-sell` from GitHub
3. Settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add `VITE_API_URL=https://YOUR-RENDER-URL.onrender.com/api`
5. Deploy

### 6. Update CORS
After deploying frontend, update `CLIENT_URL` in Render environment to your Vercel URL.

## 🔒 Security Features

- 🛡️ Helmet (security headers)
- 🚦 Rate limiting (100 req/15min global, 20 req/hour for auth)
- 🔐 JWT Bearer token authentication
- 🔑 bcrypt password hashing (12 rounds)
- 🧹 MongoDB sanitization (NoSQL injection protection)
- ✅ Input validation (express-validator)
- 📁 File type & size validation
- 🔏 Owner-only CRUD operations
- 🚫 No stack traces in production errors
- 🌐 CORS restricted to specific origins

## 📊 Monitoring

- **Render Logs**: Dashboard → Web Service → Logs
- **Vercel Logs**: Dashboard → Project → Functions
- **Health checks**: `/api/health` and `/api/health/db`

## 🧪 Running Tests

```bash
# Backend tests
cd server && npm test

# Frontend build validation
cd client && npm run build
```

## 📱 Features

- 🛒 **Browse & Search** — Find products by keyword, category, condition, price range
- 📸 **Image Upload** — Cloudinary-powered image storage
- 🔐 **Authentication** — Register, login, JWT-protected routes
- 📝 **Product CRUD** — Create, read, update, delete listings
- 👤 **User Profiles** — Name, phone, location, bio
- 📱 **Mobile Responsive** — Works on all screen sizes
- 🔍 **Filters & Sort** — Advanced product discovery
- 🚀 **CI/CD** — Auto-deploy on push to main

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Images | Cloudinary |
| Auth | JWT + bcrypt |
| Hosting (FE) | Vercel |
| Hosting (BE) | Render |
| CI/CD | GitHub Actions |
