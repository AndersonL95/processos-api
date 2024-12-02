FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY tsconfig.json ./


COPY . .

EXPOSE 3000

CMD ["npm", "start"]