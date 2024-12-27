# Base image
FROM node:20-alpine

# Working directory
WORKDIR /app

# Deps cache


# Copy the source code
COPY . .

# Build
RUN npm install
RUN npm run build

# Port 
EXPOSE 3000

# Start server
CMD ["node", "dist/index.js"]