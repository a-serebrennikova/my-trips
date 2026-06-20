# Project technologies

## Core stack

### Frontend

- **Next.js 16.1.6** — React framework with SSR/SSG
- **React 19.2.3** — UI library
- **TypeScript** — Typed superset of JavaScript
- **Tailwind CSS** — Utility-first CSS framework

### State management

- **Zustand** — Lightweight state manager for React
- **React Hook Form** — Form management and validation

### Backend & database

- **Prisma ORM** — Modern ORM for TypeScript/Node.js
- **SQLite** — Embedded SQL database
- **better-sqlite3** — SQLite driver for Node.js

### UI components

- **Radix UI Themes** — Design system and components for React
- **Geist Font** — Modern fonts from Vercel

### Schema validation

- **Zod** — Schema validation and TypeScript inference

### Development tools

- **ESLint** — Linting and code quality
- **PostCSS** — CSS transformation tooling

## Architectural notes

### App state

- Zustand is used for global state management
- Stores are split into `authStore` (authentication) and `travelStore` (trips data)

### Data handling

- Prisma is the ORM used to access the database
- Server functions provide data fetching, while client components handle interactivity

### Styling

- Tailwind CSS for utility-first styling
- Radix UI for accessible, composable components
- Gradients and glass-like visual effects are used for a modern UI

### Security

- Session state is kept in client storage for this demo
- Input validation is performed with Zod before saving data
