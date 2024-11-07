FROM node

WORKDIR /app

COPY package.*json .

RUN npm install

COPY . .

ENV PORT=3004

EXPOSE $PORT

CMD [ "node", "app.js" ]


