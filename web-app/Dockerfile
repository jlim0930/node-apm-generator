# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the web app port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
