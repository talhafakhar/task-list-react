# Use the latest Node.js version 20 base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the project files into the container
COPY . /app

# Install pm2 globally
RUN npm install -g pm2 serve

# Install project dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose port 80 for external access
EXPOSE 80

# Start the application using pm2 to serve the built application
CMD ["pm2-runtime", "start", "npm", "--", "run", "serve"]
