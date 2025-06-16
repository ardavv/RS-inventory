# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

# Copy dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
# Copy application code from the builder stage
COPY --from=builder /app .

# Expose the port the app runs on
EXPOSE 3003

# Command to run the application
CMD [ "node", "server.js" ]