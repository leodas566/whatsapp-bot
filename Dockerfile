FROM node:18-slim
RUN apt-get update && apt-get install -y chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "bot.js"]