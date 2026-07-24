# SMART INTERVIEW PREPARATION PLATFORM
## Internship Report: MERN Stack Full-Stack Development Project

**Student ID:** 202512101  
**Submission Date:** July 24, 2026  

---

## Table of Contents
1. Introduction
2. System Architecture & Context Diagram Verification
3. Scope Statement
4. Detailed Use Cases
5. Design Contribution & Database Schema
6. Programming Contribution & Implementation Details
7. Tools, Technologies, and Libraries Used
8. Testing Strategies and Reports
9. Innovative Contribution: Spaced Repetition System (SRS)
10. Lessons Learnt and Conclusion
11. Appendix: Project Audit, Bug Fixes, and Discrepancy Analysis

---

## 1. Introduction

### Overview and Purpose
The **Smart Interview Preparation Platform** is a comprehensive, full-stack web application designed to optimize how students and software professionals prepare for technical interviews and competitive programming assessments. Traditional preparation platforms often suffer from a lack of structure, causing learners to practice passively or forget concepts soon after studying. 

To address these inefficiencies, this platform incorporates cognitive science principles by implementing the **SuperMemo SM-2 Spaced Repetition Algorithm**. By intelligently scheduling reviews of technical questions based on the user's active recall performance, the platform shifts learning from short-term memorization to long-term cognitive retention.

### Project Scope and Scale
The platform is built on the modern MERN stack (MongoDB, Express.js, React, Node.js) and delivers a complete learning suite consisting of:
*   **100 Curated Interview Questions** spanning 10 distinct domains (JavaScript, React, Node.js, CSS, HTML, Data Structures, Algorithms, System Design, Behavioral, and Databases).
*   **100 Data Structures and Algorithms (DSA) Problems** covering fundamental topics like Arrays, Strings, Linked Lists, Trees, Graphs, Greedy, Dynamic Programming, and more, complete with detailed JavaScript implementations, algorithmic approaches, and complexity analyses.
*   **50 Multiple Choice Questions (MCQs)** spanning 10 categories to facilitate rapid, self-paced knowledge reinforcement.
*   **Spaced Repetition System (SRS)** with a dedicated tracking card for each attempted question, using the SM-2 algorithm to schedule future reviews.
*   **Personalized Analytics Dashboard** summarizing progress metrics, seen vs. solved counts across modules, and active SRS review counts.
*   **Secure Authentication** using JWT-based token management and password encryption with `bcryptjs`.

### Technical Architecture
The application adheres to clean separation of concerns:
*   **Frontend:** A responsive Single Page Application (SPA) built using React 18+ and React Router v6 for routing, communicating with the API via Fetch.
*   **Backend:** A robust Node.js/Express.js server handling endpoint routing, JSON payloads, authentication middleware, error handling, and business logic.
*   **Database:** MongoDB Atlas (Cloud) serving as a document-based data store accessed via Mongoose ODM.

---

## 2. System Architecture & Context Diagram Verification

The application is structured around a three-tier architectural pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                          │
│                      (React Frontend)                       │
│                                                             │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│   │  Auth Pages  │  │  Dashboard   │  │   Profile Page   │  │
│   └──────────────┘  └──────────────┘  └──────────────────┘  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│   │ Questions Browser││  DSA Viewer │  │   MCQ Quiz UI    │  │
│   └──────────────┘  └──────────────┘  └──────────────────┘  │
│   ┌──────────────────────────────┐    ┌──────────────────┐  │
│   │     SRS Practice Module      │    │  SRS Statistics  │  │
│   └──────────────────────────────┘    └──────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Fetch HTTP Requests + JWT Bearer
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        API LAYER                            │
│                  (Node.js / Express Backend)                │
│                                                             │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│   │  AuthRoutes  │  │  DSA Routes  │  │   ProfileRoutes  │  │
│   └──────────────┘  └──────────────┘  └──────────────────┘  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│   │QuestionRoutes│  │  MCQ Routes  │  │    SRS Routes    │  │
│   └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                             │
│         ┌─────────────────────────────────────────┐         │
│         │        BUSINESS LOGIC INTERNALS         │         │
│         │  - SM-2 Spaced Repetition Calculator    │         │
│         │  - JWT Verification Middleware          │         │
│         │  - Global Error & Exception Handlers    │         │
│         └─────────────────────────────────────────┘         │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM Connections
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                           │
│                      (MongoDB Atlas)                        │
│                                                             │
│     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│     │    Users    │  │  Interview  │  │     DSA     │       │
│     │  Collection │  │  Questions  │  │  Questions  │       │
│     └─────────────┘  └─────────────┘  └─────────────┘       │
│     ┌─────────────┐  ┌─────────────┐                        │
│     │    MCQs     │  │  SRS Cards  │                        │
│     │  Collection │  │  Collection │                        │
│     └─────────────┘  └─────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Layer Details & Communication Flows
1.  **Client Layer:** The user interacts with modular React views. The client manages JWT-based sessions using `localStorage` and appends authentication headers to API requests. 
2.  **API Layer:** Incoming requests pass through standard middleware (CORS, Express JSON parser, and `authMiddleware` for protected routes). Business logic services compute spaced repetition schedules and parse aggregation metrics.
3.  **Data Layer:** Schemas are defined as Mongoose models. Indexes are built on highly queried parameters (such as `userId`, `category`, and `difficulty`) to guarantee sub-second read performance.

