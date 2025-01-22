FROM mcr.microsoft.com/playwright:v1.49.1-jammy

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

# Switch to root to fix permission issues
USER root

# Fix permissions for the .npm directory
RUN mkdir -p /.npm && chown -R 995:991 /.npm

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install --verbose

RUN npx playwright install
RUN npm install @playwright/test --save-dev

# Copy the rest of the code
COPY . .

# Switch back to the pwuser user
USER pwuser


