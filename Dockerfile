FROM mcr.microsoft.com/playwright:v1.49.1-noble

ARG ENV_NAME
ARG ENV_CATEGORY
ARG SUIT
ARG PRINT_API_RESPONSE
ARG PRINT_API_REQUEST

ENV ENV_NAME=$ENV_NAME
ENV ENV_CATEGORY=$ENV_CATEGORY
ENV SUIT=$SUIT
ENV PRINT_API_RESPONSE=$PRINT_API_RESPONSE 
ENV PRINT_API_REQUEST=$PRINT_API_REQUEST 


WORKDIR /tests

USER root


COPY package*.json ./

RUN npm install  && npx playwright install
RUN npm list --depth=0

COPY . .
RUN npm list @playwright/test --depth=0
RUN sudo chown -R 995:991 "/.npm"


