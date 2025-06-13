# Task Management System

A full-stack web application for managing tasks with user authentication, role-based access control, and file attachments.

## Features

- 🔒 JWT-based authentication with role-based access control
- 👥 User management (Admin and User roles)
- 📝 Task management with CRUD operations
- 📎 PDF document attachments (up to 3 per task)
- 🔍 Advanced filtering and sorting
- 📱 Responsive design with modern UI

## Tech Stack

### Backend
- Node.js + Express
- MongoDB
- JWT Authentication
- Jest for testing

### Frontend
- React
- Tailwind CSS
- Redux Toolkit
- React Router

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- MongoDB (if running locally)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Environment Setup:
   - Copy `.env.example` to `.env` in both client and server directories
   - Update the environment variables as needed

4. Run with Docker:
```bash
docker-compose up
```

5. Run locally:
```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory)
npm run dev
```

## API Documentation

API documentation is available at `/api-docs` when running the server.

## Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## Project Structure

```
task-manager/
├── client/                # React frontend
├── server/                # Node.js backend
├── docker-compose.yml     # Docker configuration
└── README.md             # Project documentation
```

## License

MIT 