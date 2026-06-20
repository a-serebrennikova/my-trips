# Installation & Run

This document explains how to install dependencies, prepare the database, and run the project locally.

Prerequisites

- Node.js 18 or newer
- A package manager: `npm`, `pnpm`, or `yarn`
- (Optional) A database supported by Prisma; this project uses SQLite by default via Prisma.

Install

1. Clone the repository and enter the project folder:

```bash
git clone <repo-url>
cd my-trips
```

2. Install dependencies (choose one):

```bash
npm install
# or
pnpm install
# or
yarn install
```

Environment

Copy environment variables if an example exists and adjust values as needed:

```bash
cp .env.example .env.local
# edit .env.local and set values (DATABASE_URL, NEXT_PUBLIC_*, etc.)
```

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

Notes

- If you use `pnpm` or `yarn`, replace `npm run` with `pnpm`/`yarn` equivalents.
- The project uses Prisma; if you change the database provider, update `DATABASE_URL` and run `npm run db:push` / migrations accordingly.
