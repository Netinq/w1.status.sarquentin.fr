FROM node:alpine
WORKDIR /usr/share/node/app
COPY . /usr/share/node/app
RUN npm install
EXPOSE 3000
CMD [ "node", "server.js" ]
