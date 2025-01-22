FROM mcr.microsoft.com/playwright:v1.49.1-noble

# Set environment variables
ARG ENV_NAME
ARG ENV_CATEGORY
ARG SUIT
ENV ENV_NAME=$ENV_NAME
ENV CATEGORY=$ENV_CATEGORY
ENV SUIT=$SUIT

# Set working directory
WORKDIR /tests

# Fix permissions
USER root
RUN mkdir -p /.npm && chown -R 995:991 /.npm

# Copy dependency files
COPY package*.json ./

# Clean npm cache and install dependencies
RUN npm install  && npx playwright install

# Copy the rest of the code
COPY . .

# Switch back to non-root user
USER pwuser