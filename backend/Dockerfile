FROM node:22-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm ci

EXPOSE 3333

CMD [ "node", "--env-file=.env.development", "src/server.js" ]