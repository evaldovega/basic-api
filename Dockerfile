FROM node:latest

LABEL maintainer="Evaldo Vega <evega@condorlabs.io>"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ["package.json","package-lock.json","./"]

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","run","dev"]