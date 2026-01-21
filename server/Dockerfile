# Use the official Node.js image with version 20
FROM node:20

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json (if present) into the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose port 5000 for the server to listen on
EXPOSE 5000

# Run the application using the start script defined in package.json
CMD ["npm", "dev"]