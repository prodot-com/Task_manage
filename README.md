# Task Management Application

A full-stack task management application where users can register, log in, and manage their own tasks.  
The application uses **JWT authentication**, **protected routes**, and supports full **CRUD operations** on tasks.

---

## 🌍 Live Deployment

- **Frontend (Vercel)**  
  👉 https://nexus-task-manager.vercel.app/  (Full working application here)

- **Backend (Render)**  
  👉 https://task-manager-em00.onrender.com

---

## 🚀 Technology Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Axios
- Zod

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Jest + Supertest (Testing)

---

## 📁 Project Structure
![BackendFileStucture](public/backend.png)
![FrontendFileStucture](public/frontend.png)



---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone the Repository

```
git clone https://github.com/prodot-com/Task_manager.git
cd Task_manager
```
### Backend Setup
```
cd backend
npm install
```
Create .env file
```
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb(Your postgresql database)
JWT_SECRET=your_jwt_secret
```
Run Prisma
```
npx prisma generate
npx prisma migrate dev
```
Start backend
```
npm run dev
```
Backend runs on
```
http://localhost:5000
```
### Frontend Setup
```
cd ../frontend
npm install
npm run dev
```
Frontend runs on:
```
http://localhost:5173
```

🔐 Authentication Flow

  1. User registers or logs in using userName + password

  2. Backend returns a JWT token

  3. Token is stored in localStorage

  4. Token is sent in Authorization: Bearer <token>

  5. Protected routes verify JWT

## 📌 API Endpoint Documentation

### 🔑 Authentication APIs

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate user and return JWT token |

#### Register / Login Request Body
```json
{
  "userName": "testuser",
  "password": "password123"
}

```

### Login/Register Success Response
```json
{
  "statusCode": 200,
  "data": {
    "token": "JWT_TOKEN"
  },
  "message": "Success"
}
```
### 📝 Task Management APIs (Protected)

| Method | Endpoint        | Description                          |
|------|-----------------|--------------------------------------|
| GET  | `/tasks`        | Get all tasks for the logged-in user |
| POST | `/tasks`        | Create a new task                   |
| PUT  | `/tasks/:id`    | Update an existing task             |
| DELETE | `/tasks/:id`  | Delete a task                       |

### Create Task
```
POST /tasks
```

Request Body
```json
{
  "title": "Complete assignment",
  "description": "Finish backend testing"
}
```
Success Response
```json
{
  "id": 1,
  "title": "Complete assignment",
  "description": "Finish backend testing",
  "status": "pending",
  "userId": 1
}
```
### Get User TaskS
```
GET /tasks
```

Ressponse
```json
[
  {
    "id": 1,
    "title": "Complete assignment",
    "description": "Finish backend testing",
    "status": "pending",
    "userId": 1
  }
]
```

### Update Task
```
PUT /tasks/:id
```
Request Body
```
{
  "title": "Complete assignment",
  "status": "completed"
}
```
Success
```json
{
  "id": 1,
  "title": "Complete assignment",
  "description": "Finish backend testing",
  "status": "completed",
  "userId": 1
}
```
### Delete Task
```
DELETE /tasks/:id
```
Response
```json
{
  "message": "Task successfully deleted"
}
```

🧪 Testing
### Backend Testing

Backend tests are written using Jest + Supertest.

Covered:

User registration & login

JWT authorization middleware

Task CRUD operations

Task ownership & access control

Run tests:
```
cd backend
npm test
```

Run coverage:
```
npm run test:coverage
```

### Database Schema(Prisma)
```
enum TaskStatus {
  pending
  in_progress
  completed
}

model User {
  id       Int    @id @default(autoincrement())
  userName String @unique
  password String
  tasks    Task[]
}

model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus @default(pending)
  userId      Int
  user        User       @relation(fields: [userId], references: [id])
}
```
###👨‍💻 Author

Probal Ghosh
Full Stack Developer
