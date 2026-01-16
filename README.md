# 📚 Library Management System - Frontend

A modern, full-featured library management web application built with React, TypeScript, and Tailwind CSS. This system enables librarians to manage book inventories and members to borrow and return books with an intuitive, responsive interface.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff.svg)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-24%20passing-success.svg)](https://vitest.dev/)

---

## 🎯 Features

### For Librarians
- ✅ **Book Management** - Add, edit, and delete books with complete metadata (title, author, genre, ISBN, copies)
- ✅ **Borrowing Oversight** - View all borrowings, filter by status, mark books as returned
- ✅ **Dashboard Analytics** - Track total books, borrowed books, due today, and members with overdue books
- ✅ **User Invitations** - Send invitation emails to new members with role assignment
- ✅ **Search & Filter** - Find books by title, author, or genre with real-time filtering

### For Members
- ✅ **Browse Books** - Explore the library catalog with search and pagination
- ✅ **Borrow Books** - One-click borrowing with automatic due date calculation (2 weeks)
- ✅ **My Borrowings** - Track active borrowings, due dates, and overdue books
- ✅ **Dashboard** - Personal overview of borrowed books and overdue status
- ✅ **Duplicate Prevention** - Cannot borrow the same book twice

### General
- ✅ **Authentication** - Secure JWT-based login and registration
- ✅ **Role-Based Access** - Different interfaces and permissions for librarians vs members
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Real-time Updates** - Automatic cache invalidation keeps data fresh
- ✅ **Error Handling** - User-friendly error messages and retry mechanisms

---

## 🛠️ Technology Stack

### Core Technologies
- **React 19.2.0** - Modern UI library with concurrent features
- **TypeScript 5.9.3** - Type-safe JavaScript for better DX
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework

### Key Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| React Router | 7.12.0 | Client-side routing and navigation |
| TanStack Query | 5.90.17 | Server state management and caching |
| Zustand | 5.0.10 | Lightweight global state management |
| React Hook Form | 7.71.1 | Performant form handling |
| Zod | 4.3.5 | Runtime schema validation |
| Axios | 1.13.2 | HTTP client with interceptors |
| MSW | 2.12.7 | API mocking for testing |
| Vitest | 4.0.17 | Fast unit and integration testing |

---

## 📁 Project Structure

```
src/
├── api/                    # API layer - all backend communication
│   ├── client.ts          # Axios instance with JWT interceptors
│   ├── auth.ts            # Authentication endpoints
│   ├── books.ts           # Book CRUD operations
│   ├── borrowings.ts      # Borrowing/returning operations
│   ├── dashboard.ts       # Dashboard data fetching
│   └── invitations.ts     # User invitation management
│
├── components/            # Reusable UI components
│   ├── common/           # Shared components (AuthProvider, ProtectedRoute)
│   ├── layout/           # Layout components (Header, Sidebar, MainLayout)
│   └── ui/               # UI primitives (Modal, Pagination, Toast, Icons)
│
├── features/              # Feature-based modules
│   ├── auth/             # Login, signup, authentication
│   ├── books/            # Book catalog and management
│   ├── borrowings/       # Borrowing management
│   ├── dashboard/        # Role-specific dashboards
│   └── invitations/      # User invitation system
│
├── store/                 # Global state (Zustand)
├── types/                 # TypeScript type definitions
├── test/                  # Test utilities and mocks
├── App.tsx               # Root component
├── Router.tsx            # Route definitions
└── main.tsx              # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **Docker** (optional, for containerized development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/magnumfonseca/library-management-frontend.git
   cd library-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend API URL:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   App will be available at **http://localhost:5173**

### Using Docker

**Development Mode (with hot reload):**
```bash
docker compose up frontend-dev
```

**Production Build:**
```bash
docker compose up frontend
```

| Environment | URL |
|-------------|-----|
| Development | http://localhost:5173 |
| Production | http://localhost:8080 |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run test:coverage` | Run tests with coverage report |

---

## 🧪 Testing

This project has comprehensive test coverage with **24 passing tests**.

**Run tests:**
```bash
# Watch mode (interactive)
npm test

# Single run
npm run test:run

# With coverage report
npm run test:coverage
```

**What's tested:**
- ✅ API integration (dashboard, invitations)
- ✅ Component rendering
- ✅ User interactions (clicks, form submissions)
- ✅ Authentication flows
- ✅ Role-based access control

**Testing stack:**
- **Vitest** - Fast test runner
- **React Testing Library** - Component testing
- **MSW (Mock Service Worker)** - API mocking
- **@testing-library/user-event** - User interaction simulation

---

## 🌐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` | Yes |

**Example `.env` file:**
```env
VITE_API_URL=http://localhost:3000
```

---

## 🔗 Backend Integration

This frontend connects to the [Library Management API](https://github.com/magnumfonseca/library_management) (Rails backend).

**API Endpoints Used:**
- `POST /api/v1/login` - User authentication
- `GET /api/v1/books` - Fetch books with filters
- `POST /api/v1/borrowings` - Borrow a book
- `PATCH /api/v1/borrowings/:id/return` - Return a book
- `GET /api/v1/dashboard` - Role-specific dashboard data
- `POST /api/v1/invitations` - Send user invitations

**Authentication:**
- JWT token stored in `localStorage`
- Token sent in `Authorization: Bearer <token>` header
- Automatic logout on 401 responses

---

## 🏗️ Architecture Decisions

### Feature-Based Structure
Each feature has its own folder with components, types, and logic. This makes the codebase easier to navigate and scale.

### Type Safety
- **TypeScript** ensures compile-time type checking
- **Zod** provides runtime validation for forms and API responses
- **Type guards** handle discriminated unions safely

### State Management Strategy
- **Server state** → TanStack Query (books, borrowings, dashboard)
- **Client state** → Zustand (authentication)
- **URL state** → React Router (filters, pagination)
- **Local state** → useState (UI state like modals)

### API Layer Separation
All API calls are isolated in `src/api/`, making it easy to:
- Test components without real API calls
- Switch to a different backend
- Mock API responses for testing

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel/Netlify

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod --dir=dist
```

### Environment Variables in Production

Make sure to set `VITE_API_URL` to your production backend URL:
```
VITE_API_URL=https://api.yourbackend.com
```

### Docker Production Deployment

```bash
docker build -t library-management-frontend .
docker run -p 8080:80 library-management-frontend
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Standards

- Follow TypeScript best practices
- Write tests for new features
- Run `npm run lint` before committing
- Keep components small and focused
- Use meaningful commit messages

---

## 🐛 Troubleshooting

### Common Issues

**Port 5173 already in use:**
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

**API connection issues:**
- Verify backend is running on port 3000
- Check `VITE_API_URL` in `.env`
- Look for CORS errors in browser console

**Build failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tests failing:**
- Ensure you're using Node.js 20+
- Clear test cache: `npm test -- --clearCache`

---

## 📚 Documentation

- **[Interview Guide](./INTERVIEW_GUIDE.md)** - Comprehensive guide for interviews and learning
- **[Backend Repository](https://github.com/magnumfonseca/library_management)** - Rails API

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Magnum Fonseca**
- GitHub: [@magnumfonseca](https://github.com/magnumfonseca)

---

## 🙏 Acknowledgments

- Built as a demonstration of modern React best practices
- Inspired by real-world library management systems
- Uses the latest React 19 features and patterns

---

**⭐ Star this repo if you found it helpful!**
