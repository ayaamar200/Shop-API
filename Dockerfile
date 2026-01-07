FROM node:20-alpine

# Required for sharp
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy only package files first (better cache)
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy app source
COPY . .

ENV NODE_ENV=production

EXPOSE 4000

# Run directly (no cross-env)
CMD ["node", "server.js"]
