FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose React dev server port
EXPOSE 3000

# Start development server
CMD ["npm", "start"]