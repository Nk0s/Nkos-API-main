FROM node:latest

RUN apt-get update && apt-get install

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install -g node-gyp
RUN npm rebuild bcrypt --build-from-source
RUN npm install
CMD [ "npm run start" ]