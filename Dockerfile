FROM node:11.8.0

RUN mkdir /bot
RUN npm i -g yarn

WORKDIR /bot