---

## 3. Scope Statement

### Project Objectives
*   Provide a single unified prep platform covering standard technical questions, algorithmic DSA coding challenges, and MCQs.
*   Incorporate scientific scheduling (SM-2 SRS) directly into the interview question learning workflow.
*   Deliver real-time tracking metrics and category breakdown visualizations.
*   Enforce modern full-stack development patterns (separation of concerns, robust password security, JWT session protection).

### Features and Deliverables
*   **Interview Questions:** 100 questions organized in 10 categories with toggleable answers and difficulty levels.
*   **DSA Practice:** 100 problems with details on difficulty, complexity constraints, structural explanations, and sample code solutions in JavaScript.
*   **MCQ System:** 50 multiple-choice questions with answer checks, detailed explanation popups, and topic metadata.
*   **Spaced Repetition Practice:** Automatic card initialization when users view interview questions. A queue showing only "due cards" based on current date, giving rating choices 0-5.
*   **Learning Analytics Dashboard:** Displays seen vs. total ratios for questions and DSA, correct answers ratio for MCQs, and active SRS cards statistics.

### Scope Exclusions (Intentionally Left Out)
*   **Code Execution Engine / JDoodle Sandbox:** The platform focuses on learning-by-study, providing verified reference solutions and complexity analysis rather than real-time code compilation and test case runners.
*   **Collaborative Coding:** No real-time sharing, pair programming, or peer review boards.
*   **Video Tutorials:** All materials are text-based for faster cognitive scanning.
*   **AI Chatbots:** Hints and explanations are curated statically to prevent hallucinated answers.

---

## 4. Detailed Use Cases

### UC1: Browse and Study Interview Questions
*   **Precondition:** User is authenticated and logged into the system.
*   **Flow:** User navigates to the **Questions** tab $\rightarrow$ Filters by category/difficulty $\rightarrow$ Clicks a question card $\rightarrow$ Marks as seen in database (automatically enqueuing it in the Spaced Repetition queue).
*   **Postcondition:** User's profile stats are updated, and a new SRS tracking card is generated.

### UC2: Study Data Structures and Algorithms Problems
*   **Precondition:** User is authenticated.
*   **Flow:** User navigates to the **DSA** tab $\rightarrow$ Filters by topic (e.g., Arrays, Trees, Graphs) $\rightarrow$ Reviews problem definition, time/space complexity bounds, and the step-by-step approach $\rightarrow$ Toggles reference solution code $\rightarrow$ Marks as solved/unsolved.
*   **Postcondition:** Solved/seen lists are updated in the database and visible in dashboard.

### UC3: Take Multiple-Choice Quiz Assessment
*   **Precondition:** User is authenticated.
*   **Flow:** User navigates to the **Quiz** tab $\rightarrow$ Chooses a category $\rightarrow$ Answers MCQs sequentially $\rightarrow$ Receives immediate correctness feedback with explanations $\rightarrow$ Results are logged upon completion.
*   **Postcondition:** Attempt count and score are recorded in user document.

### UC4: Practice Spaced Repetition System (SRS)
*   **Precondition:** User is authenticated and has viewed at least one interview question.
*   **Flow:** User navigates to **SRS Practice** $\rightarrow$ System retrieves cards where `nextReviewDate` is equal to or earlier than the current time $\rightarrow$ User drafts their recall attempt $\rightarrow$ User evaluates their recall quality from 0 (Blackout) to 5 (Perfect) $\rightarrow$ Algorithm schedules next review date.
*   **Postcondition:** SRS card variables (`easinessFactor`, `interval`, `repetitions`, `nextReviewDate`) are updated.

