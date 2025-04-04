# Event Locator API

The Event Locator API is an amazing system for managing events, it Built with Node.js, Express, Sequelize, PostgreSQL (with PostGIS), Redis, this API allows user to register, log in, create events, categories and even get notifications of the events they created.

## Features

- **User Authentication:** Register and log in with email and password (hashed with bcrypt).
- **Event Management:** Create, update, delete, and get events.
- **Notifications:** Publish event updates to people.
  

## Technologies used

- **Node.js & Express:** Backend framework.
- **Sequelize:** ORM for PostgreSQL with PostGIS for geospatial data.
- **bcrypt:** Password hashing for security.
- **JWT:** Token-based authentication.
- **i18next:** Internationalization support.
  

## Prerequisites

- **Node.js:** v16 or higher
- **PostgreSQL:** v13+ with PostGIS extension
- **npm:** For package management

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd event-locator-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add:

```ini
PORT=3000
DB_PORT=5432
DB_NAME='postgres://user:pass@localhost:5432/locator'
JWT_SECRET=your-secret-key-here
```

Replace `DATABASE_URL` with your PostgreSQL connection string. Use a strong `JWT_SECRET` for token signing.

### 4. Set Up PostgreSQL

Create a database:

```sql
CREATE DATABASE event_locator_db;
```

Enable PostGIS:

```sql
\c event_locator_db
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 5. Run Database Migrations

Sync the Sequelize models with your database:

```bash
npx sequelize db:migrate
```

### 6. Start the Server

```bash
npm run dev
```

The API will run on `http://localhost:3000`.

## Usage

### API Endpoints

Key endpoints include:

#### Authentication

- **POST users/register:** Register a new citizen.
  ```bash
  curl -X POST "http://localhost:3000/api/users/register?lang=en" -d '{"username": username, "email": "user@example.com", "password": "Pass23!", "location": "Kigali, Rwanda","language_preference": "fr"}' -H "Content-Type: application/json"
  ```
  **Response:**
  ```json
  {
    "message": "Citizen welcomed successfully",
    "id": 1,
    "email": "user@example.com"
  }
  ```
- **POST /users/login:** Log in and get a JWT token.
  ```bash
  curl -X POST "http://localhost:3000/users/login?lang=fr" -d '{"email": "user@example.com", "password": "Pass23!"}' -H "Content-Type: application/json"
  ```
  **Response:**
  ```json
  { "message": "user logged in successfully", "token": "eyJhbGciOiJIUzI1NiIs..." }
  ```

#### Events

- **POST /events:** Create an event (requires token).
- **GET /events:** List all events.
- **PUT /events/{id}:** Update an event (creator only).
- **DELETE /events/{id}:** Delete an event (creator only).


## Project Structure

```
event-locator-api/
├── controllers/
│   ├── userController.js    # Authentication endpoints
│   ├── categoryController.js    # categories endpoints
│   ├── eventController.js    # Event management endpoints
│   ├── notificationController.js    # notifications endpoints
├── middlewares/
│   ├── auth.js       # authentication middlewares
│   ├── i18n.js         # middlewares
├── models/
│   ├── event.js        # Event model
│   ├──user.js         # User model
│   ├── category.js       # category model
│   └── user_category.js     # user category model
│   └── notification.js     # notification model
├── routes/
│   ├── eventRoutes.js        # Event  routes
│   ├──userRoutes.js         # User  routes
│   ├── categoryRoutes.js       # category  routes
│   └── user_categoryRoutes.js     # user category  routes
│   └── notificationRoutes.js     # notification routes

├── .env                # Environment variables
├── server.js              # Main application file
├── swagger.yml         # Swagger API documentation
└── package.json        # Dependencies and scripts
```

## Testing

### Manual Testing

1. Start the server: `npm start`.
2. Register a user, log in, and use the token to test event endpoints.

### Automated Testing (Optional)

Add a test suite with a framework like Jest:

```bash
npm install --save-dev jest supertest
```

Create a `tests/` folder and add test files (e.g., `auth.test.js`). Run tests:

```bash
npm test
```

### link to the video

[video link](https://youtu.be/rHwtTVPi5xA)
