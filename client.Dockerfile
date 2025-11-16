# Stage 1: Build the application
FROM oven/bun:1.3.0-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package.json bun.lockb ./

COPY packages/client/package.json ./packages/client/
COPY packages/bot/package.json ./packages/bot/
COPY packages/db/package.json ./packages/db/
COPY packages/emojis/package.json ./packages/emojis/
COPY packages/server/package.json ./packages/server/

# Install dependencies with Yarn
RUN bun install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application (adjust to your actual build script name if needed)
RUN bun run build:client

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built static files from the build stage
COPY --from=build /app/packages/client/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
