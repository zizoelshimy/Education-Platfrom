# Education Platform

A comprehensive education platform built with NestJS, MongoDB, and TypeScript following Clean Architecture principles.

## 🚀 Features

### Core Features

- 👥 **User Management**: Students, Teachers, and Admins with role-based access
- 📚 **Course Management**: Create, manage, and publish courses
- 📝 **Assignments & Quizzes**: Interactive assessments with automated grading
- 💬 **Communication**: Real-time chat and discussion forums
- 📊 **Progress Tracking**: Detailed analytics and reports
- 🎓 **Certificates**: Automated certificate generation

### Technical Features

- 🏗️ **Clean Architecture**: Domain-driven design with clear separation of concerns
- 🔒 **Security**: JWT authentication, role-based authorization, rate limiting
- 📚 **API Documentation**: Swagger/OpenAPI documentation
- 🧪 **Testing**: Unit, integration, and E2E tests
- 🐳 **Containerization**: Docker support for easy deployment
- 📈 **Monitoring**: Comprehensive logging and error tracking

## 🛠️ Tech Stack

### Backend

- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest, Cypress

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **File Storage**: AWS S3 or local storage
- **Email**: Nodemailer/SendGrid
- **Real-time**: Socket.io

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn
- Docker (optional)

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Run the application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`
API Documentation: `http://localhost:3000/docs`
