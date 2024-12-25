# Base Image
FROM node:20-alpine

# Working directory
WORKDIR /app

# Cache the deps
COPY package* .
RUN npm install

# Copying the source code
COPY . .

# Commands to run while creating image
RUN npm run build

# Expose ports
EXPOSE 3000

# Commands to run while running the image
CMD ["npm", "run", "start"]