### UC5: Monitor Progress and View Dashboard Analytics
*   **Precondition:** User is authenticated.
*   **Flow:** User navigates to the **Dashboard** $\rightarrow$ System aggregates seen/solved statistics $\rightarrow$ Renders numeric values and visual progress bars mapping category breakdowns.
*   **Postcondition:** User gains immediate insights into current strengths and weak areas.

---

## 5. Design Contribution & Database Schema

### Database Schema Design
The system employs 5 core Mongoose collections stored in MongoDB:

1.  **User Schema (`User.js`):**
    *   `name` / `email` / `password` (hashed)
    *   `seenQuestions` (Array of Numbers representing question ids)
    *   `seenDSA` / `solvedDSA` (Arrays of Numbers)
    *   `mcqAttempted` / `mcqSolved` (Arrays of Numbers)
    *   `srsStats` (`totalCards`, `newCards`, `learningCards`, `reviewCards`, `totalReviews`, `averageEasinessFactor`)
2.  **InterviewQuestion Schema (`InterviewQuestion.js`):**
    *   `questionNumber` (Number, unique index)
    *   `question` (String)
    *   `answer` (String)
    *   `category` (String, indexed)
    *   `difficulty` (String, indexed)
    *   `tags` (Array of Strings)
3.  **DSAQuestion Schema (`DSAQuestion.js`):**
    *   `dsaNumber` (Number, unique index)
    *   `title` / `problem` / `solution` (JavaScript string) / `approach` (String)
    *   `topic` (String, indexed)
    *   `difficulty` (String)
    *   `timeComplexity` / `spaceComplexity` (Strings)
    *   `tags` (Array of Strings)
4.  **MCQQuestion Schema (`MCQQuestion.js`):**
    *   `questionId` (Number, unique index)
    *   `category` / `topic` / `difficulty` (Strings)
    *   `question` (String)
    *   `options` (Array of `{ text: String, isCorrect: Boolean }`)
    *   `correctAnswerIndex` (Number)
    *   `explanation` (String)
5.  **SRSCard Schema (`SRSCard.js`):**
    *   `userId` (ObjectId referencing `User`)
    *   `questionId` (ObjectId referencing `InterviewQuestion`)
    *   `category` / `difficulty` (Strings)
    *   `interval` (Number of days, default 1)
    *   `easinessFactor` (Number, default 2.5)
    *   `repetitions` (Number of consecutive reviews, default 0)
    *   `nextReviewDate` (Date, default now)
    *   `lastReviewDate` (Date)
    *   `quality` (Number, 0-5)
    *   `reviews` (Array of review logs for history tracking)

---

### RESTful API Architecture

The Express server exposes the following endpoints (all prefixed with `/api`):

*   **Authentication (`/auth`):**
    *   `POST /register` - Creates a new user profile, returns JWT.
    *   `POST /login` - Verifies email/password, returns JWT.
    *   `POST /forgot-password` - Sends an OTP value (logged to console in development).
    *   `POST /verify-otp` - Validates the requested reset OTP.
    *   `POST /reset-password` - Updates user password if OTP matches.
*   **Interview Questions (`/questions`):**
    *   `GET /` - Fetches all questions (optional filters for category, difficulty, tags).
    *   `GET /:id` - Fetches single question by questionNumber.
    *   `GET /random` - Pulls a random question card.
    *   `POST /seen/:questionNumber` - Registers a question as seen in the user profile.
*   **DSA Practice (`/dsa`):**
    *   `GET /` - Fetches all algorithmic problems (supports topic/difficulty filters).
    *   `GET /:id` - Fetches single DSA question by number.
    *   `POST /seen/:dsaNumber` - Marks a DSA question as seen.
    *   `POST /solved/:dsaNumber` - Marks a DSA question as solved.
    *   `DELETE /solved/:dsaNumber` - Unmarks a DSA question as solved.
*   **MCQ Quiz (`/mcq`):**
    *   `GET /all` - Pulls all MCQ items.
    *   `GET /meta/categories` - Returns distinct categories and counts.
    *   `GET /category/:category` - Retrieves quiz questions by category.
    *   `GET /difficulty/:difficulty` - Retrieves quiz questions by difficulty.
    *   `POST /submit-answer/:questionId` - Validates selected answer, returns explanation, and logs score.
*   **Profile Stats (`/profile`):**
    *   `GET /` - Aggregates and sends seen, solved, and SRS stats for the authenticated user.
