```md
# Collaborative Task Manager — Backend

## Overview

This repository contains the **backend service** for the Collaborative Task Manager application.

It is a **production-ready REST API** built with **Node.js, Express, and TypeScript**, supporting:

- Secure authentication
- Task management (CRUD)
- Real-time collaboration via Socket.io
- Unit-tested business logic

---

## Tech Stack

- Node.js + Express (TypeScript)
- MongoDB Atlas
- Mongoose ODM
- JWT Authentication (HttpOnly Cookies)
- Socket.io
- Jest (Unit Testing)

---

## Architecture

The backend follows a **feature-based layered MVC architecture**:


### Design Principles

- Controllers handle HTTP concerns only
- Services contain business logic and authorization rules
- Models define database schemas
- DTOs (Zod) enforce request validation
- Socket.io events are emitted from services

---

## Authentication & Security

- Passwords hashed using bcrypt
- JWT stored in HttpOnly cookies
- Protected routes via auth middleware
- CORS configured for cross-origin cookies

---

## Real-Time Features (Socket.io)

The backend emits real-time events for task collaboration.

### Events

- `task:created` — broadcast on task creation
- `task:updated` — broadcast on task updates
- `notification:taskAssigned` — sent to assigned user

---

## Environment Variables

Create a `.env` file in the project root.

> ⚠️ **Do NOT commit this file to GitHub**

```env
PORT=5000
MONGO_URI=mongodb Uri
JWT_SECRET=JWT secret
NODE_ENV=development

---

## Setup Instructions
1. Clone Repository
git clone https://github.com/ajuajmal123/collaborative-task-manager-backend.git
cd collaborative-task-manager-backend

2. Install Dependencies
npm install

3. Run Development Server
npm run dev


Server runs at:

http://localhost:5000

Running Tests
npm test


Unit tests cover critical task service logic and authorization.

---

### Deployment

- Backend deployed on Render

- Database hosted on MongoDB Atlas (Free Tier)

- Live backend URL is provided in the submission.

---

### Trade-offs & Assumptions

- MongoDB chosen for rapid iteration and schema flexibility

- Unit tests focus on business logic

- Notifications are in-memory (can be persisted)

### Author

Muhammed Ajmal K K
Full-Stack Developer
GitHub: https://github.com/ajuajmal123

