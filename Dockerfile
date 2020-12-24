FROM node:14-buster

RUN mkdir -p /tmp/nodejs
WORKDIR /tmp/nodejs

COPY package.json .

RUN npm install express && npm install socket.io

COPY src .

CMD node index.js