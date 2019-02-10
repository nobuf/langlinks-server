FROM node:8.1-alpine

RUN mkdir /app
WORKDIR /app

RUN npm install -g nodemon

COPY package.json /app/
COPY package-lock.json /app/
RUN npm install

CMD ["npm", "start"]
