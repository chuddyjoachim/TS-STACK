import "reflect-metadata";
import "dotenv/config";

import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import http from "http";

import { buildSchema } from "type-graphql";
import { userResolver } from "./resolvers/userResolver";
import app from "./app";

const App_Port = process.env.App_Port;

const http_ = new http.Server(app);

let retries = 5;

(async () => {
  //db conn retry logic
  while (retries) {
    try {
      const connection = await createConnection();
      connection
        .synchronize()
        .then(async (_) => {
          http_.listen(App_Port, () => {
            console.log("listening on port " + App_Port);
          });
          await serverFunc();
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    } catch (err) {
      console.log(err);
      retries -= 1;
      console.log(retries + " " + "retries left");

      // wait for 5 seconds
      await new Promise((res) => {
        setTimeout(res, 5000);
      });
    }
  }

  // other logic \\
  const serverFunc = async () => {
    // apolloserver graphql
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [userResolver],
      }),
      context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app });
  };
})();
