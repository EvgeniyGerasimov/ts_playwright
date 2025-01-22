FROM mcr.microsoft.com/playwright:v1.49.1-noble

# Declare build-time arguments
ARG ENV_NAME
ARG ENV_CATEGORY
ARG SUIT

# Set environment variables
ENV ENV_NAME=$ENV_NAME
ENV ENV_CATEGORY=$ENV_CATEGORY
ENV SUIT=$SUIT
ENV NODE_ENV=development

# Set working directory
WORKDIR /tests

# Fix permissions
USER root
RUN mkdir -p /.npm && chown -R 995:991 /.npm

# Copy dependency files
COPY package*.json ./

# Install dependencies and Playwright browsers
RUN npm cache clean --force && npm install --force && npx playwright install && npm list --depth=0

# Copy the rest of the code
COPY . .

# Switch back to the default user
USER pwuser