FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /tests

COPY package*.json ./

RUN npm install && npx playwright install


RUN npm list --depth=0


COPY . .


RUN npm list @playwright/test --depth=0


USER pwuser