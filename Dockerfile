FROM mcr.microsoft.com/playwright:v1.49.1-noble
WORKDIR /
COPY package*.json ./
RUN npm install
RUN npx playwright install
COPY . .










