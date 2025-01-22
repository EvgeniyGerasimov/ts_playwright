FROM mcr.microsoft.com/playwright:v1.49.1-noble

# Устанавливаем рабочую директорию
WORKDIR /tests

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости для production
RUN npm install --production && npx playwright install

# Копируем весь проект в контейнер
COPY . .

# Проверяем, что зависимости установлены
RUN npm list @playwright/test --depth=0

# По умолчанию используем пользователя pwuser
USER pwuser