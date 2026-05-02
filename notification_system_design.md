# Notification System Design

## Priority Logic

Notifications are ranked by type first and timestamp second. Placement notifications have the highest priority, followed by Result and Event notifications.

Priority order:

- Placement: 3
- Result: 2
- Event: 1

The Stage 1 utility creates a copy of the notification list, sorts it by priority in descending order, sorts equal-priority items by latest timestamp first, and returns the top 10 records.

## Data Flow

1. The dashboard mounts in the React app.
2. The auth API requests a bearer token from the protected service.
3. The logging middleware stores the token for log requests.
4. The notifications API fetches protected notification data using the bearer token.
5. The dashboard normalizes the API response, stores notifications in React state, and calculates the top priority notifications.
6. The UI renders cards, filters, pagination controls, and the top priority section.

## API Usage

- `POST /evaluation-service/auth` gets the access token.
- `GET /evaluation-service/notifications?limit=10&page=1` gets notifications.
- `GET /evaluation-service/notifications?limit=10&page=1&notification_type=Placement` supports server-side type filtering.
- `POST /evaluation-service/logs` records frontend activity.

All protected calls use the bearer token in the `Authorization` header.

## Logging Middleware

The reusable logging middleware exposes:

- `setLogToken(token)` to store the current bearer token.
- `Log(stack, level, package, message)` to send structured logs.

The frontend logs component mount, authentication success/failure, notification API success/failure, state updates, filtering actions, pagination changes, and page-level errors.

## Continuous Incoming Notifications

The current frontend fetches notifications when the dashboard loads and keeps filtering/pagination in local state. For continuous incoming notifications, the same API flow can be repeated on an interval or replaced with a streaming transport. New data would be normalized, merged by notification ID, sorted again using the priority utility, and rendered without storing data in a database.
