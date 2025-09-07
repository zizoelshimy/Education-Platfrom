#!/bin/bash

echo " Setting up Education Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo " Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo " Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo " Node.js version: $(node -v)"

# Install dependencies
echo " Installing dependencies..."
npm install

# Copy environment file
if [ ! -f ".env" ]; then
    echo " Creating environment file..."
    cp .env.example .env
    echo " Please edit .env file with your configuration"
else
    echo "  .env file already exists"
fi

# Create uploads directory
mkdir -p uploads

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB: docker run -d -p 27017:27017 --name mongodb mongo:latest"
echo "3. Run the application: npm run start:dev"
echo "4. Visit API docs: http://localhost:3000/docs"
echo ""
echo "Happy coding! "
