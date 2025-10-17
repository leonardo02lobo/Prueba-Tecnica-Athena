# TelecomPlus SAS - FullStack Technical Test

## 📋 Project Overview

This project is a full-stack application for a telecommunications company (TelecomPlus SAS) that manages users, contracts, and services. The system includes JWT authentication and a modern web interface.

### 🏗️ Architecture
- **Backend**: Laravel 10+ API with JWT authentication
- **Frontend**: Next.js 14+ with TypeScript and modern UI components
- **Database**: MySQL with proper relationships between entities

## 🚀 Quick Start

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+
- MySQL 8.0+
- Laravel 10+

### 📁 Project Structure
```
telecomplus-fullstack/
├── backend/          # Laravel API
├── frontend/         # Next.js application
└── README.md
```

## 🔧 Backend Setup (Laravel)

### 1. Clone and Install Dependencies
```bash
cd backend
composer install
```

### 2. Environment Configuration
Create a `.env` file with the following variables:

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:f1RhA4ZvMJM9GuAdSpjIud8ydZN1Djsy0JkMKotND4g=
APP_DEBUG=true
APP_URL=http://localhost:8000

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_api
DB_USERNAME=root
DB_PASSWORD=root1234

SESSION_DRIVER=database
SESSION_LIFETIME=120

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database

MAIL_MAILER=log
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

JWT_SECRET=0QBRWlWU8kR3VXAFa7YQthxpxiUVNwVNwRskkcMBxkLXDHQ9FPj0Qm7iMuoOTQDL
```

### 3. Database Setup
```bash
# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# (Optional) Run seeders for sample data
php artisan db:seed
```

### 4. Start Development Server
```bash
php artisan serve --port=8000
```
The API will be available at: `http://localhost:8000`

## 🎯 Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=TelecomPlus
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```
The application will be available at: `http://localhost:3000`

## 📊 Database Schema

### Users Table
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| name | string | User's full name |
| email | string | Unique email address |
| password | string | Hashed password |
| role | string | User role (default: "customer") |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

### Contracts Table
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| user_id | foreignId | Reference to users table |
| contract_number | string | Unique contract number |
| start_date | date | Contract start date |
| status | string | Status (active, suspended, cancelled) |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

### Services Table
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| contract_id | foreignId | Reference to contracts table |
| type | enum | Service type (internet, tv) |
| plan_name | string | Plan name |
| price | decimal | Monthly price |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

## 🔐 API Endpoints

### Authentication Endpoints

#### POST `/api/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "status": 201
}
```

#### POST `/api/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "status": 200
}
```

### Protected Endpoints (Require JWT Token)

All protected endpoints require the following header:
```
Authorization: Bearer {your_jwt_token}
```

#### GET `/api/me`
Get current authenticated user's profile with contracts and services.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "contracts": [
      {
        "id": 1,
        "contract_number": "CONT-001",
        "start_date": "2024-01-01",
        "status": "active",
        "services": [
          {
            "id": 1,
            "type": "internet",
            "plan_name": "Basic Plan",
            "price": "29.99"
          }
        ]
      }
    ]
  },
  "status": 200
}
```

#### POST `/api/logout`
Logout user and invalidate token.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful",
  "status": 200
}
```

#### POST `/api/refresh`
Refresh JWT token.

**Response:**
```json
{
  "success": true,
  "access_token": "new_jwt_token_here",
  "token_type": "bearer",
  "expires_in": 3600,
  "status": 200
}
```

#### GET `/api/profile/{id}`
Get user profile by ID.

#### PUT `/api/profile/{id}`
Update user profile.

### User Management Endpoints

#### GET `/api/users`
Get all users (public endpoint).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

#### POST `/api/user/create`
Create a new user.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "customer"
}
```

#### GET `/api/user/{id}`
Get user by ID.

