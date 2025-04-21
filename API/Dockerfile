# Use an official Node.js runtime as the base image
FROM node:23-slim

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before app code for layer caching
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose the port your app runs on (adjust if different)
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]