# Base Image
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copying the source code
COPY . .

# Commands to run while creating image
RUN npm install
RUN npm run build

# Expose ports
EXPOSE 3000

# Commands to run while running the image
CMD ["npm", "run", "start"]