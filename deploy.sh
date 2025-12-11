#!/bin/bash

# Stop and remove existing container
echo "Stopping and removing old container (if any)..."
docker stop react-app || true
docker rm react-app || true

# Remove old image
echo "Removing old image..."
docker rmi react-app || true

# Build new image
echo "Building new Docker image..."
docker build -t react-app .

# Run the new container
echo "Starting container on port 3000..."
docker run -d -p 3000:80 --name react-app react-app

echo "Deployment complete. Your React app is now running at http://localhost:3000"
