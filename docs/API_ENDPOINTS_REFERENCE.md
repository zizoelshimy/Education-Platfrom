# Education Platform API - Mobile Developer Reference

**Base URL:** `http://localhost:3000`  
**API Version:** `v1`  
**Full Base URL:** `http://localhost:3000/api/v1`

This document provides a complete reference for all available API endpoints for mobile application development.

---

## 📋 Table of Contents

1. [Authentication Endpoints](#-authentication-endpoints)
2. [User Management Endpoints](#-user-management-endpoints)
3. [Health Check Endpoints](#-health-check-endpoints)
4. [Authentication Guide](#-authentication-guide)
5. [Error Responses](#-error-responses)
6. [Response Format](#-response-format)

---

## 🔐 Authentication Endpoints

### 1. User Registration
**Endpoint:** `POST /api/v1/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "phone": "+1234567890",
  "bio": "Optional bio text"
}
```

**Roles:** `student`, `teacher`, `admin`

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "message": "Registration successful. Please check your email to verify your account.",
    "userId": "676f8e1234567890abcdef12"
  },
  "timestamp": "2025-09-09T15:30:00.000Z",
  "path": "/api/v1/auth/register"
}
```

**Error Responses:**
- `400` - Validation errors (password mismatch, weak password, etc.)
- `409` - User already exists

---

### 2. Email Verification
**Endpoint:** `GET /api/v1/auth/verify-email`

**Query Parameters:**
- `token` (required): Email verification token

**Example:**
```
GET /api/v1/auth/verify-email?token=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Email verified successfully! Your account is now active and you can log in.",
  "data": {
    "message": "Email verified successfully! Your account is now active and you can log in."
  },
  "timestamp": "2025-09-09T15:35:00.000Z",
  "path": "/api/v1/auth/verify-email"
}
```

**Error Responses:**
- `404` - Invalid or expired token

---

### 3. User Login
**Endpoint:** `POST /api/v1/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "676f8e1234567890abcdef12",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student"
    },
    "expires_in": "15m"
  },
  "timestamp": "2025-09-09T15:40:00.000Z",
  "path": "/api/v1/auth/login"
}
```

**Error Responses:**
- `401` - Invalid password
- `404` - User not found
- `400` - Email not verified

---

### 4. Token Refresh
**Endpoint:** `POST /api/v1/auth/refresh`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh_token": "your_refresh_token_here"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "access_token": "new_access_token_here",
    "expires_in": "15m"
  }
}
```

---

## 👥 User Management Endpoints

### 1. Get Current User Profile
**Endpoint:** `GET /api/v1/users/profile`

**Authentication:** JWT Token Required

**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "676f8e1234567890abcdef12",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "phone": "+1234567890",
    "bio": "Computer Science Student",
    "emailVerified": true,
    "createdAt": "2025-09-09T15:30:00.000Z",
    "updatedAt": "2025-09-09T15:30:00.000Z"
  },
  "timestamp": "2025-09-09T15:45:00.000Z",
  "path": "/api/v1/users/profile"
}
```

---

### 2. Get All Users (Admin Only)
**Endpoint:** `GET /api/v1/users`

**Authentication:** JWT Token Required + Admin Role

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
Content-Type: application/json
```

**Query Parameters (Optional):**
- `role`: Filter by role (`student`, `teacher`, `admin`)

**Examples:**
```
GET /api/v1/users
GET /api/v1/users?role=student
GET /api/v1/users?role=teacher
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "676f8e1234567890abcdef12",
      "email": "user1@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student",
      "phone": "+1234567890",
      "bio": "Computer Science Student",
      "emailVerified": true,
      "createdAt": "2025-09-09T15:30:00.000Z",
      "updatedAt": "2025-09-09T15:30:00.000Z"
    },
    {
      "id": "676f8e1234567890abcdef13",
      "email": "user2@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "teacher",
      "phone": "+1987654321",
      "bio": "Mathematics Teacher",
      "emailVerified": true,
      "createdAt": "2025-09-09T15:35:00.000Z",
      "updatedAt": "2025-09-09T15:35:00.000Z"
    }
  ],
  "count": 2,
  "timestamp": "2025-09-09T15:50:00.000Z",
  "path": "/api/v1/users"
}
```

---

### 3. Get User by ID (Admin/Teacher Only)
**Endpoint:** `GET /api/v1/users/:id`

**Authentication:** JWT Token Required + Admin or Teacher Role

**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

**URL Parameters:**
- `id` (required): User ID

