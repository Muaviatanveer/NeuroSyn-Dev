# AMD/Dockerfile

FROM node:20-slim

# Install system dependencies including curl for health checks
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install clean production dependencies
RUN npm ci --only=production

# Copy application source code
COPY src/ ./src/

# Expose server entry port
EXPOSE 3000

# Safety health check inside container
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]