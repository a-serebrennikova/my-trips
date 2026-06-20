# Installation & Run

This document explains how to install dependencies, prepare the database, and run the project locally using npm.

Prerequisites

- Node.js 18 or newer
- npm (package manager)
- A database supported by Prisma; this project uses SQLite by default via Prisma.

Install

1. Install dependencies:

```bash
npm install
```

Environment

Copy environment variables into `.env.local` with `DATABASE_URL`.

Prisma (database)

Generate the Prisma client and apply the schema:

```bash
npm run db:generate
npm run db:push
```

Seed the database (optional):

```bash
npm run db:seed
```

Run (development)

Start the Next.js development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Build & Run (production)

```bash
npm run build
npm start
```