*   **Spaced Repetition (`/srs`):**
    *   `POST /create-card` - Enqueues a question by creating a new `SRSCard` for the user.
    *   `GET /due-cards` - Returns all cards ready for review (sorted by `nextReviewDate`).
    *   `GET /stats` - Returns summary stats (cards seen, mastered, learning, avg EF).
    *   `GET /stats/:cardId` - Retrieves historical logs for a single card.
    *   `POST /toggle-suspend/:cardId` - Suspends or resumes a cards review cycle.
    *   `POST /review/:cardId` - Processes user score (0-5), runs SM-2, updates interval, and schedules next date.
    *   `POST /submit-review` - Alternative endpoint that processes a review by cardId in the request body.

---

### SuperMemo SM-2 Algorithm Design

The algorithm computes review intervals ($I$) based on the user's rated quality of recall ($q \in [0, 5]$) and the card's previous state.

#### 1. Parameters:
*   **Quality ($q$):** User's self-assessed recall score:
    *   $5$: Perfect recall, zero hesitation.
    *   $4$: Correct response, minor effort.
    *   $3$: Correct response, significant effort.
    *   $2$: Incorrect response, but easily remembered after peeking.
    *   $1$: Incorrect response, but recognized.
    *   $0$: Complete blackout.
*   **Easiness Factor ($EF$):** Multiplier indicating how easy a card is. Default is $2.5$. Minimum threshold is $1.3$.
*   **Repetition Count ($n$):** The number of consecutive successful reviews ($q \ge 3$).
*   **Interval ($I$):** The number of days to wait until showing the card again.

#### 2. Formula Mechanics:
For each review session:
1.  **Adjust the Easiness Factor ($EF$):**
    $$EF_{new} = \max(1.3, EF_{old} + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02)))$$
2.  **Determine the Repetition Count ($n$) & Calculate Interval ($I$):**
    *   If $q < 3$ (Recall failed):
        *   Reset repetition count: $n_{new} = 0$
        *   Reset interval: $I_{new} = 1$ (Review again in 1 day)
    *   If $q \ge 3$ (Recall succeeded):
        *   Increment repetition: $n_{new} = n_{old} + 1$
        *   Calculate Interval:
            *   If $n_{new} = 1$: $I_{new} = 1$
            *   If $n_{new} = 2$: $I_{new} = 3$ (or $6$ in original SM-2)
            *   If $n_{new} > 2$: $I_{new} = \text{round}(I_{old} \times EF_{new})$
3.  **Update Review Date:**
    $$\text{nextReviewDate} = \text{CurrentDate} + I_{new}\text{ days}$$

---

## 6. Programming Contribution & Implementation Details

During the development cycle, the backend and frontend components were fully implemented and wired together:

### Backend Architecture
*   **Database Connectivity (`db.js`):** Established Mongoose connection to MongoDB Atlas, configured with DNS result ordering settings (`ipv4first`) and public DNS resolvers to handle network failures.
*   **Authentication Middleware (`authMiddleware.js`):** Standard JWT validator extracting headers, verifying signature using `process.env.JWT_SECRET`, and injecting the user payload into the request object (`req.user`).
*   **Data Seeding Scripts:** Created automated data injectors for interview questions (`seedQuestions.js`), algorithms (`seedDSA.js`), and quizzes (`seedMCQ.js`).

### Frontend Integration & Routing
*   **Global Routing Grid (`App.jsx`):** Configured routes using `react-router-dom` to coordinate views: Dashboard, Interview Questions, DSA Explorer, MCQ Quizzes, User Profile, SRS Practice Queue, and SRS Learning Statistics.
*   **Navigation Bridge (`Navbar.jsx`):** A persistent header managing component links and active session termination (removing token on Logout).
*   **Spaced Repetition Integration (`Questions.jsx`):** Added automated API triggers during interview question study. When a user marks an interview question as seen, the app automatically triggers a background call to `/api/srs/create-card` to ensure the card enters their review loop.
*   **SRS UI Components:**
    *   `SRSPractice.jsx`: Displays active due cards, provides recall note textareas, and lets users submit ratings (0-5) which are immediately processed via the backend SM-2 compatibility endpoint.
    *   `SRSStats.jsx`: Pulls user-specific metrics (total cards, due counts, average easiness factors) and renders them in structured dashboards.

---

## 7. Tools, Technologies, and Libraries Used

