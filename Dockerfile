FROM mcr.microsoft.com/playwright:v1.49.1-noble

ARG ENV_NAME
ARG ENV_CATEGORY
ARG SUIT

ENV ENV_NAME=$ENV_NAME
ENV ENV_CATEGORY=$ENV_CATEGORY
ENV SUIT=$SUIT


WORKDIR /tests

USER root
RUN mkdir -p /workspace && chown -R 995:991 /workspace
RUN mkdir -p /.npm && chown -R 995:991 /.npm

COPY package*.json ./

RUN npm install && npx playwright install
RUN npm list --depth=0

COPY . .
RUN npm list @playwright/test --depth=0

# Switch back to the pwuser user
USER pwuser