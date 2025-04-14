FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY tsconfig.json ./


COPY . .
RUN npm install -g ts-node-dev

EXPOSE 3000

CMD ["ts-node-dev", "--respawn","--transpile-only","src/server.ts"]