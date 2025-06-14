# LinkedIn Clone Backend

A Node.js Express backend for a LinkedIn-like web application using MariaDB.

## Features

- User authentication (register/login)
- User profiles
- Experience and education management
- Connections system
- JWT-based authentication
- MariaDB database with Sequelize ORM

## Prerequisites

- Node.js (v14 or higher)
- MariaDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=linkedin_clone
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Create a new MariaDB database:
   ```sql
   CREATE DATABASE linkedin_clone;
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

## Project Structure

```
src/
  ├── config/        # Database configuration
  ├── controllers/   # Route controllers
  ├── models/        # Database models
  ├── routes/        # API routes
  └── server.js      # Entry point
```

## Development

The server will automatically restart when you make changes to the code (using nodemon).

## License

MIT 