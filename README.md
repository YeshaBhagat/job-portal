# 🚀 HireHub — Full Stack Job Portal

A complete job portal web application built with **React.js**, **Node.js + Express**, and **MongoDB**.

---

## 📁 Project Structure

```
job-portal/
├── backend/           → Node.js + Express API
│   ├── models/        → Mongoose schemas (User, Job, Application)
│   ├── routes/        → API route handlers
│   ├── middleware/     → JWT authentication middleware
│   ├── server.js      → Express app entry point
│   └── .env.example   → Environment variables template
│
└── frontend/          → React.js application (Vite)
    └── src/
        ├── components/ → Navbar, JobCard, Footer
        ├── context/    → AuthContext (global auth state)
        └── pages/      → Home, Jobs, JobDetail, Login, Register, Dashboards
```

---

## ✅ Features

| Feature | Description |
|---|---|
| 🔐 Auth | Register & Login with JWT (Job Seeker & Recruiter roles) |
| 📋 Job Listings | Browse, search, and filter jobs |
| 🔍 Search & Filter | Filter by type, category, experience, location |
| 📝 Apply | Submit applications with cover letter & resume link |
| 👤 Seeker Dashboard | Track application status, withdraw applications |
| 🏢 Recruiter Dashboard | Post jobs, manage listings, review & update applicant status |
| 📱 Responsive | Mobile-first design using Tailwind CSS |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 🔧 Backend Setup

```bash
cd backend
npm install

# Copy the example env file and fill in your values
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

Start the backend:
```bash
npm run dev      # Development (with nodemon)
npm start        # Production
```

Backend runs at: `http://localhost:5000`

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

> The Vite proxy in `vite.config.js` automatically forwards `/api` requests to the backend.

---

## 🌐 API Reference

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register a new user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Private | Get current user |
| PUT | /api/auth/profile | Private | Update profile |

### Jobs
| Method | Route | Access | Description |
|---|---|---|---|
| GET | /api/jobs | Public | List all jobs (search, filter, paginate) |
| GET | /api/jobs/:id | Public | Get a single job |
| POST | /api/jobs | Recruiter | Post a new job |
| PUT | /api/jobs/:id | Recruiter | Update a job |
| DELETE | /api/jobs/:id | Recruiter | Delete a job |
| GET | /api/jobs/recruiter/myjobs | Recruiter | Get recruiter's own jobs |

### Applications
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /api/applications/:jobId | Seeker | Apply for a job |
| GET | /api/applications/my | Seeker | Get my applications |
| GET | /api/applications/job/:jobId | Recruiter | Get applicants for a job |
| PUT | /api/applications/:id/status | Recruiter | Update application status |
| DELETE | /api/applications/:id | Seeker | Withdraw application |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Tailwind CSS, Axios |
| Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT (JSON Web Tokens), bcrypt |

---

## 📦 Deployment

### Option 1 — GitHub + Render + MongoDB Atlas
1. Push both folders to GitHub
2. Deploy backend on [Render](https://render.com) (set env vars in dashboard)
3. Deploy frontend on [Vercel](https://vercel.com) or Netlify
4. Update `vite.config.js` proxy or use `VITE_API_URL` env var for production API URL

### Option 2 — Local with MongoDB Atlas
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Copy the connection string into your `.env` as `MONGO_URI`

---

## 👩‍💻 Author

Built as a Minor Project — Web Development: Job Portal  
Stack: React.js · Node.js · Express · MongoDB