#### PUT `/api/user/{id}`
Update user (full update).

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "password": "newpassword123",
  "role": "customer"
}
```

#### PATCH `/api/user/{id}`
Partially update user.

**Request Body:**
```json
{
  "name": "Jane Smith Updated"
}
```

#### DELETE `/api/user/{id}`
Delete user.

### Contract Endpoints

#### GET `/api/contracts`
Get all contracts (public endpoint).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "contract_number": "CONT-001",
      "start_date": "2024-01-01",
      "status": "active",
      "services": [
        {
          "id": 1,
          "contract_id": 1,
          "type": "internet",
          "plan_name": "Basic Plan",
          "price": "29.99",
          "created_at": "2024-01-01T00:00:00.000000Z",
          "updated_at": "2024-01-01T00:00:00.000000Z"
        }
      ],
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

#### GET `/api/contract/{id}`
Get contract by ID (public endpoint).

#### POST `/api/contract/create`
Create a new contract (protected).

**Request Body:**
```json
{
  "contract_number": "CONT-002",
  "start_date": "2024-02-01",
  "status": "active"
}
```

**Response:**
```json
{
  "message": "Contract created successfully",
  "contract": {
    "id": 2,
    "user_id": 1,
    "contract_number": "CONT-002",
    "start_date": "2024-02-01",
    "status": "active",
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  },
  "status": 201
}
```

#### PUT `/api/contract/{id}`
Update contract (full update - protected).

**Request Body:**
```json
{
  "contract_number": "CONT-002-UPDATED",
  "start_date": "2024-02-01",
  "status": "suspended"
}
```

#### PATCH `/api/contract/{id}`
Partially update contract (protected).

**Request Body:**
```json
{
  "status": "cancelled"
}
```

#### DELETE `/api/contract/{id}`
Delete contract (protected).

### Service Endpoints

#### GET `/api/services`
Get all services (public endpoint).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "contract_id": 1,
      "type": "internet",
      "plan_name": "Basic Plan",
      "price": "29.99",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

#### GET `/api/service/{id}`
Get service by ID (public endpoint).

#### POST `/api/service/create`
Create a new service (protected).

**Request Body:**
```json
{
  "contract_id": 1,
  "type": "tv",
  "plan_name": "Premium TV",
  "price": 49.99
}
```

**Response:**
```json
{
  "message": "Service created successfully",
  "service": {
    "id": 2,
    "contract_id": 1,
    "type": "tv",
    "plan_name": "Premium TV",
    "price": "49.99",
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  },
  "status": 201
}
```

#### PUT `/api/service/{id}`
Update service (full update - protected).

**Request Body:**
```json
{
  "contract_id": 1,
  "type": "internet",
  "plan_name": "Premium Internet",
  "price": 59.99
}
```

#### PATCH `/api/service/{id}`
Partially update service (protected).

**Request Body:**
```json
{
  "price": 39.99
}
```

#### DELETE `/api/service/{id}`
Delete service (protected).

## 🔒 Authentication Flow

1. **Registration**: User registers with name, email, and password
2. **Login**: User logs in with email and password, receives JWT token
3. **Protected Routes**: Include JWT token in Authorization header for protected endpoints
4. **Token Refresh**: Use refresh token endpoint to get new access token

## 🛠️ Development Notes

### Backend Features
- JWT Authentication with tymon/jwt-auth
- RESTful API design
- Input validation and proper HTTP status codes
- CORS configuration for frontend integration
- Database relationships and eager loading
- Comprehensive error handling

### Frontend Features
- Modern React with TypeScript
- Responsive UI design
- JWT token management
- Form validation
- State management for user authentication
- API service layer

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS is properly configured in Laravel
   - Check that frontend URL is allowed in CORS configuration

2. **JWT Token Issues**
   - Verify JWT_SECRET in .env file
   - Check token expiration time
   - Ensure Authorization header is properly formatted

3. **Database Connection**
   - Verify MySQL is running
   - Check database credentials in .env file
   - Run migrations if tables don't exist

4. **API Connection**
   - Ensure Laravel server is running on port 8000
   - Check that frontend is configured to use correct API URL

## 📚 Additional Documentation

- [Laravel Documentation](https://laravel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [JWT Auth Documentation](https://jwt-auth.readthedocs.io)

## 👥 Development Team

This project was developed as part of a technical evaluation for a FullStack Developer position at TelecomPlus SAS.
