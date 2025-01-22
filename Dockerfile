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

# Set working directory
WORKDIR /tests

# Install necessary libraries
# RUN apt-get update && apt-get install -y \
#     libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 libxrandr2 libgbm1 \
#     && apt-get clean && rm -rf /var/lib/apt/lists/*

# Switch to root to fix permission issues
USER root
RUN mkdir -p /.npm && chown -R 995:991 /.npm

# Copy package.json and package-lock.json
COPY package.json ./

# Install project dependencies and Playwright browsers
RUN npm install && npx playwright install

# Copy the rest of the code
COPY . .

# Switch back to the pwuser user
USER pwuser