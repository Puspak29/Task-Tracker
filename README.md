# 🚀 TaskTrack — Full-Stack Task Tracker

A modern, full-stack task management application built with the **MERN stack** (MongoDB, Express, React/Next.js, Node.js). Features a Kanban-style board with priorities, tags, due dates, search, and filters — all wrapped in a sleek dark-themed UI.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Environment Variables](#2-environment-variables)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Run the Application](#4-run-the-application)
- [API Reference](#api-reference)
  - [Health Check](#health-check)
  - [Authentication](#authentication)
  - [Tasks](#tasks)
- [Example Requests & Responses](#example-requests--responses)
  - [Register](#1-register)
  - [Login](#2-login)
  - [Create a Task](#3-create-a-task)
  - [Get All Tasks](#4-get-all-tasks)
  - [Update a Task](#5-update-a-task)
  - [Delete a Task](#6-delete-a-task)
  - [Error Response](#7-error-response)
- [Project Structure](#project-structure)

---

## Features

- **🔐 JWT Authentication** — Register, login, and secure session management
- **📋 Kanban Board** — Drag-and-drop columns: **To Do → In Progress → Done**
- **🏷 Priority Levels** — High (👑), Medium (⚖️), Low (🌱)
- **🔖 Tags** — Organize tasks with custom tags (up to 10 per task)
- **📅 Due Dates** — Overdue detection with visual alerts
- **🔍 Search & Filter** — Full-text search, filter by status/priority, sort by multiple fields
- **📊 Stats Dashboard** — Real-time counts: Total, To Do, In Progress, Completed
- **📱 Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **🌙 Dark Theme** — Easy on the eyes, designed for extended use
- **⚡ Debounced Search** — Performant search with 300ms debounce
- **🔔 Toast Notifications** — Real-time feedback for every action

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | [Next.js 16](https://nextjs.org/) • [React 19](https://react.dev/) • [Tailwind CSS v4](https://tailwindcss.com/) • [Lucide Icons](https://lucide.dev/) • [Axios](https://axios-http.com/) |
| **Backend** | [Node.js](https://nodejs.org/) • [Express 5](https://expressjs.com/) • [Mongoose 9](https://mongoosejs.com/) • [JWT](https://jwt.io/) • [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **Database** | [MongoDB](https://www.mongodb.com/) |
| **Tooling** | [Nodemon](https://nodemon.io/) • [ESLint](https://eslint.org/) • [PostCSS](https://postcss.org/) |

---

## Live Demo

```
🌐 Frontend: https://task-tracker-ashy-kappa.vercel.app/
🔌 Backend API: https://task-tracker-6rip.onrender.com/api
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** v18 or higher
- **[npm](https://www.npmjs.com/)** v9 or higher *(or yarn/pnpm)*
- **[MongoDB](https://www.mongodb.com/)** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works great)
- **[Git](https://git-scm.com/)** for version control

---

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Puspak29/Task-Tracker.git
cd Task-Tracker
```

### 2. Environment Variables

The server requires a `.env` file. Create it in the `server/` directory:

```bash
touch server/.env
```

Add the following variables:

```env
# ─── MongoDB ──────────────────────────────────────────
MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>

# ─── JWT ──────────────────────────────────────────────
JWT_SECRET=<YOUR_JWT_SECRET_KEY>
JWT_EXPIRES_IN=7d

# ─── Server ───────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ─── Client URL (for CORS) ────────────────────────────
CLIENT_URL=http://localhost:3000
```

**Client environment** (optional — defaults to `http://localhost:5000/api`):

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run the Application

Start both the server and client **in two separate terminal windows**:

**Terminal 1 — Server:**
```bash
cd server
npm run dev
# 🚀 Server running in development mode on port 5000
# ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

**Terminal 2 — Client:**
```bash
cd client
npm run dev
# ▲ Next.js 16.2.10
# - Local: http://localhost:3000
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser. Register an account and start tracking!

---

## 📡 API Reference

### Health Check

```
GET /api/health
```

Returns the API status — no authentication required.

---

### Authentication

All auth endpoints return a JWT token and user object.

#### `POST /api/auth/register`
Register a new user.

| Field    | Type   | Required |
|----------|--------|----------|
| `name`   | String | ✅ Yes   |
| `email`  | String | ✅ Yes   |
| `password` | String | ✅ Yes |

#### `POST /api/auth/login`
Log into an existing account.

| Field      | Type   | Required |
|-----------|--------|----------|
| `email`    | String | ✅ Yes   |
| `password` | String | ✅ Yes   |

#### `GET /api/auth/me`
Get the currently authenticated user's profile.  
**Headers:** `Authorization: Bearer <token>`

---

### Tasks

All task endpoints require authentication.  
**Headers:** `Authorization: Bearer <token>`

#### `GET /api/tasks`
Get all tasks for the authenticated user. Supports filtering, searching, and sorting.

| Query Param | Type   | Default      | Description |
|-------------|--------|-------------|-------------|
| `status`    | String | `all`       | Filter by status (`todo`, `in-progress`, `done`) |
| `priority`  | String | `all`       | Filter by priority (`low`, `medium`, `high`) |
| `search`    | String | —           | Full-text search on title & description |
| `sortBy`    | String | `createdAt` | Sort field (`createdAt`, `dueDate`, `title`, `priority`, `updatedAt`) |
| `order`     | String | `desc`      | Sort order (`asc`, `desc`) |
| `tags`      | String | —           | Comma-separated tags to filter by |

#### `POST /api/tasks`
Create a new task.

| Field         | Type     | Required | Description |
|---------------|----------|----------|-------------|
| `title`       | String   | ✅ Yes   | Task title (max 100 chars) |
| `description` | String   | ❌ No    | Task description (max 500 chars) |
| `status`      | String   | ❌ No    | `todo`, `in-progress`, or `done` (default: `todo`) |
| `priority`    | String   | ❌ No    | `low`, `medium`, or `high` (default: `medium`) |
| `dueDate`     | Date     | ❌ No    | ISO 8601 date string |
| `tags`        | String[] | ❌ No    | Array of tags (max 10) |

#### `GET /api/tasks/:id`
Get a single task by ID.

#### `PUT /api/tasks/:id`
Update a task. All fields are optional individually.

| Field         | Type     | Description |
|---------------|----------|-------------|
| `title`       | String   | New title |
| `description` | String   | New description |
| `status`      | String   | New status |
| `priority`    | String   | New priority |
| `dueDate`     | Date     | New due date (or `null`) |
| `tags`        | String[] | New tags array |

#### `DELETE /api/tasks/:id`
Delete a task. Returns the deleted task data.

---

## Example Requests & Responses

### 1. Register

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Luke Skywalker",
    "email": "luke@jediorder.org",
    "password": "MayThe4thBeWithYou"
  }'
```

**Response** `201 Created`:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f67890123456",
    "name": "Luke Skywalker",
    "email": "luke@jediorder.org"
  }
}
```

---

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "darth.vader@empire.gov",
    "password": "IAmYourFather"
  }'
```

**Response** `200 OK`:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64b9c8d7e6f5012345678901",
    "name": "Darth Vader",
    "email": "darth.vader@empire.gov"
  }
}
```

---

### 3. Create a Task

**Request:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "Retrieve the Death Star plans",
    "description": "The Rebellion needs the architectural schematics of the Imperial Death Star. Locate the weakness in the thermal exhaust port and transmit the data to the Alliance fleet.",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2024-05-25T12:00:00.000Z",
    "tags": ["rebellion", "urgent", "espionage", "weapon-system"]
  }'
```

**Response** `201 Created`:
```json
{
  "success": true,
  "data": {
    "_id": "64d3e2f1a9b8c7654321fedc",
    "user": "64a1b2c3d4e5f67890123456",
    "title": "Retrieve the Death Star plans",
    "description": "The Rebellion needs the architectural schematics of the Imperial Death Star. Locate the weakness in the thermal exhaust port and transmit the data to the Alliance fleet.",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2024-05-25T12:00:00.000Z",
    "tags": ["rebellion", "urgent", "espionage", "weapon-system"],
    "createdAt": "2024-03-15T08:30:00.000Z",
    "updatedAt": "2024-03-15T08:30:00.000Z"
  }
}
```

---

### 4. Get All Tasks

**Request:**
```bash
curl -X GET "http://localhost:5000/api/tasks?status=all&priority=high&sortBy=dueDate&order=asc" \
  -H "Authorization: Bearer <your-token>"
```

**Response** `200 OK`:
```json
{
  "success": true,
  "count": 3,
  "stats": {
    "total": 5,
    "todo": 2,
    "inProgress": 1,
    "done": 2
  },
  "data": [
    {
      "_id": "64d3e2f1a9b8c7654321fedc",
      "user": "64a1b2c3d4e5f67890123456",
      "title": "Retrieve the Death Star plans",
      "description": "The Rebellion needs the architectural schematics...",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2024-05-25T12:00:00.000Z",
      "tags": ["rebellion", "urgent"],
      "createdAt": "2024-03-15T08:30:00.000Z",
      "updatedAt": "2024-03-15T08:30:00.000Z"
    },
    {
      "_id": "64e4f5a6b7c8d9e0f1234567",
      "user": "64a1b2c3d4e5f67890123456",
      "title": "Complete Jedi training with Yoda",
      "description": "Visit Dagobah. Master the Force. Unlearn what you have learned.",
      "status": "todo",
      "priority": "high",
      "dueDate": "2024-06-01T00:00:00.000Z",
      "tags": ["training", "force", "dagobah"],
      "createdAt": "2024-03-10T14:20:00.000Z",
      "updatedAt": "2024-03-10T14:20:00.000Z"
    },
    {
      "_id": "64f0a1b2c3d4e5f678901234",
      "user": "64a1b2c3d4e5f67890123456",
      "title": "Confront Darth Vader",
      "description": "Trust your feelings. You know it to be true.",
      "status": "todo",
      "priority": "high",
      "dueDate": "2024-07-04T00:00:00.000Z",
      "tags": ["destiny", "family"],
      "createdAt": "2024-03-08T09:00:00.000Z",
      "updatedAt": "2024-03-08T09:00:00.000Z"
    }
  ]
}
```

---

### 5. Update a Task

**Request:**
```bash
curl -X PUT http://localhost:5000/api/tasks/64e4f5a6b7c8d9e0f1234567 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "status": "done",
    "description": "✅ Successfully completed training with Master Yoda on Dagobah. The Force is strong with this one."
  }'
```

**Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "_id": "64e4f5a6b7c8d9e0f1234567",
    "user": "64a1b2c3d4e5f67890123456",
    "title": "Complete Jedi training with Yoda",
    "description": "✅ Successfully completed training with Master Yoda on Dagobah. The Force is strong with this one.",
    "status": "done",
    "priority": "high",
    "dueDate": "2024-06-01T00:00:00.000Z",
    "tags": ["training", "force", "dagobah"],
    "createdAt": "2024-03-10T14:20:00.000Z",
    "updatedAt": "2024-03-16T11:45:00.000Z"
  }
}
```

---

### 6. Delete a Task

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/tasks/64f0a1b2c3d4e5f678901234 \
  -H "Authorization: Bearer <your-token>"
```

**Response** `200 OK`:
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "_id": "64f0a1b2c3d4e5f678901234",
    "user": "64a1b2c3d4e5f67890123456",
    "title": "Confront Darth Vader",
    "description": "Trust your feelings. You know it to be true.",
    "status": "todo",
    "priority": "high",
    "tags": ["destiny", "family"],
    "createdAt": "2024-03-08T09:00:00.000Z",
    "updatedAt": "2024-03-08T09:00:00.000Z"
  }
}
```

---

### 7. Error Response

When you enter wrong credentials (e.g., invalid credentials):

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jarjar@binks.com",
    "password": "mesa-wrong"
  }'
```

**Response** `401 Unauthorized`:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

Or trying to delete a task that doesn't exist:

**Response** `404 Not Found`:
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## Project Structure

```
task-tracker/
├── client/                        # Next.js frontend
│   ├── app/
│   │   ├── globals.css           # Global styles & Tailwind
│   │   ├── layout.js             # Root layout (providers, fonts)
│   │   ├── page.js               # Home → Task Board (protected)
│   │   ├── login/
│   │   │   └── page.js           # Login page
│   │   └── register/
│   │       └── page.js           # Register page
│   ├── components/
│   │   ├── Navbar.jsx            # Top navigation bar
│   │   ├── StatsBar.jsx          # Task statistics cards
│   │   ├── FilterBar.jsx         # Search, filter & sort controls
│   │   ├── TaskBoard.jsx         # Kanban board (3 columns)
│   │   ├── TaskCard.jsx          # Individual task card
│   │   ├── TaskModal.jsx         # Create/Edit task modal
│   │   ├── ConfirmDialog.jsx     # Delete confirmation dialog
│   │   └── ui/                   # Shared UI primitives
│   │       ├── BackgroundOrbs.jsx # Animated background orbs
│   │       ├── AuthBrand.jsx     # Auth page branding
│   │       ├── ErrorAlert.jsx    # Error display component
│   │       ├── FieldInput.jsx    # Form inputs (text, textarea, select)
│   │       └── PasswordField.jsx # Password input with toggle
│   ├── context/
│   │   └── AuthContext.js        # Authentication context provider
│   ├── hooks/
│   │   └── useTasks.js           # Tasks hook (CRUD + state)
│   └── lib/
│       ├── api.js                # Axios instance & interceptors
│       ├── authApi.js            # Auth API calls
│       └── utils.js              # Priority/status configs, helpers
│
└── server/                        # Express backend
    └── src/
        ├── index.js              # Server entry point
        ├── config/
        │   └── db.js             # MongoDB connection
        ├── controllers/
        │   ├── authController.js  # Auth logic (register, login, me)
        │   └── taskController.js  # Task CRUD logic
        ├── middleware/
        │   ├── auth.js           # JWT verification middleware
        │   └── errorHandler.js   # Global error handler
        ├── models/
        │   ├── User.js           # User schema (name, email, hashed password)
        │   └── Task.js           # Task schema (title, status, priority, tags, etc.)
        ├── routes/
        │   ├── auth.js           # Auth routes
        │   └── tasks.js          # Task routes
        └── utils/
            ├── AppError.js       # Custom error class
            ├── asyncHandler.js   # Async route wrapper
            └── response.js       # Standardized response helpers
```
---

<p align="center">
  <em>"Do. Or do not. There is no try."</em> — Master Yoda
</p>
