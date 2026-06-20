# Project structure

Root layout of the repository and main folders:

```
my-trips/
├── app/                    # Main application pages and routes
│   ├── api/                # API routes
│   │   └── travel/         # Travel-related API endpoints
│   ├── favorites/          # Favorites pages
│   ├── friends/            # Friends pages
│   ├── login/              # Login pages
│   ├── me/                 # User profile pages
│   ├── trips/              # Trips pages
│   │   └── [tripId]/       # Single trip page
│   ├── layout.tsx          # App layout
│   └── page.tsx            # Home page
├── components/             # Reusable UI components
│   ├── friends/            # Friends-related components
│   ├── login/              # Auth components
│   ├── main/               # Core UI components
│   └── trip/               # Trip-related components
├── docs/                   # Project documentation (this folder)
├── lib/                    # Utility libraries and helpers
├── prisma/                 # Prisma schema and seeds
├── public/                 # Static assets
├── package.json
└── README.md
```

Notes:

- The `app` directory follows Next.js conventions and contains pages, API routes and nested routes for trips and users.
- Reusable components are organized under `components/` by feature area.
- Documentation is kept in the `docs/` folder as markdown files.
