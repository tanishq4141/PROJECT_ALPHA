# Project Alpha — MERN LMS

Brief: Project Alpha is a small Learning Management System (MERN stack) with authentication, batches, and MCQ assignment management. Teachers can create batches and MCQ assignments, assign assignments to batches or students; students can view assigned assignments.

---

## Features
- User auth: signup / signin (teacher / student) with JWT cookie
- Teacher features:
  - Create batches and add students by email
  - Create MCQ assignments and assign to a batch (auto-assigns to batch students)
  - View assignments created by teacher
- Student features:
  - View assigned assignments
  - (Phase 2) Attempt assignments & store responses
- REST APIs with role-based middleware (teacher-only endpoints)

---

## Repo structure (important files)
- server/
  - controllers/
    - auth.controller.js
    - assignment.controller.js
    - batch.controller.js
  - middleware/
    - auth.middleware.js
  - models/
    - user.model.js
    - assignment.model.js
    - batch.model.js
  - routes/
    - auth.routes.js
    - assignments.routes.js
    - batch.routes.js
  - index.js — server entry
  - config/db.js — MongoDB connection
- client/
  - src/
    - apiCalls/ (authCall.js, assignmentsCall.js, batchCall.js)
    - pages/teacher/ (Batches.jsx, CreateAssignment.jsx, ...)
    - pages/student/ (Assignments.jsx, ...)
    - components/ (Navbar, Sidebar, Card, Button, BatchCard, ...)
    - App.jsx — routes
- README.md

---

## Prerequisites
- Node.js >= 16
- npm or yarn
- MongoDB instance (local or atlas)
- Mac: commands below assume bash/zsh

---

## Environment variables

Create `.env` in `server/` with:
```
PORT=8000
MONGO_URI=mongodb://localhost:27017/project_alpha
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Create `.env` in `client/` or set in your client config:
```
VITE_API_BASE_URL=http://localhost:8000
```
(Adjust ports/URLs if you run server/client on different ports.)

---

## Install & Run

Server (from repo root):
```bash
cd server
npm install
npm run dev        # assumes nodemon or equivalent, starts server on PORT
```

Client:
```bash
cd client
npm install
npm run dev        # Vite/React dev server (default 5173)
```

Open browser:
- Client: http://localhost:5173 (or your Vite port)
- Server health: http://localhost:8000/health

---

## Key API Endpoints

Auth
- POST /api/auth/signup — { name, email, password, role }
- POST /api/auth/signin — { email, password } sets cookie token
- GET /api/auth/me — (optional) returns current user (use authenticate middleware)

Batches
- POST /api/batches/create — (teacher) { name, description, studentEmails: [email,..] }
  - Creates batch, links students (found by email), updates student.batches
- GET /api/batches — (teacher) list teacher's batches

Assignments
- POST /api/assignments/create — (teacher) { title, description, questions, dueDate, batchId? }
  - Creates assignment, adds to teacher.createdAssignments; if batchId provided adds assignment to batch and pushes to each student.assignments
- POST /api/assignments/assign — (teacher) { assignmentId, batchId?, studentIds? }
  - Assign existing assignment to a batch or specific students
- GET /api/assignments/student/:id — (auth) returns populated assignments for student
- GET /api/assignments/teacher/:id — (auth) returns assignments created by teacher

Notes:
- Authentication: server reads JWT from cookie `token` or Authorization header.
- Role checks enforced via middleware (requireTeacher).

---

## Frontend routes (example)
- /login
- /signup
- /teacher/batches
- /teacher/create-assignment
- /teacher/assignments
- /student/assignments

---

## Quick curl examples (use cookie from signin)
Sign in and capture cookie:
```bash
curl -i -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"password"}'
# read Set-Cookie header and use it in subsequent requests
```

Create batch (teacher cookie):
```bash
curl -X POST http://localhost:8000/api/batches/create \
  -H "Content-Type: application/json" \
  --cookie "token=YOUR_COOKIE" \
  -d '{"name":"Batch A","description":"Desc","studentEmails":["s1@example.com","s2@example.com"]}'
```

Create assignment:
```bash
curl -X POST http://localhost:8000/api/assignments/create \
  -H "Content-Type: application/json" \
  --cookie "token=YOUR_COOKIE" \
  -d '{
    "title":"MCQ 1",
    "description":"Simple test",
    "dueDate":"2025-11-01",
    "questions":[{"question":"2+2?","options":["1","2","3","4"],"correctOption":3}],
    "batchId":"<batchId>"
  }'
```

Get student assignments:
```bash
curl -H "Content-Type: application/json" --cookie "token=YOUR_COOKIE" http://localhost:8000/api/assignments/student/<studentId>
```

---

## Troubleshooting
- CORS issues: ensure CLIENT_URL in server `.env` matches client origin and credentials allowed.
- Cookie auth: ensure client sends requests with credentials (axios: withCredentials: true).
- MongoDB: confirm MONGO_URI and that MongoDB is running.
- Vite import errors: confirm correct relative import paths (e.g. ../../apiCalls/assignmentsCall).

---

## Testing & Next Steps (Roadmap)
- Phase 2: Student attempt submission endpoints, store answers & scoring
- Add batch dropdown in Create Assignment UI (instead of manual batchId)
- Add pagination / filtering for assignments
- Add unit tests and integration tests
- Add role-based UI guards and better error handling in UI

---

## License
MIT — modify as needed.

---

If you want, I can:
- generate a Postman collection for key endpoints
- add client-side batch select UI and refine assignment attempt flow (phase 2)
- create unit tests for backend controllers

Tell me which next step you prefer.
