# Smart_Interview_Preparation_Platform# Smart Interview Prep - React Frontend

## Project Structure

```
src/
├── App.jsx                    # Main router
├── index.js                   # Entry point
└── pages/
    ├── Login.jsx              # Login page
    ├── Register.jsx           # Register page
    ├── Dashboard.jsx          # Dashboard page
    └── ForgotPassword.jsx     # Forgot Password (3-step OTP flow)
```

## Routes

| Path              | Component        |
|-------------------|-----------------|
| `/`               | → redirects to `/login` |
| `/login`          | Login page       |
| `/register`       | Register page    |
| `/dashboard`      | Dashboard (protected) |
| `/forgot-password`| Forgot Password  |

## Forgot Password Flow

1. **Step 1 – Enter Email**: User enters registered email → OTP is sent
2. **Step 2 – Enter OTP**: User enters the 6-digit OTP from email
3. **Step 3 – New Password**: User sets new password → redirected to Login

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the React App

```bash
npm start
```
The app will run at `http://localhost:3000`

### 3. Backend Setup (existing)

Go to the `backend/` folder and:

```bash
npm install
```

Replace `backend/routes/authRoutes.js` with the provided `authRoutes_updated.js`
(this adds the 3 new endpoints: `/forgot-password`, `/verify-otp`, `/reset-password`)

Then start the backend:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`

### 4. Email Configuration (Production)

In `authRoutes_updated.js`, the OTP is currently logged to the console.
To send real emails, install nodemailer:

```bash
npm install nodemailer
```

Then replace the console.log line with:
```js
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Your OTP Code",
  text: `Your OTP is: ${otp}. Valid for 10 minutes.`
});
```

Add to your `.env`:
```
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```