**Example:**
```
GET /api/v1/users/676f8e1234567890abcdef12
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "676f8e1234567890abcdef12",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "phone": "+1234567890",
    "bio": "Computer Science Student",
    "emailVerified": true,
    "createdAt": "2025-09-09T15:30:00.000Z",
    "updatedAt": "2025-09-09T15:30:00.000Z"
  },
  "timestamp": "2025-09-09T15:45:00.000Z",
  "path": "/api/v1/users/676f8e1234567890abcdef12"
}
```

---

### 4. Get User by Email (Admin/Teacher Only)
**Endpoint:** `GET /api/v1/users/email/:email`

**Authentication:** JWT Token Required + Admin or Teacher Role

**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

**URL Parameters:**
- `email` (required): User email address

**Example:**
```
GET /api/v1/users/email/user@example.com
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "676f8e1234567890abcdef12",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "phone": "+1234567890",
    "bio": "Computer Science Student",
    "emailVerified": true,
    "createdAt": "2025-09-09T15:30:00.000Z",
    "updatedAt": "2025-09-09T15:30:00.000Z"
  },
  "timestamp": "2025-09-09T15:45:00.000Z",
  "path": "/api/v1/users/email/user@example.com"
}
```

---

### 5. Update User
**Endpoint:** `PUT /api/v1/users/:id`

**Authentication:** JWT Token Required (Users can update own profile, Admins can update any)

**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

**URL Parameters:**
- `id` (required): User ID

**Request Body:**
```json
{
  "firstName": "Updated First Name",
  "lastName": "Updated Last Name",
  "phone": "+1555123456",
  "bio": "Updated bio text"
}
```

**Note:** Email and role cannot be updated through this endpoint.

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "id": "676f8e1234567890abcdef12",
    "email": "user@example.com",
    "firstName": "Updated First Name",
    "lastName": "Updated Last Name",
    "role": "student",
    "phone": "+1555123456",
    "bio": "Updated bio text",
    "emailVerified": true,
    "createdAt": "2025-09-09T15:30:00.000Z",
    "updatedAt": "2025-09-09T16:00:00.000Z"
  },
  "timestamp": "2025-09-09T16:00:00.000Z",
  "path": "/api/v1/users/676f8e1234567890abcdef12"
}
```

---

### 6. Change Password
**Endpoint:** `PUT /api/v1/users/:id/password`

**Authentication:** JWT Token Required (Users can change own password, Admins can change any)

**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

**URL Parameters:**
- `id` (required): User ID

**Request Body:**
```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewSecurePassword456!",
  "confirmNewPassword": "NewSecurePassword456!"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "Password changed successfully",
  "timestamp": "2025-09-09T16:05:00.000Z",
  "path": "/api/v1/users/676f8e1234567890abcdef12/password"
}
```

---

### 7. Delete User (Admin Only)
**Endpoint:** `DELETE /api/v1/users/:id`

**Authentication:** JWT Token Required + Admin Role

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
Content-Type: application/json
```

**URL Parameters:**
- `id` (required): User ID

**Example:**
```
DELETE /api/v1/users/676f8e1234567890abcdef12
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "message": "User deleted successfully",
  "timestamp": "2025-09-09T16:10:00.000Z",
  "path": "/api/v1/users/676f8e1234567890abcdef12"
}
```

---

### 8. Create User (Public)
**Endpoint:** `POST /api/v1/users`

**Authentication:** None (Public endpoint)

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "firstName": "New",
  "lastName": "User",
  "role": "student",
  "phone": "+1234567890",
  "bio": "Optional bio text"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "id": "676f8e1234567890abcdef14",
    "email": "newuser@example.com",
    "firstName": "New",
    "lastName": "User",
    "role": "student",
    "phone": "+1234567890",
    "bio": "Optional bio text",
    "emailVerified": false,
    "createdAt": "2025-09-09T16:15:00.000Z",
    "updatedAt": "2025-09-09T16:15:00.000Z"
  },
  "timestamp": "2025-09-09T16:15:00.000Z",
  "path": "/api/v1/users"
}
```

---

## 🏥 Health Check Endpoints

### 1. Basic Health Check
**Endpoint:** `GET /api/v1/health`

**Authentication:** None

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-09-09T16:20:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

---

### 2. Database Health Check
**Endpoint:** `GET /api/v1/health/database`

**Authentication:** None

**Success Response (200):**
```json
{
  "status": "ok",
  "database": {
    "status": "connected",
    "name": "Education-platform",
    "collections": 5
  },
  "timestamp": "2025-09-09T16:20:00.000Z"
}
```

---

## 🔐 Authentication Guide

### JWT Token Usage

1. **Get Token:** Login via `/api/v1/auth/login`
2. **Use Token:** Include in `Authorization` header as `Bearer YOUR_TOKEN`
3. **Token Expiry:** 15 minutes (can be refreshed)
4. **Refresh Token:** Use `/api/v1/auth/refresh` endpoint

### Authentication Flow

```
1. Register → 2. Verify Email → 3. Login → 4. Use Protected Endpoints
    POST          GET             POST       GET/PUT/DELETE
   /auth/register /auth/verify    /auth/login /users/...
