# Stack

## Core stack

### Frontend

- **Next.js 16.1.6** — React framework with SSR/SSG support
- **React 19.2.3** — UI library
- **TypeScript** — Typed superset of JavaScript
- **Tailwind CSS** — Utility-first CSS framework

### State management

- **Zustand** — Lightweight state manager for React
- **React Hook Form** — Forms and validation

### Backend & database

- **Next.js API Routes** — lightweight API endpoints
- **Prisma ORM** — Database ORM for TypeScript/Node
- **SQLite** — Embedded SQL database

### UI & styling

- **Radix UI Themes** — Accessible, unstyled UI primitives
- **Geist Font** — Modern UI fonts

### Validation

- **Zod** — Schema validation and TypeScript inference

### Development tools

- **ESLint** — Linting and code quality
- **PostCSS** — CSS transformations

## Architectural notes

- Global state is handled with `Zustand` (separate stores for auth and travel data).
- Prisma is used as the ORM; server-side functions and client components are used for data flow.
- Tailwind CSS and Radix provide styling and components; design focuses on modern, glassy gradients and accessibility.
