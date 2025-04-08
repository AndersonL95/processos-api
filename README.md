# processos-api
# Requisitos:
# Docker, nodejs, typescipt

# Ao baixar o projeto instale os pacotes, usando o npm install
# docker build -t <nome do container> - rodar local
# Se necessitar rodar migration: npx ts-node -O '{ "module": "CommonJS" }' node_modules/typeorm/cli.js migration:revert -d src/typeormConfig.ts
# docker run -p 3000:3000 --env-file .env processos_app