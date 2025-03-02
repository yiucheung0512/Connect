#!/bin/bash

# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Build the frontend for production
npm run build

# Navigate to the backend directory
cd ../backend

# Install backend dependencies
npm install

# Start the backend server
npm start
