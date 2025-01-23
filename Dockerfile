FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /tests

COPY package*.json ./

RUN npm install @playwright/test
RUN npx playwright install
COPY . .

RUN npm list @playwright/test --depth=0

USER pwuser



