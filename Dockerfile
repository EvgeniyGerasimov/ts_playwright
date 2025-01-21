# Use the Playwright Docker image as base
FROM mcr.microsoft.com/playwright:v1.49.1

# Declare build-time arguments
ARG ENV_NAME
ARG ENV_CATEGORY
ARG BASE_URL
ARG AUTH_HOST
ARG HEADLESS_MODE

# Set environment variables using the build-time arguments
ENV ENV_NAME=$ENV_NAME
ENV ENV_CATEGORY=$ENV_CATEGORY
ENV BASE_URL=$BASE_URL
ENV AUTH_HOST=$AUTH_HOST
ENV HEADLESS_MODE=$HEADLESS_MODE

# Set working directory
WORKDIR /app

# Create a directory for npm cache and set the appropriate permissions
RUN mkdir -p /home/node/.npm && chown -R node:node /home/node/.npm

# Set npm cache directory
ENV NPM_CONFIG_CACHE=/home/node/.npm

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

