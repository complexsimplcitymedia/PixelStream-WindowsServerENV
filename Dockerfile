FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose ports for the application and WebRTC
EXPOSE 3000
EXPOSE 49152-65535

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "src/server.js"]