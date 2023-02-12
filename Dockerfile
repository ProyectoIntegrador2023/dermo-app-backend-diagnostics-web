# Building layer
# FROM --platform=linux/amd64 node:14-alpine as development
FROM node:14-alpine as development

WORKDIR /app

# Copy configuration files
COPY package*.json ./

# Install dependencies from package-lock.json, see https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN npm ci

# Copy application sources (.ts, .tsx, js)
COPY . .

# Build application (produces dist/ folder)
RUN npm run build

# Expose application port
EXPOSE 3000

# Start application
CMD [ "node", "dist/main.js" ]

# docker build -t "dermo-app-backend-auth-web:0.0.1" .
# docker run --rm -p 3000:3000 dermo-app-backend-auth-web:0.0.1