| Category | Technology Stack Details |
| :--- | :--- |
| **Frontend Tier** | React 18+, React Router v6, Vanilla CSS3, Fetch API |
| **Backend Tier** | Node.js, Express.js (v4), JWT, CORS Middleware |
| **Database Tier** | MongoDB Atlas Cloud, Mongoose Object Data Modeling (ODM) |
| **Languages** | JavaScript (ES6+), Markdown |
| **Security** | `bcryptjs` for encryption, JSON Web Tokens for auth |
| **Dev Tools** | VS Code, Postman, Git/GitHub, MongoDB Compass |
| **Core Algorithm**| SuperMemo SM-2 Spaced Repetition |

---

## 8. Testing Strategies and Reports

The system was verified using a layered testing approach to ensure API robustness and functional completeness.

### API Endpoint Validation (Postman)
Each endpoint was evaluated for response status codes and payload structure:
*   `200 OK` / `201 Created` - Checked for successful authentication, profile queries, and SRS reviews.
*   `400 Bad Request` - Verified validation logic (e.g. invalid quality scores outside the 0-5 range, missing fields).
*   `401 Unauthorized` - Checked that protected routes correctly reject requests with missing or altered JWT tokens.
*   `404 Not Found` - Checked correct failure responses when querying non-existent questions or cards.

### Integration Workflows Verified
1.  **Authentication Sequence:** Sign Up $\rightarrow$ Password encryption check in DB $\rightarrow$ Log In $\rightarrow$ JWT storage in `localStorage` $\rightarrow$ Profile loading.
2.  **Learning Journey Flow:** Browse Interview Questions $\rightarrow$ Toggle Answer Seen $\rightarrow$ Automated backend SRS card registration $\rightarrow$ Open SRS Practice page $\rightarrow$ Submit quality rating $\rightarrow$ Verify card state updates.
3.  **Algorithmic Topic Search:** Filter DSA problems by category $\rightarrow$ Query exact problem by number $\rightarrow$ Display solutions correctly.

---

## 9. Innovative Contribution: Spaced Repetition System (SRS)

The inclusion of an integrated Spaced Repetition System represents the core innovation of the Smart Interview Preparation Platform. While standard study portals offer static question trackers, this platform dynamically adapts to each individual's cognitive pace.

```
       ┌──────────────────────────────┐
       │   User Views Interview Q's   │
       └──────────────┬───────────────┘
                      │ (Auto-create card)
                      ▼
       ┌──────────────────────────────┐
       │  SRS Card Enters 'new' state │
       └──────────────┬───────────────┘
                      │ (Due today)
                      ▼
       ┌──────────────────────────────┐
       │     User Reviews Card        │
       │     (Enters quality 0-5)     │
       └──────────────┬───────────────┘
                      │
            ┌─────────┴─────────┐
            ▼ (quality < 3)     ▼ (quality >= 3)
     ┌─────────────┐     ┌─────────────┐
     │  'learning' │     │   'review'  │
     │  state      │     │   state     │
     │             │     │             │
     │ Reset:      │     │ Multiply:   │
     │ n = 0       │     │ n = n + 1   │
     │ I = 1 day   │     │ I = I * EF  │
     └──────┬──────┘     └──────┬──────┘
            │                   │
            └─────────┬─────────┘
                      ▼
       ┌──────────────────────────────┐
       │   Update database: Next date │
       └──────────────────────────────┘
```

