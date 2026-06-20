# Application Logic

## Overview

myTrips is a lightweight travel diary web app. Users can create trip entries, share them with friends, comment, and like trips.

## App structure

### Home (`/`)

- Shows a welcome message and short description
- Displays recent trips from friends
- Provides navigation to main sections

### Authentication (`/login`)

- Login page that allows selecting an existing user
- Selecting a user sets the current user in the app state

### Profile (`/me`)

- Displays current user information
- Shows the number of trips created
- Provides access to create new trips

### Trips list (`/trips`)

- Displays a list of all trips
- Trips can be viewed, commented on, and liked
- Users can create a new trip

### Create trip (`/trips/new`)

- Form to create a new trip
- Fields: title, city, country, start/end dates, cost, rating, notes, places

### Trip details (`/trips/[tripId]`)

- Detailed information about a trip (dates, cost, rating, notes)
- Map of places related to the trip
- User comments and ability to like the trip

### Favorites (`/favorites`)

- List of trips liked by the current user
- Sorted by number of likes

### Friends (`/friends`)

- List of users in the system
- Shows number of trips per user
- Link to view a friend's profile

### Friend profile (`/friends/[userId]`)

- Information about a specific user
- List of their trips

## Display rules

### Authentication

- If the user is not signed in:
  - A "Sign in" button is shown in the header
  - Some actions are disabled (e.g. creating trips)
- If the user is signed in:
  - Their name and avatar are displayed in the header
  - All app features are available

### Permissions

- Users can create their own trips
- Users can comment and like any trip
- Users can view other users' profiles
- Users can see their favorites (trips they liked)

### Data display

- The home page shows the latest 3 trips
- The trips page lists all trips
- The favorites page shows trips liked by the current user
- The friends page shows all users
- A friend's profile displays only their trips

## Interactive elements

### Likes

- Users can toggle likes on trips
- Like counts affect sorting in Favorites
- Like state is persisted in the database

### Comments

- Users can add comments to trips
- Comments appear under the trip details
- Each comment includes author and timestamp

### Navigation

- The header contains primary navigation links
- Active link styling indicates the current section
- Routing is implemented using Next.js

## App state

### Global state

- Zustand is used for global state management
- `authStore` stores current user info
- `travelStore` temporarily stores trips data (will be replaced with API calls later)

### Data loading

- Pages load required data from server-side functions
- Loading indicators are used to improve UX (loading.tsx)

## UI notes

### Responsiveness

- The app is responsive and adapts to different screen sizes
- Layout uses Grid/Flexbox for mobile-friendly rendering

### Design

- Color palette leans toward blue tones (evoking sky and travel)
- Glass-like effects and gradients are applied to some UI elements
- Clean typography using Geist fonts

### UX

- Smooth transitions between states
- Visual feedback on interactions
- Loading indicators during data fetches
