FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /tests

COPY package*.json ./

# Настраиваем кеш npm
RUN npm config set cache /tests/.npm-cache --global

# Устанавливаем зависимости
RUN npm install @playwright/test
RUN npx playwright install
COPY . .

# Проверяем версию @playwright/test
RUN npm list @playwright/test --depth=0

# Переключаемся на root для изменения прав доступа
USER root
RUN chown -R 995:991 /tests/.npm-cache





