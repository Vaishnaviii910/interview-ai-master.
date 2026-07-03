# 🎯 AI Interview Strategist & Coach

> Upload your resume and a job description - get an AI-generated interview strategy: a match score, tailored technical & behavioral questions with model answers, skill-gap analysis, a day-by-day prep roadmap, and a rewritten, ATS-friendly resume as a downloadable PDF.

Built with the MERN stack + Google Gemini.

---

## ✨ Features

- **🔐 Authentication** - Register / login / logout with JWT stored in an HTTP cookie; protected routes on both client and server.
- **📄 Resume + JD analysis** - Upload a PDF resume and paste a job description; the text is extracted and sent to Gemini.
- **🧠 AI interview report** - Structured output validated with Zod:
  - **Match score** (0–100) against the target role
  - **Technical questions** - each with the interviewer's *intention* and a *model answer*
  - **Behavioral questions** - same intention + model-answer format
  - **Skill gaps** - ranked `low` / `medium` / `high`
  - **Preparation roadmap** - day-by-day focus areas and tasks
- **📥 Tailored resume PDF** - AI rewrites your resume for the specific job and renders it to a downloadable PDF (Puppeteer).
- **🗂️ History** - All your past reports are saved and listed on the home screen.

---

## 🏗️ Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 19, Vite, React Router 7, Axios, SCSS |
| Backend   | Node.js, Express 5 |
| Database  | MongoDB, Mongoose |
| AI        | Google Generative AI (Gemini) |
| Auth      | JWT, bcryptjs, cookie-parser |
| Files/PDF | Multer, pdf-parse, Puppeteer |
| Validation| Zod |

---

## 📂 Project Structure

```
.
├── api/
│   └── index.js               # Serverless entry (exports the Express app)
├── server.js                  # Node entry (app.listen)
├── src/
│   ├── app.js                 # Express app, middleware, route mounting
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── interview.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js # JWT verify + blacklist check
│   │   └── file.middleware.js # Multer (memory storage, 3MB limit)
│   ├── models/
│   │   ├── user.model.js
│   │   ├── interviewReport.model.js
│   │   └── blacklist.model.js # Invalidated JWTs
│   ├── route/
│   │   ├── auth.routes.js
│   │   └── interview.routes.js
│   └── services/
│       └── ai.service.js      # Gemini calls + PDF generation
│
└── frontend/
    └── src/
        ├── App.jsx            # Providers + router
        ├── app.routes.jsx
        ├── features/
        │   ├── auth/          # context, hooks, pages, services
        │   └── interview/     # context, hooks, pages, services
        └── style.scss
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or MongoDB Atlas)
- A Google Generative AI API key

### 1. Clone & install

```bash
git clone https://github.com/<your-username>/ai-interview-strategist-coach.git
cd ai-interview-strategist-coach

# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 2. Environment variables

Create a `.env` file in the **project root**:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
```

Create a `.env` file in the **`frontend/`** folder (only needed for production builds):

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

> In development the frontend defaults to `http://localhost:3000`, so `VITE_API_BASE_URL` can be omitted locally.

### 3. Run

```bash
# Backend (from project root) - http://localhost:3000
npm run dev

# Frontend (from /frontend) - http://localhost:5173
npm run dev
```

---

## 🔌 API Reference

Base URL: `/api`

### Auth - `/api/auth`

| Method | Endpoint    | Access  | Description |
|--------|-------------|---------|-------------|
| POST   | `/register` | Public  | Register a new user (`username`, `email`, `password`) |
| POST   | `/login`    | Public  | Log in (`email`, `password`) |
| GET    | `/logout`   | Public  | Log out and blacklist the token |
| GET    | `/get-me`   | Private | Get the current logged-in user |

### Interview - `/api/interview`

| Method | Endpoint                          | Access  | Description |
|--------|-----------------------------------|---------|-------------|
| POST   | `/`                               | Private | Generate a report (multipart: `resume` file, `jobDescription`, `selfDescription`) |
| GET    | `/`                               | Private | List all of the user's reports |
| GET    | `/report/:interviewId`            | Private | Get a single report by ID |
| POST   | `/resume/pdf/:interviewReportId`  | Private | Generate & download a tailored resume PDF |

> Private routes require a valid JWT cookie (set automatically on login/register).

---

## 🧩 How It Works

1. The user uploads a resume (PDF) and pastes a job description + short self-description.
2. `multer` reads the file into memory; `pdf-parse` extracts the text.
3. `ai.service` prompts **Gemini** and requests JSON output, which is validated against a **Zod** schema.
4. The structured report is saved to MongoDB, scoped to the user.
5. On demand, Gemini rewrites the resume as HTML and **Puppeteer** renders it to a PDF for download.

---

## 📦 Deployment Notes

- **Backend** runs best on a long-running host (e.g. Railway/Render) because PDF generation uses a headless Chromium. On serverless platforms, Puppeteer requires `puppeteer-core` + a serverless Chromium build.
- **Frontend** deploys as a static SPA (e.g. Vercel). A rewrite rule (`vercel.json`) routes all paths to `index.html` for client-side routing.
- For cross-domain auth cookies, the backend must set `sameSite: "none"` + `secure: true`, and CORS must allow the frontend origin with `credentials: true`.

---

## 📝 License

ISC

---

<p align="center">Made with ☕ and a lot of interview prep.</p>
