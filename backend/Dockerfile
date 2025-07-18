# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the code
COPY . .

# Expose port (Railway sets PORT env var)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"] 