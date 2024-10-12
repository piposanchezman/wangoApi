FROM node:18-alpine

# Create a directory for the application
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the build command
RUN npm run build

RUN chmod +x start.sh

# Start redis server and the application
CMD ["./start.sh"]
