FROM node

WORKDIR /server

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV PORT=3001

EXPOSE 3001

CMD [ "node", "index.js" ]