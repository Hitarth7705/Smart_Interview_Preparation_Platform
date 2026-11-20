# 🚀 Smart Interview Preparation Platform

A full-stack, enterprise-grade learning and interview preparation platform built with the MERN stack. Features structured technical question banks, Data Structures & Algorithms with dual C++/Java solutions, proctored MCQ assessments, an interactive coding environment with real-time compilation, and a SuperMemo SM-2 Spaced Repetition System (SRS) for optimal retention.

---

## 🌐 Live Deployments

| Component | Platform | Live URL / Details |
| :--- | :--- | :--- |
| **Frontend Application** | **Vercel** | [smart-interview-preparation-platfor-khaki.vercel.app](https://smart-interview-preparation-platfor-khaki.vercel.app/login) |
| **Backend REST API** | **Render** | `https://smart-interview-backend.onrender.com` (Health check: `/api/health`) |
| **Database** | **MongoDB Atlas** | Hosted M0 Cloud Cluster (AWS) |
| **Code Execution Engine** | **Judge0 CE** | `https://ce.judge0.com` (C, C++, Java, Python runtime) |
| **Email Service** | **Brevo HTTPS API** (Gmail SMTP for local dev) | 6-digit OTP verification service for password recovery |

---

## 🏗️ Deployment Architecture ("What is Deployed Where")

```
                                  +------------------------------------+
                                  |         End-User Browser           |
                                  +-----------------+------------------+
                                                    |
                                                    | HTTPS Requests
                                                    v
                                  +------------------------------------+
                                  |         Vercel (Frontend)          |
                                  |  - React 18 SPA (React Router v7)  |
                                  |  - Global CDN Distribution         |
                                  |  - Client-Side Rewrites (SPA)      |
                                  +-----------------+------------------+
                                                    |
                                                    | API Calls (CORS)
                                                    v
                                  +------------------------------------+
                                  |          Render (Backend)          |
                                  |  - Node.js & Express REST API      |
                                  |  - JWT Authentication & Bcrypt     |
                                  |  - SRS Algorithm & Business Logic  |
                                  +--------+------------------+--------+
                                           |                  |
                    MongoDB Atlas Protocol |                  | REST Submissions
                                           v                  v
    +--------------------------------------+--+    +----------+-----------------------+
    |         MongoDB Atlas (Database)        |    |         Judge0 CE Engine          |
    |  - Users, SRS Cards & Attempt Logs      |    |  - Multi-language sandbox runner |
    |  - DSA & Technical Interview Question DB|    |  - Test case input/output check  |
    |  - MCQ Question Banks & Coding Problems |    |  - C, C++, Java, Python 3        |
    +-----------------------------------------+    +----------------------------------+
```

---

## 🎯 Key Features & Modules

### 💻 1. Interactive Coding Practice *(New)*
- **In-Browser Code Editor**: Integrated Monaco Editor (VS Code engine) with syntax highlighting, auto-indentation, and theme selection.
- **Multi-Language Execution**: Run and submit code in **C**, **C++**, **Java**, and **Python 3**.
- **Real-Time Code Evaluation**: Powered by Judge0 CE API for compiling, executing, and evaluating test cases with CPU and memory limits.
- **Problem Filtering & Progress**: Filter by difficulty (*Easy, Medium, Hard*) and topic (*Arrays, Strings, Dynamic Programming, etc.*). Tracks accepted submissions per user.

### 🛡️ 2. Proctored MCQ Assessment System *(New)*
- **Category-Based Quizzes**: 50+ multiple-choice questions across 10 specialized CS domains.
- **Anti-Cheat Proctoring Hook**: Automatic fullscreen enforcement, window blur / tab-switch tracking, and penalty warnings.
- **Timed Assessments**: Real-time countdown timer with instant scoring, answer explanations, and performance metrics.

### 🧠 3. Spaced Repetition System (SRS)
- **SuperMemo SM-2 Algorithm**: Automatically schedules questions for review based on user recall quality ratings (0–5).
- **Adaptive Memory Scheduling**: Calculates repetition counts, easiness factors ($E$-factor), and review intervals to maximize long-term retention.
- **Due Cards Queue & Statistics**: Dedicated practice queue showing items due today, overall recall accuracy, and retention streaks.

### 🔢 4. Data Structures & Algorithms (DSA)
- **Curated Problem Catalog**: 50+ hand-picked algorithmic challenges with difficulty tiers and category tags.
- **Dual Solutions**: Reference implementations in both **C++** and **Java** with detailed time and space complexity explanations.
- **Status Tracking**: Mark problems as *Solved*, *Attempted*, or *Bookmarked*.

### 📚 5. Technical Interview Questions
- **Comprehensive Question Bank**: 100+ curated interview questions across Frontend (React, HTML/CSS, JS), Backend (Node.js, Express, REST), Databases (MongoDB, SQL), and Core CS (OS, OOPs, DBMS, CN).
- **One-Click Add to SRS**: Convert any interview question into a spaced-repetition flashcard with one click.

### 📊 6. Profile & Performance Dashboard
- **Visual Analytics**: Interactive category-wise progress bars, total practice sessions, and completion badges.
- **Activity Log**: Detailed chronological log of attempts, scores, and review histories.

### 🔐 7. Security & Authentication
- **JWT & Password Hashing**: JSON Web Tokens with HTTP authorization headers and salted bcryptjs password encryption.
- **OTP Password Recovery**: Secure 6-digit OTP delivery by email (Brevo API) with 10-minute expiration, hashed storage, a 5-attempt limit and a 60-second resend cooldown.

---

## 📁 Updated Project Structure

```
Smart_Interview_Preparation_Platform/
│
├── backend/                               # Express REST API
│   ├── config/
│   │   ├── db.js                         # Primary MongoDB Atlas connection
│   │   └── emailDb.js                    # Secondary/fallback email DB connection
│   ├── data/
│   │   ├── questionsData.js              # Technical interview questions dataset
│   │   ├── dsaData.js                    # DSA questions & solutions dataset
│   │   └── mcqData.js                    # MCQ quiz questions dataset
│   ├── middleware/
│   │   └── authMiddleware.js             # JWT verification middleware
│   ├── models/
│   │   ├── User.js                       # User credentials, profile & stats
│   │   ├── InterviewQuestion.js          # Interview questions schema
│   │   ├── DSAQuestion.js                # DSA problems schema
│   │   ├── MCQQuestion.js                # MCQ quiz schema
│   │   ├── SRSCard.js                    # Spaced repetition cards schema
│   │   ├── CodingQuestion.js             # Coding challenge problem schema
│   │   ├── CodingSubmission.js           # Code run & submission results
│   │   ├── EmailConfig.js                # Encrypted Gmail credential storage
│   │   └── OtpToken.js                   # Password reset OTP token model
│   ├── routes/
│   │   ├── authRoutes.js                 # Login, Register, Forgot Password, OTP
│   │   ├── questionRoutes.js             # Technical questions API
│   │   ├── dsaRoutes.js                  # DSA problems API
│   │   ├── mcqRoutes.js                  # MCQ quiz & grading API
│   │   ├── profileRoutes.js              # User statistics & profile API
│   │   ├── srs.js                        # SRS cards, due-queue & reviews
│   │   └── codingRoutes.js               # Random coding question, run & submit
│   ├── services/
│   │   └── judge0Service.js              # Judge0 CE submission & polling service
│   ├── utils/
│   │   ├── encryption.js                 # AES-256-GCM credential encryption
│   │   ├── mailer.js                     # OTP email dispatch (Brevo / Resend / Gmail SMTP)
│   │   └── srsAlgorithm.js               # SuperMemo SM-2 algorithm calculation
│   ├── seedCodingQuestions.js            # Coding challenges database seeder
│   ├── seedDSA.js                        # DSA problems database seeder
│   ├── seedMCQ.js                        # MCQ questions database seeder
│   ├── seedQuestions.js                  # Technical questions database seeder
│   ├── server.js                         # Express entry point & static handler
│   ├── .env.example                      # Backend environment template
│   └── package.json
│
├── frontend/                              # React 18 Single Page Application
│   ├── public/
│   │   ├── _redirects                    # Netlify SPA routing redirect
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Global navigation header
│   │   │   └── SRS/
│   │   │       ├── SRSPractice.jsx       # Flashcard flip & rating component
│   │   │       └── SRSStats.jsx          # Memory retention rate charts
│   │   ├── hooks/
│   │   │   └── useQuizProctoring.js      # Fullscreen & tab-switch detector hook
│   │   ├── pages/
│   │   │   ├── Login.jsx                 # User sign-in
│   │   │   ├── Register.jsx              # New account registration
│   │   │   ├── ForgotPassword.jsx        # OTP-based password reset
│   │   │   ├── Dashboard.jsx             # User analytics & overview
│   │   │   ├── Questions.jsx             # Technical interview question bank
│   │   │   ├── DSA.jsx                   # DSA problem explorer with C++/Java
│   │   │   ├── QuizPage.jsx              # Proctored MCQ quiz assessment
│   │   │   ├── CodingPractice.jsx        # Monaco Editor & live execution
│   │   │   └── Profile.jsx               # User profile management
│   │   ├── config.js                     # API base URL resolver (REACT_APP_API_URL)
│   │   ├── App.jsx                       # React Router v7 routes
│   │   └── index.js
│   ├── vercel.json                       # Vercel SPA rewrite configuration
│   ├── .env.example                      # Frontend environment template
│   └── package.json
│
├── render.yaml                            # Render Blueprint multi-service deployment
├── vercel.json                            # Root-level Vercel configuration
├── package.json                           # Root convenience scripts & dependencies
└── README.md
```

---

## 💻 Local Setup & Development Instructions

Follow these step-by-step instructions to clone, configure, seed, and run the entire application locally.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: v18.x or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.x or higher (bundled with Node)
- **Git**: ([Download Git](https://git-scm.com/))
- A free **MongoDB Atlas URI** (or local MongoDB running at `mongodb://localhost:27017/interviewdb`)

---

### 2. Clone the Repository

```bash
git clone https://github.com/Hitarth7705/Smart_Interview_Preparation_Platform.git
cd Smart_Interview_Preparation_Platform
```

---

### 3. Install All Dependencies

You can install dependencies for both `backend` and `frontend` in a single command from the project root:

```bash
npm run install:all
```

*(Alternatively, install them individually)*:
```bash
# In backend directory
cd backend && npm install && cd ..

# In frontend directory
cd frontend && npm install && cd ..
```

---

### 4. Configure Environment Variables

#### A. Backend Environment
Create a `.env` file inside the `backend/` folder:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and update the values:

```env
# MongoDB Connection String (MongoDB Atlas or Local MongoDB)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/InterviewDB?retryWrites=true&w=majority

# JWT Authentication Secret (Use any random strong string)
JWT_SECRET=my_super_secret_jwt_key_12345

# Server Port
PORT=5000

# Password Reset OTP email (free Brevo account, works on Render free tier)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=the_sender_address_you_verified_in_brevo
MAIL_FROM_NAME=Smart Interview Prep

# Local development only (SMTP is blocked on Render free tier)
# MAIL_USER=your_email@gmail.com
# MAIL_PASS=your_16_digit_gmail_app_password

# Code Execution API (Optional - defaults to public Judge0 CE)
JUDGE0_URL=https://ce.judge0.com

# 64-Hex Character Encryption Key (Optional)
EMAIL_ENCRYPTION_KEY=7dda242ba57bf81f7d654d69f371b0b986d3d17aa69b7ace1d592c19135d66db
```

> [!TIP]
> To get a Gmail App Password: Go to **Google Account** → **Security** → **2-Step Verification** → **App Passwords** → Generate a password for "Mail".

#### B. Frontend Environment
Create a `.env` file inside the `frontend/` folder:

```bash
cp frontend/.env.example frontend/.env
```

Add your local backend address:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

### 5. Seed the Database

Populate your MongoDB database with all interview questions, DSA challenges, MCQs, and coding problems:

```bash
# Run all seed scripts at once from root
npm run seed
```

*(Or run individual seeds from inside the `backend` folder)*:
```bash
cd backend
npm run seed:questions   # Seeds 100+ Interview Questions
npm run seed:dsa         # Seeds 50+ DSA Problems
npm run seed:mcq         # Seeds 50+ MCQ Quiz Questions
npm run seed:coding      # Seeds Interactive Coding Problems
cd ..
```

---

### 6. Run the Application

Open two separate terminal tabs to run both services:

#### Terminal 1 — Start the Backend Server:
```bash
npm run server
# Server will run on: http://localhost:5000
# API Health Check: http://localhost:5000/api/health
```

#### Terminal 2 — Start the React Frontend:
```bash
npm run client
# Client will automatically open at: http://localhost:3000
```

---

## ⚙️ Environment Variables Summary

| Variable | Scope | Required | Description |
| :--- | :--- | :--- | :--- |
| `MONGO_URI` | Backend | **Yes** | MongoDB Atlas connection string |
| `JWT_SECRET` | Backend | **Yes** | Secret key for signing and validating JWTs |
| `PORT` | Backend | No | Port for Express server (Defaults to `5000`) |
| `BREVO_API_KEY` | Backend | **Yes** (Prod) | Brevo API key used to send password-reset OTP emails |
| `BREVO_SENDER_EMAIL` | Backend | **Yes** (Prod) | Sender address verified in Brevo |
| `MAIL_FROM_NAME` | Backend | No | Display name on OTP emails (Defaults to `Smart Interview Prep`) |
| `RESEND_API_KEY` / `RESEND_FROM` | Backend | Optional | Alternative to Brevo; needs your own verified domain to reach other users |
| `MAIL_USER` | Backend | Optional | Gmail address for local-development OTP emails (SMTP is blocked on Render free) |
| `MAIL_PASS` | Backend | Optional | 16-character Gmail App Password (local development only) |
| `JUDGE0_URL` | Backend | No | Judge0 instance URL (Defaults to `https://ce.judge0.com`) |
| `EMAIL_ENCRYPTION_KEY` | Backend | Optional | 64-hex key for database-stored credentials |
| `REACT_APP_API_URL` | Frontend | **Yes** (Prod) | URL of the backend API (e.g. `https://smart-interview-backend.onrender.com`) |

---

## 🚢 Production Deployment Guide

For full instructions on configuring Vercel, Render, and MongoDB Atlas, refer to the [DEPLOYMENT_GUIDE.md](file:///C:/Users/Ayushi%20Shah/.gemini/antigravity/brain/719fd48f-a9bf-4bc2-bb01-773e61f36430/DEPLOYMENT_GUIDE.md).

### Quick Summary:
1. **Database**: In MongoDB Atlas **Network Access**, whitelist `0.0.0.0/0`.
2. **Backend (Render)**:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Set environment variables: `MONGO_URI`, `JWT_SECRET`, `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`.
3. **Frontend (Vercel)**:
   - Root directory: `frontend`
   - Framework preset: `Create React App`
   - Set environment variable: `REACT_APP_API_URL` = `https://<your-render-backend-url>`.

---

## 👤 Authors & Contributors

- **Aayushi Shah** 
- **Hitarth Purani** 
---

## 🙏 Acknowledgments

- [SuperMemo SM-2 Algorithm](https://supermemopedia.com/wiki/SuperMemo_SM-2_Algorithm)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Judge0 CE Open-Source Code Execution](https://judge0.com/)
- [React](https://react.dev) & [Express](https://expressjs.com) communities

---

**Built with ❤️ for smarter, structured technical interview preparation.**
