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

# Switch to root user to ensure correct permissions for npm
USER root

# Create directory for npm cache
RUN mkdir -p /home/seluser/.npm

# Set npm cache directory
ENV NPM_CONFIG_CACHE=/home/seluser/.npm

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

