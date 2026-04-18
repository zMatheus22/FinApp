FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 3333

CMD [ "node", "start" ]