#from node:9
#from node:16-alpine
from node:14-alpine3.14

WORKDIR /app

COPY package*.json ./

RUN npm install

copy . /app

CMD ["node", "index.mjs"]