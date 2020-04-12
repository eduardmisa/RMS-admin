FROM node:10.7

ENV HOST 0.0.0.0

RUN  mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

RUN npm run build

EXPOSE 3002

CMD ["npm", "start"]