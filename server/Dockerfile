FROM node:14-alpine

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

ENV App_Port=8080 JWT_SECRET=VR+6eAA!%7wL<sd;wUCs4J*#p@q/Kv6_yCv/QE?699Tf REFRESH_TOKEN=d8784u409huuq./

EXPOSE 3232

CMD ["yarn", "start"]