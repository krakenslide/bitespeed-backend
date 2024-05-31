# BiteSpeed Backend Submission

## Overview

This is a formal submission of the take home assessment using Node.js, TypeScript and PostgreSQL.

API documentation: [swagger-ui](https://bitespeed-backend-a6xe.onrender.com/api-docs/)

## Project Structure

```
├── configs
│   └── database.config.ts  # Database connection configuration
├── controllers
│   └── identify.controller.ts  # API controller for contact identification
├── entities
│   └── contact.entity.ts  # TypeORM entity definition for Contact
├── models
│   └── contact.model.ts  # Contact model and constants
├── repositories
│   └── contact.repository.ts  # Repository for contact CRUD operations
├── routes
│   └── identify.route.ts  # API routes definition
├── services
│   └── identify.service.ts  # Business logic for contact identification
├── app.ts  # Main entry point
└── .env  # Environment variables
```

## Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/krakenslide/bitespeed-backend.git
    cd BiteSpeedBackend
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following content:
    ```plaintext
    PGUSER=your_db_user
    PGHOST=your_db_host
    PGDATABASE=your_db_name
    PGPASSWORD=your_db_password
    PGPORT=your_db_port
    PORT=your_server_port
    ```

4. **Run the service**
    ```bash
    npm start
    ```