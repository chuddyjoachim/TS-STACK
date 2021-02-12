FROM node:alpine

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . .

ENV App_Port=8080 JWT_SECRET=',VR+6eA)A!%7wL<sd;wU"Cs4J*#{p@q/Kv6_yCv/QE?699Tf)' REFRESH_TOKEN="d8784u409huuq./"

EXPOSE 8080

CMD ["npm", "start"]