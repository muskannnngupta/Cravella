# Cravella 🍕 — Every Craving, Delivered

Cravella is a modern, high-performance, and feature-rich full-stack food delivery application built using the MERN stack. Designed with a premium **Zomato-themed UI**, Cravella supports a fully-functional customer ordering portal, real-time status updates via WebSockets, an interactive admin management center, and robust multi-tier SMTP email verification.

---

## 🎨 Unique Features & UX Highlights

### ⚡ Real-Time Tracking & Chronological Feeds
* **WebSockets Live Sync**: Powered by `Socket.io` rooms, order status updates (Preparing 🥣 ➔ Out for Delivery 🚴 ➔ Delivered 🎉) push instantly from the Admin Panel to the user's active orders view without requiring page refreshes.
* **Sorted Order History**: Database queries are configured to sort historical orders chronologically (`sort({date: -1})`), displaying the newest deliveries first on both customer and administrator feeds.

### 🔐 SMTP Email Verification & Security
* **Sign Up OTP Verification**: New accounts are created in an unverified state (`isVerified: false`). A 6-digit OTP code is instantly emailed to activate the profile.
* **Two-Step Login OTP**: Protects user credentials by requiring a secondary 5-minute login verification code sent directly to their email.
* **Automated Login Security Alerts**: Emails a notification immediately upon detection of a successful login on the user's account, specifying the login timestamp.
* **Unverified Login Interceptor**: Automatically redirects users with pending activations to the verification portal upon login, dispatching a new OTP code.
* **Anti-Double Submission**: Features custom spinning load animations on all verification buttons, disabling them during API requests to prevent double-submissions.

### 🌓 Obsidian Dark Mode (No-Flash Load)
* Integrated a custom dark mode palette using a premium Obsidian & Slate theme.
* **Zero-Flash Navigation**: Utilizes a synchronous inline script in `index.html` that reads settings from `localStorage` before the React DOM compiles. This completely eliminates the annoying "light-mode flash" during page refreshes or route changes.

### 📊 Admin Analytics Center & Dashboards
* Features a centralized analytics dashboard calculating live business metrics (Total users, orders, revenue, and delivery rates).
* Includes responsive, custom-coded CSS bar charts visualizing weekly revenue gains.

### 🎟️ Dynamic Coupons & Reviews
* **Interactive Reviews**: Users can rate dishes using an interactive star-rating form in their Order History, displaying average ratings and comments directly on the food detail modals.
* **Dynamic Promo Codes**: Supports backend-validated promotional codes that automatically apply flat discounts to customer shopping carts on checkout.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js (Vite), Context API, CSS3 Variables, Socket.io-client, Axios |
| **Backend** | Node.js, Express.js, Socket.io, Nodemailer (SMTP), Mongoose |
| **Database** | MongoDB Atlas (Cloud Database) |
| **Hosting** | Vercel (Frontend & Admin), Render (Backend Service) |

---

## ⚙️ Project Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your machine.
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database cluster.
* Gmail SMTP App Password (for email notifications).

### 1. Clone the Repository
```bash
git clone https://github.com/muskannnngupta/Cravella.git
cd Cravella
```

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory:
   ```env
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Frontend` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   ```
4. Run the frontend application:
   ```bash
   npm run dev
   ```

### 4. Admin Panel Configuration
1. Navigate to the admin directory:
   ```bash
   cd ../admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `admin` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   ```
4. Run the admin panel:
   ```bash
   npm run dev
   ```

---

## 🚀 Live Hosting Configuration

To deploy the application live, configure the respective build settings on **Render** and **Vercel**:

### Backend (Render Web Service)
* **Root Directory**: `Backend`
* **Build Command**: `npm install`
* **Start Command**: `node server.js`
* **Environment Variables**: Add `EMAIL_USER`, `EMAIL_PASS`, and `JWT_SECRET`.

### Frontend & Admin (Vercel)
* **Root Directory**: `Frontend` (for user website) / `admin` (for admin dashboard)
* **Framework Preset**: `Vite`
* **Environment Variables**: Add `VITE_BACKEND_URL` pointing to your live Render backend URL.
