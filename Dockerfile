# AMD/Dockerfile

FROM node:20-slim

# Install system utilities including curl for container health checks
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# 1. Install and compile backend dependencies
COPY package*.json ./
RUN npm ci --only=production

# 2. Copy the frontend folder and compile React inside the container
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

# 3. Copy the backend source directories
COPY src/ ./src/

EXPOSE 3000

# Container health check safeguard
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]