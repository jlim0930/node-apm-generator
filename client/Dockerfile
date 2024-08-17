# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /usr/src/client

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the client script
COPY . .

# Start the client script
CMD ["node", "client.js"]
