# Database schema

## Overview

This project uses Prisma ORM with a SQLite database. The schema is defined in `prisma/schema.prisma`.

## Data models

### User

User model.

**Fields:**

- `id` (String) — unique identifier (generated via `cuid()`)
- `name` (String) — user name
- `avatarColor` (String) — avatar color used for visuals
- `homeCity` (String) — user's home city

**Relations:**

- `trips` — one-to-many relation to `Trip` (cascade on delete)
- `comments` — one-to-many relation to `Comment` (cascade on delete)
- `likes` — one-to-many relation to `TripLike` (cascade on delete)

### Trip

Trip model.

**Fields:**

- `id` (String) — unique trip id (generated via `cuid()`)
- `userId` (String) — foreign key to the user who created the trip
- `title` (String) — trip title
- `city` (String) — trip city
- `country` (String) — trip country
- `startDate` (String) — trip start date
- `endDate` (String) — trip end date
- `days` (Int) — length of the trip in days
- `approximateCost` (Int) — estimated cost
- `currency` (String) — currency symbol ("₽", "€", "$")
- `rating` (Int) — rating (1–5)
- `coverImage` (String) — cover image URL
- `notes` (String?) — optional notes
- `createdAt` (String) — creation timestamp

**Relations:**

- `user` — many-to-one to `User` (cascade on delete)
- `places` — one-to-many to `Place` (cascade on delete)
- `comments` — one-to-many to `Comment` (cascade on delete)
- `likes` — one-to-many to `TripLike` (cascade on delete)

### Place

Place model for trip locations (attractions or cafes).

**Fields:**

- `id` (String) — unique place id (generated via `cuid()`)
- `name` (String) — place name
- `city` (String) — city of the place
- `note` (String?) — optional note
- `tripId` (String) — foreign key to the trip
- `type` (String) — place type (`"attraction"` or `"cafe"`)

**Relations:**

- `trip` — many-to-one to `Trip` (cascade on delete)

### Comment

Comment model for trip comments.

**Fields:**

- `id` (String) — unique comment id (generated via `cuid()`)
- `tripId` (String) — foreign key to the trip
- `authorId` (String) — foreign key to the user who wrote the comment
- `message` (String) — comment text
- `createdAt` (String) — creation timestamp

**Relations:**

- `trip` — many-to-one to `Trip` (cascade on delete)
- `author` — many-to-one to `User` (cascade on delete)

### TripLike

Join model representing likes (many-to-many between `Trip` and `User`).

**Fields:**

- `tripId` (String) — foreign key to the trip
- `userId` (String) — foreign key to the user

**Relations:**

- `trip` — many-to-one to `Trip` (cascade on delete)
- `user` — many-to-one to `User` (cascade on delete)

**Primary key:**

- Composite primary key on `tripId` and `userId` to prevent duplicate likes

## Relations between models

### User ↔ Trip

- One user can create many trips
- Deleting a user cascades and removes their trips

### Trip ↔ Place

- One trip can have many places
- Deleting a trip cascades and removes related places

### User ↔ Comment

- One user can create many comments
- Deleting a user cascades and removes their comments

### Trip ↔ Comment

- One trip can have many comments
- Deleting a trip cascades and removes its comments

### User ↔ Trip ↔ TripLike

- Many users can like many trips
- Implemented via the intermediate `TripLike` model

## Indexes and constraints

- All models use `cuid()` for unique identifiers
- `TripLike` uses a composite primary key to prevent duplicate likes
- Cascade deletes are used to maintain referential integrity

## Usage in the app

- Models are accessed via Prisma Client for CRUD operations
- Relations make it easy to query related data (e.g. user's trips or trip comments)
- The schema supports the app features: creating trips, commenting, and liking
