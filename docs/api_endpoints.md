# API Endpoints

## Overview

This project exposes REST-like API endpoints using Next.js API Routes. All travel-related endpoints are located under `app/api/travel`.

## API Structure

### GET `/api/travel`

Retrieve all travel and user data.

**Response:**

```json
{
  "users": [...],
  "trips": [...]
}
```

### GET `/api/travel/me`

Retrieve the current user (session is simulated in this demo project).

**Response:**

```json
{
  "user": {...}
}
```

### GET `/api/travel/trips`

Retrieve all trips.

**Response:**

```json
[
  {
    "id": "...",
    "userId": "...",
    "title": "...",
    "city": "...",
    "country": "...",
    ...
  }
]
```

### GET `/api/travel/trips/[tripId]`

Retrieve a single trip by ID.

**Parameters:**

- `tripId` — trip identifier

**Response:**

```json
{
  "trip": {...},
  "author": {...},
  "likedByUserIds": [...]
}
```

### POST `/api/travel/trips/[tripId]/like`

Toggle a like for a trip (add or remove).

**Parameters:**

- `tripId` — trip identifier
- Request body: `{ userId: string, action: "add" | "remove" }`

**Response:**

```json
{
  "success": true,
  "likedByUserIds": [...]
}
```

### POST `/api/travel/trips/[tripId]/comments`

Add a comment to a trip.

**Parameters:**

- `tripId` — trip identifier
- Request body: `{ authorId: string, message: string }`

**Response:**

```json
{
  "success": true,
  "comment": {...}
}
```

## Implementation details

### Internal helpers

API endpoints delegate data operations to internal helpers in `lib/serverTravelDb.ts`, which use Prisma Client to access the database.

### Error handling

Endpoints return standard HTTP status codes:

- `200 OK` — successful request
- `404 Not Found` — requested resource not found
- `500 Internal Server Error` — server error

## Usage in the app

Client components call functions from `lib/travelApi.ts` to interact with these endpoints.

All API operations are asynchronous and use Promises.

## Security

### Validation

Incoming payloads are validated using Zod schemas before being persisted.

### Authorization

- Read operations are public.
- Mutations (likes, comments) require an authenticated user.
