# Library Management Frontend

React frontend for the Library Management System, built with Vite, TypeScript, and Tailwind CSS.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Zustand
- React Router v6
- React Hook Form + Zod

## Prerequisites

- Node.js 20+
- npm
- Docker (optional)

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start dev server
npm run dev
```

App runs at http://localhost:5173

### Using Docker

```bash
# Development (with hot reload)
docker compose up frontend-dev

# Production build
docker compose up frontend
```

- Development: http://localhost:5173
- Production: http://localhost:8080

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |

## Backend

This frontend connects to the [Library Management API](https://github.com/magnumfonseca/library_management) running on port 3000.
