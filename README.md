# 🩸 LifeFlow - Blood Donation & Emergency Match Platform (MERN Stack)

> A modern, full-stack **MERN** (MongoDB, Express, React, Node.js) Blood Donation & Emergency Hospital Match System designed specifically for instant, zero-configuration deployment to **Vercel**.

---

## 🌟 Key Features

### 1. 🔍 Donor Finder & Smart Compatibility Matcher
- Filter voluntary donors by **Blood Group** (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), **City**, and **Live Availability**.
- **Medical Blood Compatibility Engine**: Automatically matches compatible donors for any recipient type (e.g. Type `O-` universal donors for emergency transfusions).
- One-click direct phone call and WhatsApp contact integration.

### 2. 🚨 Emergency Blood Requests & SOS Board
- Urgent blood request broadcasts with priority levels (`Emergency`, `Urgent`, `Standard`).
- **Interactive Pledging System**: Registered or voluntary donors can pledge units to patients with a real-time fulfillment progress bar.
- Hospital and staff controls to mark fulfilled or active orders.

### 3. 🏥 Blood Bank Inventory System
- Real-time stock levels for all 8 blood groups across hospital reserves.
- Threshold indicators:
  - 🔴 **Critical Shortage** (≤ 5 units)
  - 🟡 **Low Reserve** (6 - 15 units)
  - 🟢 **Adequate Reserve** (16+ units)
- Hospital Staff/Admin live unit adjustments.

### 4. 🏕️ Community Blood Donation Drives & Camps
- Upcoming blood drives organized by Red Cross, Rotary, and medical hospitals.
- Donor attendance registration with one-click signup.
- Scheduling portal for certified hospitals to organize new drives.

### 5. 📋 Self-Assessment Donor Eligibility Tool
- Interactive checklist (Age 18-65, Weight ≥ 50kg, 90-day cooldown interval, general health) delivering instant eligibility verdicts.

### 6. 🔐 Dual-Mode Authentication & 1-Click Demo Accounts
- Secure JWT-based registration and login with bcrypt password hashing.
- **1-Click Demo Logins** (Donor `O-`, Hospital Staff, System Admin) allowing reviewers and recruiters to test all features instantly without typing credentials!
- **Resilient Mock/Atlas Auto-Switch**: If `MONGODB_URI` is not set or times out, the backend gracefully runs with pre-populated in-memory seed data, ensuring your Vercel deployment never shows blank 500 errors!

---

## 📁 Project Architecture

```
blood-donation-system/
├── api/
│   └── index.js                     # Single Vercel serverless entrypoint
├── backend/                         # Express API implementation
│   ├── config/
│   │   └── db.js                    # Cached Mongoose connection + In-Memory fallback
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, Demo bypass, Profile
│   │   ├── donorController.js       # Search, Filter, Compatibility matcher
│   │   ├── requestController.js     # Post requests, Statuses, Pledges
│   │   ├── inventoryController.js   # 8 blood group stock levels
│   │   ├── campController.js        # Donation drives & attendee registration
│   │   └── statsController.js       # Platform analytics & lives saved
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification & role authorization
│   │   └── errorHandler.js          # Central error responses
│   ├── models/                      # User, BloodRequest, BloodInventory, BloodCamp
│   ├── routes/                      # Modular REST route handlers
│   ├── data/
│   │   └── mockData.js              # Seed data for immediate demo mode
│   └── index.js                     # Express app exported for Vercel Serverless
├── client/                          # React 18 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/              # Navbar, Footer, EmergencyBanner, Modals
│   │   ├── context/                 # AuthContext
│   │   ├── pages/                   # Home, FindDonors, BloodRequests, CreateRequest,
│   │   │                            # BloodInventory, DonationCamps, Login, Register, Dashboard
│   │   └── services/api.js          # API service client
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js               # Dev proxy to port 5000
│   └── package.json
├── server.js                        # Local Express server runner (Port 5000)
├── vercel.json                      # Vercel deployment & API rewrite configuration
├── package.json                     # Root dependencies & build scripts
├── test-e2e.js                      # 10/10 automated test runner
└── .env.example                     # Environment variables template
```

---

## 🚀 How to Deploy on Vercel

This repository is already configured with `vercel.json` to automatically build the React Vite client to `client/dist` and route all `/api/*` traffic to `/api/index.js` as a Vercel Serverless Function.

### Method 1: Deploy using GitHub (Recommended)

1. **Initialize Git and Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - LifeFlow Blood Donation System"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** > **"Project"**.
   - Select your GitHub repository.
   - Vercel will automatically detect the settings from `vercel.json`:
     - **Build Command**: `npm run build`
     - **Output Directory**: `client/dist`
   - Under **Environment Variables**, add:
     - `MONGODB_URI`: Your MongoDB Atlas connection string (see below)
     - `JWT_SECRET`: Any random secure string (e.g. `lifeflow_production_secret_key_2026`)
     - `NODE_ENV`: `production`
   - Click **Deploy**!

### Method 2: Deploy using Vercel CLI

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. In the project root, simply run:
   ```bash
   vercel
   ```
3. Follow the CLI prompts (accept defaults).
4. For production:
   ```bash
   vercel --prod
   ```

---

## 🍃 Setting Up MongoDB Atlas (Optional)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Cluster**.
3. Under **Database Access**, create a user with read/write access.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere, necessary for Vercel Serverless).
5. Click **Connect** > **Drivers** (Node.js) and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/blood_donation?retryWrites=true&w=majority
   ```
6. Add this string as `MONGODB_URI` in your Vercel Project Settings or local `.env`.

> 💡 **Notice**: If `MONGODB_URI` is omitted or unavailable, the application automatically switches to **In-Memory Mock Mode** with 8+ donors and live requests so your Vercel preview always works 100%!

---

## 💻 Local Development

### 1. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Both Frontend and Backend Concurrently
```bash
npm run dev
```
- **React Frontend**: [http://localhost:5173](http://localhost:5173)
- **Express Backend**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 4. Run Automated Tests
```bash
npm test
```
Executes all 10 end-to-end integration tests verifying health checks, donors, requests, pledges, inventory, camps, and auth.

---

## 🔒 Demo Credentials

You can use the 1-click demo buttons on the login page or manually use:

| Role | Email | Password | Blood Group |
|---|---|---|---|
| **Donor** | `rajesh.donor@lifeflow.org` | `demo123` | `O-` |
| **Hospital Staff** | `hospital@lifeflow.org` | `demo123` | `O+` |
| **System Admin** | `admin@lifeflow.org` | `demo123` | `O-` |

---

## 📄 License
MIT License. Free for medical organizations, NGOs, and humanitarian causes.
