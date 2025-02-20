FROM node:8.17-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/
RUN npm install -g --unsafe-perm nodemon@1.19 \
    && npm install

CMD ["npm", "start"]
