FROM mcr.microsoft.com/playwright:v1.49.1-noble

# Declare build-time arguments
ARG ENV_NAME
ARG ENV_CATEGORY
ARG SUIT

# Set environment variables using the build-time arguments
ENV ENV_NAME=$ENV_NAME
ENV ENV_CATEGORY=$ENV_CATEGORY
ENV SUIT=$SUIT

# Set working directory
WORKDIR /tests

# Switch to root to fix permission issues
USER root
RUN mkdir -p /workspace && chmod -R 777 /workspace
RUN mkdir -p /.npm && chmod -R 777 /.npm

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies and Playwright browsers
RUN npm install --force && npx playwright install

# Verify Playwright installation and dependencies
RUN npm list @playwright/test --depth=0

# Add a test file to verify volume mount
RUN echo "Docker volume test" > /workspace/docker_volume_test.txt

# Copy the rest of the code
COPY . .

# Switch back to the pwuser user
USER pwuser