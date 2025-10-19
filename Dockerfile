FROM node:20-alpine

# Install npm
RUN corepack enable && corepack prepare npm@latest --activate

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Build TypeScript
RUN npm run build

# Expose port (if needed for API)
EXPOSE 3000

# Default command (can be overridden in docker-compose)
CMD ["npm", "start"]

