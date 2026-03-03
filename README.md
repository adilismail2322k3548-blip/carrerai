# CareerAI – AI-Based Career Counseling System

A full-stack MERN application that uses the **Groq LLM API** to deliver personalised career recommendations based on student assessments.

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18 + Vite + Tailwind CSS      |
| Backend     | Node.js + Express.js                |
| Database    | MongoDB Atlas (Mongoose)            |
| AI          | Groq API (`llama3-8b-8192`)         |
| Auth        | JWT + bcryptjs                      |
| Config      | dotenv                              |

---

## Folder Structure

```
backend/
  config/         # MongoDB connection
  controllers/    # Route handler logic
  middleware/     # JWT auth middleware
  models/         # Mongoose schemas (User, Assessment, Career)
  routes/         # Express routers
  services/       # groqService.js, scoringService.js
  server.js       # Entry point
  .env.example    # Environment variable template

frontend/
  src/
    components/   # Navbar, ProtectedRoute
    context/      # AuthContext (JWT state)
    pages/        # LandingPage, Login, Register, Dashboard,
                  # AssessmentForm, ResultsPage, AdminDashboard
    services/     # axios api.js
  index.html
  vite.config.js
  tailwind.config.js
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local MongoDB instance)
- A [Groq API key](https://console.groq.com/)

### Backend

```bash
cd backend
cp .env.example .env          # fill in your values
npm install
npm run dev                   # starts on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                   # starts on port 3000 (proxies /api -> :5000)
```

---

## Environment Variables (backend/.env.example)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/carrerai?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
ADMIN_EMAIL=admin@carrerai.com
NODE_ENV=development
```

---

## API Endpoints

### Auth
| Method | Path                | Auth   | Description        |
|--------|---------------------|--------|--------------------|
| POST   | /api/auth/register  | -      | Register new user  |
| POST   | /api/auth/login     | -      | Login, returns JWT |
| GET    | /api/auth/me        | Bearer | Get current user   |

### Assessment
| Method | Path                  | Auth   | Description             |
|--------|-----------------------|--------|-------------------------|
| POST   | /api/assessment       | Bearer | Submit & get AI results |
| GET    | /api/assessment/my    | Bearer | List my assessments     |
| GET    | /api/assessment/:id   | Bearer | Get single assessment   |

### Careers (public)
| Method | Path              | Auth | Description         |
|--------|-------------------|------|---------------------|
| GET    | /api/careers      | -    | List active careers |
| GET    | /api/careers/:id  | -    | Career detail       |

### Admin (admin role required)
| Method | Path                     | Description              |
|--------|--------------------------|--------------------------|
| GET    | /api/admin/stats         | Overview statistics      |
| GET    | /api/admin/users         | List all students        |
| GET    | /api/admin/assessments   | List all assessments     |
| GET    | /api/admin/careers       | List all careers         |
| POST   | /api/admin/careers       | Add career               |
| PUT    | /api/admin/careers/:id   | Update career            |
| DELETE | /api/admin/careers/:id   | Soft-delete (deactivate) |

---

## Key Features

- **JWT Authentication** - secure login/register with bcrypt password hashing
- **Weighted Scoring** - scoringService.js computes keyword-overlap scores before hitting the LLM
- **Groq LLM Integration** - groqService.js sends structured prompts and strictly parses JSON
- **Admin Dashboard** - manage careers, view student stats, recent assessments
- **Responsive UI** - Tailwind CSS, step-by-step assessment form, results page with roadmap