### Key Innovations Built:
1.  **Low Friction Card Enqueueing:** The user doesn't need to manually build flashcards. Reading study sheets automatically creates a card, linking the core content database to the spaced repetition loop.
2.  **Adaptive Ease Factors:** Difficult items are automatically identified (low quality scores) and scheduled for frequent reviews (decreasing the card's $EF$). Simple concepts are pushed further out (increasing the $EF$), saving the user valuable study time.
3.  **Active Progress Metrics:** Dashboard statistics automatically separate cards into standard learning categories (New, Learning, Review) to keep users informed of their memory progress.

---

## 10. Lessons Learnt and Conclusion

Developing the Smart Interview Preparation Platform provided several technical and project management insights:

*   **Database Schema & Relationships:** Proper modeling of cross-document relations is critical. Correctly mapping references between user profiles, cards, and questions prevents runtime errors and facilitates clean queries.
*   **Incremental Feature Development:** Building features iteratively (Authentication $\rightarrow$ Content Seeds $\rightarrow$ Frontend Views $\rightarrow$ SRS Integration) kept the project compile-ready and testable at every stage.
*   **Defensive API Design:** Validating user input boundaries in the backend (like checking if the quality score is strictly between 0 and 5) guarantees database integrity even if the client UI has bugs.
*   **User-Centric Architecture:** Real-world learners value seamless integration. Auto-generating SRS cards when browsing questions creates a smoother user experience than requiring manual card registration.

### Conclusion
The Smart Interview Preparation Platform successfully demonstrates full-stack development capability using the MERN stack while integrating spaced repetition cognitive science. The application delivers a functional, responsive, and structured prep portal designed to help users retain complex software development concepts.

---

## 11. Appendix: Project Audit, Bug Fixes, and Discrepancy Analysis

### 1. Database Collections Actual vs. Diagram Claims
*   **DSA Problems Schema:**
    *   *Diagram Claim:* Had separate fields for `solutionCpp` and `solutionJava`, plus a `testCases` array referencing a `Test Cases` collection.
    *   *Actual Project:* Uses a single `solution` field containing a JavaScript implementation. There is no separate `Test Cases` database collection or model file in the project.
*   **User Progress Collection:**
    *   *Report Claim:* Listed a separate `UserProgress` collection.
    *   *Actual Project:* Progress tracking arrays (`seenQuestions`, `seenDSA`, `solvedDSA`, `mcqAttempted`, `mcqSolved`) are stored directly within the `User` schema. This is highly efficient and eliminates unnecessary database joins.
*   **Interview Question Schema:**
    *   *Diagram Claim:* Contained `explanation` and `timestamp`.
    *   *Actual Project:* The schema contains `questionNumber`, `question`, `answer`, `category`, `difficulty`, and `tags`. Explanations are provided directly in the `answer` text.

### 2. API Endpoints Actual vs. Diagram Claims
*   **Auth Routes:**
    *   *Diagram Claim:* Listed `POST /auth/logout` and `GET /auth/verify`.
    *   *Actual Project:* Session management is handled on the client-side (frontend clears the token from `localStorage` on logout, eliminating state validation requests). The project contains `POST /auth/forgot-password`, `/verify-otp`, and `/reset-password` for password resets, which were omitted in the original report.
*   **DSA Routes:**
    *   *Diagram Claim:* Claimed a `POST /submit` endpoint with real-time compilation.
    *   *Actual Project:* The project uses a seen/solved tracking flow (`POST /seen/:dsaNumber` and `POST /solved/:dsaNumber`) which does not require an external code compiler or compile fees.
*   **MCQ Routes:**
    *   *Diagram Claim:* Listed `POST /submit` and `GET /results`.
    *   *Actual Project:* The quiz uses `POST /submit-answer/:questionId` to check choices and save scores, and the client handles results calculations locally.
*   **SRS Routes:**
    *   *Report Claim:* Listed endpoints like `PUT /srs/:cardId/calculate-interval`, `DELETE /srs/:cardId/reset`, and `GET /srs/learning-curve`.
    *   *Actual Project:* The review processing is bundled into `POST /api/srs/review/:cardId` (which calculates intervals and commits card state changes in a single database transaction).

### 3. Key Bug Fixes Completed during Project Audit
*   **SRSCard Populate Bug Resolved:**
    *   *Problem:* In `backend/models/SRSCard.js`, the `questionId` schema reference was defined as `ref: "Question"`. However, the model is registered under the name `"InterviewQuestion"`. This threw a runtime `MissingSchemaError` whenever the server populated due cards list.
    *   *Solution:* Updated `ref` to `"InterviewQuestion"` in `SRSCard.js` to ensure Mongoose resolves card references properly.
*   **SRS API Compatibility Route Added:**
    *   *Problem:* The frontend `SRSPractice.jsx` component was coded to send recall submissions to `POST /api/srs/review/:cardId`. The backend router `srs.js`, however, expected requests on `POST /api/srs/submit-review` with `cardId` in the body.
    *   *Solution:* Added a compatibility route `POST /review/:cardId` in `backend/routes/srs.js` that maps parameters and executes the review cycle.
*   **Frontend Routing & Navigation Restored:**
    *   *Problem:* The frontend components `SRSPractice.jsx` and `SRSStats.jsx` were orphaned in the project structure. They lacked router definitions in `App.jsx`, menu items in `Navbar.jsx`, and links in `Dashboard.jsx`. Additionally, `SRSPractice.jsx` had bugs where it incorrectly parsed populated database fields (`currentCard.questionId` instead of `.questionId.questionNumber`).
    *   *Solution:* Registered SRS components in the router, added links to the navbar and dashboard cards, and updated `SRSPractice.jsx` to correctly extract and render populated questions text.