```

### Role-Based Access Control

| Endpoint | Public | Student | Teacher | Admin |
|----------|--------|---------|---------|-------|
| `POST /auth/register` | ✅ | ✅ | ✅ | ✅ |
| `GET /auth/verify-email` | ✅ | ✅ | ✅ | ✅ |
| `POST /auth/login` | ✅ | ✅ | ✅ | ✅ |
| `POST /auth/refresh` | ✅ | ✅ | ✅ | ✅ |
| `GET /users/profile` | ❌ | ✅ | ✅ | ✅ |
| `GET /users` | ❌ | ❌ | ❌ | ✅ |
| `GET /users/:id` | ❌ | ❌ | ✅ | ✅ |
| `GET /users/email/:email` | ❌ | ❌ | ✅ | ✅ |
| `PUT /users/:id` | ❌ | ✅* | ✅* | ✅ |
| `PUT /users/:id/password` | ❌ | ✅* | ✅* | ✅ |
| `DELETE /users/:id` | ❌ | ❌ | ❌ | ✅ |
| `POST /users` | ✅ | ✅ | ✅ | ✅ |

*\* Users can only modify their own profile/password*

---

## ❌ Error Responses

### Standard Error Format
```json
{
  "statusCode": 400,
  "timestamp": "2025-09-09T16:25:00.000Z",
  "path": "/api/v1/endpoint",
  "method": "POST",
  "error": "BadRequestException",
  "message": "Detailed error message",
  "details": ["Additional error details if applicable"]
}
```

### Common HTTP Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (duplicate data)
- **500** - Internal Server Error

### Authentication Errors

**401 Unauthorized - Missing Token:**
```json
{
  "statusCode": 401,
  "error": "UnauthorizedException",
  "message": "Access token is required"
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "statusCode": 401,
  "error": "UnauthorizedException",
  "message": "Invalid or expired token"
}
```

**403 Forbidden - Insufficient Permissions:**
```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

---

## 📊 Response Format

### Success Response Structure
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {
    // Response data here
  },
  "timestamp": "2025-09-09T16:30:00.000Z",
  "path": "/api/v1/endpoint"
}
```

### Pagination (Future Enhancement)
For endpoints that may return large datasets:
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "timestamp": "2025-09-09T16:30:00.000Z",
  "path": "/api/v1/endpoint"
}
```

---

## 🚀 Quick Start for Mobile Developers

### 1. Environment Setup
```javascript
const BASE_URL = 'http://localhost:3000/api/v1';

// For production
const PROD_BASE_URL = 'https://yourdomain.com/api/v1';
```

### 2. Authentication Helper (JavaScript/TypeScript)
```javascript
class AuthService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (data.data.access_token) {
      this.token = data.data.access_token;
      localStorage.setItem('access_token', this.token);
    }
    return data;
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  async apiCall(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });
    return response.json();
  }
}
```

### 3. Usage Examples
```javascript
const auth = new AuthService('http://localhost:3000/api/v1');

// Login
await auth.login('user@example.com', 'password123');

// Get current user profile
const profile = await auth.apiCall('/users/profile');

// Get all users (admin only)
const users = await auth.apiCall('/users');

// Update user profile
const updatedUser = await auth.apiCall('/users/USER_ID', {
  method: 'PUT',
  body: JSON.stringify({
    firstName: 'Updated Name',
    bio: 'Updated bio'
  })
});
```

---

## 📱 Platform-Specific Notes

### iOS (Swift)
- Use `URLSession` for HTTP requests
- Store JWT tokens in Keychain for security
- Handle token expiration and refresh automatically

### Android (Java/Kotlin)
- Use `Retrofit` or `OkHttp` for HTTP requests
- Store JWT tokens in `SharedPreferences` (encrypted) or Android Keystore
- Implement token refresh interceptor

### React Native
- Use `AsyncStorage` for token storage
- Consider using libraries like `@react-native-async-storage/async-storage`
- Implement automatic token refresh

### Flutter (Dart)
- Use `http` package or `dio` for requests
- Store tokens using `shared_preferences` or `flutter_secure_storage`
- Implement token refresh logic

---

**Last Updated:** September 9, 2025  
**API Version:** 1.0  
**Documentation Version:** 1.0

For questions or issues, please contact the backend development team.
