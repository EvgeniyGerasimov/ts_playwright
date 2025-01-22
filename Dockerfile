# Dockerfile
FROM mcr.microsoft.com/playwright:v1.49.1-noble

# Declare build-time arguments
ARG ENV_NAME
ARG ENV_CATEGORY
ARG SUIT

# Set environment variables using the build-time arguments
ENV ENV_NAME=$ENV_NAME
ENV CATEGORY=$ENV_CATEGORY
ENV SUIT=$SUIT
ENV NODE_ENV=development


# Set working directory
WORKDIR /tests

# Switch to root to fix permission issues
USER root
RUN mkdir -p /.npm && chown -R 995:991 /.npm

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies and Playwright browsers
RUN npm install && npx playwright install

# Copy the rest of the code
COPY . .

# Switch back to the pwuser user
USER pwuser