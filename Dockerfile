FROM node:20.12.2-bookworm

WORKDIR /app

RUN apt update -y && apt upgrade -y

COPY package.json .

RUN npm i

COPY src .
COPY tsconfig.json .

RUN npm run build

CMD ["npm", "start"]