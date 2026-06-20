# Project commands

## Install dependencies

```bash
npm install
```

Install project dependencies defined in `package.json`.

## Run the app

### Development

```bash
npm run dev
```

Run the app in development mode with hot reload. The app will be available at http://localhost:3000.

### Build

```bash
npm run build
```

Create an optimized production build.

### Start (production)

```bash
npm run start
```

Start the compiled production build.

## Database tasks

### Generate Prisma client

```bash
npm run db:generate
```

Generate TypeScript types based on the Prisma schema. Run after changes to `schema.prisma`.

### Apply schema changes

```bash
npm run db:push
```

Apply `schema.prisma` changes to the database without creating a migration (useful during development).

### Seed the database

```bash
npm run db:seed
```

Populate the database with initial test data from `prisma/seed.ts`. The seeder creates 3 users with example trips, comments, likes, and visited places.

After running the command the database will contain:

- 3 users with unique names and avatar colors
- 3 trips with detailed information (title, dates, cost, rating, notes)
- Places (attractions and cafes) for each trip
- Comments from users on trips
- Likes applied by users to trips

### Open Prisma Studio

```bash
npm run db:studio
```

Open the browser-based Prisma Studio to view and edit database records.

## Additional commands

### Linting

```bash
npm run lint
```

Run ESLint to check code quality.

## Scripts overview

All scripts are defined under `scripts` in `package.json`:

- `dev`: Start Next.js in development mode
- `build`: Build the app for production
- `start`: Run the production build
- `lint`: Run ESLint
- `db:generate`: Generate Prisma client
- `db:push`: Apply Prisma schema changes
- `db:seed`: Seed the database
- `db:studio`: Open Prisma Studio

## Environment variables

The application may require environment variables defined in `.env.local`:

- `DATABASE_URL` — database connection URL (by default uses a local SQLite file)
