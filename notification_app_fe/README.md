# Campus Notification Frontend

This is my frontend submission for the campus hiring evaluation. The app gets a token from the evaluation service, fetches campus notifications, sorts the important ones by priority, and displays everything in a small React dashboard.

I kept the project simple on purpose: React, vanilla CSS, separate API files, reusable components, and a logging middleware as required.

## What It Does

- Authenticates with the protected API
- Sends frontend logs through the logging middleware
- Fetches notifications using the bearer token
- Sorts top notifications using this priority:
  - Placement
  - Result
  - Event
- Shows notification cards with type, message, timestamp, and new/seen status
- Supports filtering by notification type
- Supports previous/next pagination
- Shows a top priority notifications section

## Folder Structure

```text
RA2311003012188/
├── logging_middleware/
│   └── logger.js
├── notification_app_fe/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── utils/
│       ├── App.js
│       └── index.js
├── notification_system_design.md
└── .gitignore
```

## Main Files

- `src/api/auth.js` handles token generation
- `src/api/notifications.js` handles notification API calls
- `src/logging_middleware/logger.js` sends logs from the frontend
- `src/utils/priority.js` contains the top notification sorting logic
- `src/pages/Dashboard.jsx` connects the API, state, filters, pagination, and UI
- `src/components/NotificationCard.jsx` displays one notification
- `src/components/FilterBar.jsx` handles notification type filters
- `src/components/Pagination.jsx` handles page navigation

## Running The Project

From the frontend folder:

```bash
npm install
npm start
```

The app runs at:

```text
http://localhost:3000
```

## Build Check

I tested the production build with:

```bash
npm run build
```

The build completed successfully.

## Notes

The API is protected, so all notification and logging calls depend on a valid auth token. For local development, the React dev proxy is used to avoid browser CORS issues while still calling the evaluation service.
