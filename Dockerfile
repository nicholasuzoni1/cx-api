# Stage 1: Build the application
FROM node:20.9.0 AS build

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files and build the app
COPY . .

# Build
RUN pnpm run build cx-api

# Stage 2: Create production image
FROM node:20.9.0 AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy only the production files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Install production dependencies
RUN npm install --production && npm cache clean --force

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]