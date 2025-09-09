# User CRUD Operations - Clean Architecture Implementation

## 🎯 Overview

This implementation follows Clean Architecture principles with comprehensive validation, error handling, security, and testing. The User CRUD operations now include all architectural best practices.

## 🏗️ Architecture Components Implemented

### 1. **Presentation Layer**

#### Controllers

- **UserController**: RESTful API endpoints with proper HTTP status codes
- **Decorators**: `@Public()`, `@Roles()`, `@CurrentUser()`
- **Guards**: JWT Authentication, Role-based Authorization
- **Pipes**: Custom validation and ObjectId parsing
- **Interceptors**: Response transformation
- **Filters**: Global exception handling

#### Features:

- ✅ Input validation with detailed error messages
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Swagger/OpenAPI documentation
- ✅ Proper HTTP status codes and responses

### 2. **Application Layer**

#### Use Cases

- **CreateUserUseCase**: Create new users with validation
- **GetUserByIdUseCase**: Retrieve user by ID
- **GetAllUsersUseCase**: List all users (admin only)
- **UpdateUserUseCase**: Update user information
- **DeleteUserUseCase**: Remove users (admin only)
- **ChangePasswordUseCase**: Change user passwords
- **GetUsersByRoleUseCase**: Filter users by role

#### DTOs (Data Transfer Objects)

- **CreateUserDto**: User creation with comprehensive validation
- **UpdateUserDto**: User updates with optional fields
- **ChangePasswordDto**: Password change with current password verification
- **UserResponseDto**: Clean response format

#### Features:

- ✅ Business logic validation
- ✅ Domain exception handling
- ✅ Password security requirements
- ✅ Input sanitization and transformation

### 3. **Domain Layer**

#### Entities

- **User**: Core domain entity with business rules
- **Value Objects**: UserRole, UserStatus enums

#### Repositories

- **IUserRepository**: Repository interface
- **Custom Exceptions**: Domain-specific error types

#### Features:

- ✅ Domain-driven design patterns
- ✅ Business rule enforcement
- ✅ Type-safe value objects

### 4. **Infrastructure Layer**

#### Database

- **MongoDB Integration**: Mongoose schemas with indexes
- **Repository Implementation**: Concrete repository with error handling

#### Features:

- ✅ Database abstraction
- ✅ Optimized queries with indexes
- ✅ Connection management

### 5. **Shared Layer**

#### Components

- **Custom Exceptions**: Specific error types for different scenarios
- **Validation Pipes**: Input validation and transformation
- **Constants**: Injection tokens and shared values

## 🔒 Security Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin, Teacher, Student)
- Password hashing with bcrypt (salt rounds: 12)
- Current user context in requests

### Input Validation

- Email format validation
- Strong password requirements
- Phone number validation
- Input sanitization and trimming
- ObjectId format validation

### Security Headers & Policies

- CORS configuration
- Rate limiting with Throttler
- Input length restrictions
- XSS protection through validation

## 📊 API Endpoints

| Method | Endpoint              | Access        | Description              |
| ------ | --------------------- | ------------- | ------------------------ |
| POST   | `/users`              | Public        | Create new user          |
| GET    | `/users`              | Admin         | Get all users            |
| GET    | `/users/profile`      | Authenticated | Get current user profile |
| GET    | `/users/:id`          | Admin/Teacher | Get user by ID           |
| PUT    | `/users/:id`          | Owner/Admin   | Update user              |
| PUT    | `/users/:id/password` | Owner/Admin   | Change password          |
| DELETE | `/users/:id`          | Admin         | Delete user              |

## ✅ Validation Rules

### User Creation

- **Email**: Valid email format, lowercase, trimmed
- **Password**: 8+ chars, uppercase, lowercase, number, special char
- **Names**: 2-50 chars, letters and spaces only
- **Phone**: Valid international format
- **Bio**: Max 500 characters

### User Updates

- All fields optional
- Same validation rules as creation
- Cannot change email or role through update endpoint

### Password Change

- Current password verification
- New password must be different
- Same strength requirements

## 🧪 Testing Strategy

### Unit Tests

- Use case testing with mocked dependencies
- Domain entity validation
- Repository interface contracts

### Integration Tests

- Controller endpoint testing
- Database operations
- Authentication flows

### Example Test Structure

```typescript
describe('CreateUserUseCase', () => {
  it('should create user successfully', async () => {
    // Arrange, Act, Assert
  });

  it('should throw exception if user exists', async () => {
    // Test error scenarios
  });
});
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install class-validator class-transformer @nestjs/jwt
```

### 2. Environment Variables

```env
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=15m
MONGODB_URI=mongodb://localhost:27017/education-platform
```

### 3. Run Tests

```bash
npm run test
npm run test:e2e
```

### 4. Start Application

```bash
npm run start:dev
```

## 📚 Usage Examples

### Create User

```typescript
POST /users
{
  "email": "student@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "phone": "+1234567890",
  "bio": "Computer Science student"
}
```

### Update User

```typescript
PUT /users/:id
Authorization: Bearer <jwt-token>
{
  "firstName": "Jane",
  "bio": "Updated bio"
}
```

### Change Password

```typescript
PUT /users/:id/password
Authorization: Bearer <jwt-token>
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

## 🔧 Error Handling

### Custom Exceptions

- `UserNotFoundException`: User not found
- `UserAlreadyExistsException`: Email already exists
- `InvalidPasswordException`: Wrong password
- `ValidationException`: Input validation errors
- `UnauthorizedException`: Access denied

### Global Error Format

```json
{
  "statusCode": 400,
  "timestamp": "2023-01-01T00:00:00.000Z",
  "path": "/users",
  "method": "POST",
  "error": "Validation Error",
  "message": "Email is required"
}
```

## 🎯 Next Steps

1. **Add Integration Tests**: E2E testing for all endpoints
2. **Add Logging**: Structured logging with correlation IDs
3. **Add Caching**: Redis caching for frequently accessed data
4. **Add Event Sourcing**: Domain events for user actions
5. **Add API Versioning**: Support for multiple API versions

## 📖 Architecture Benefits

✅ **Testability**: Each layer can be tested independently  
✅ **Maintainability**: Clear separation of concerns  
✅ **Scalability**: Easy to add new features and modify existing ones  
✅ **Security**: Multiple layers of validation and authorization  
✅ **Documentation**: Self-documenting with Swagger/OpenAPI  
✅ **Type Safety**: Full TypeScript support with validation

This implementation provides a robust, secure, and maintainable foundation for user management in the education platform.
