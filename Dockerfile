FROM node:latest

RUN mkdir /app
WORKDIR /app
COPY package.json /app/

RUN npm install

RUN npm install mongoose
RUN npm install sha1
RUN npm install --save multer


CMD [ "npm", "start" ]
