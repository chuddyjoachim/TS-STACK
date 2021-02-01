import "reflect-metadata";
import * as dotenv from "dotenv";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";

import userRoutes from "./routes/user.routes";
import { buildSchema } from "type-graphql";
import { userResolver } from "./resolvers/userResolver";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, refreshToken } from "./middleware/auth";

dotenv.config();
const App_Port = process.env.App_Port;
const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

let retries = 5;

(async () => {
  //db conn retry logic
  while (retries) {
    try {
      const connection = await createConnection();
      connection
        .synchronize()
        .then(async _ => {
          app.listen(App_Port, () => {
            console.log("listening on port " + App_Port);
          });
          await serverFunc();
        })
        .catch(err => {
          console.log(err);
        });
      break;
    } catch (err) {
      console.log(err);
      retries -= 1;
      console.log(retries + " " + "retries left");

      // wait for 5 seconds
      await new Promise(res => {
        setTimeout(res, 5000);
      });
    }
  }

  // other logic \\
  const serverFunc = async () => {
    app.use(cookieParser());
    app.use("/users", userRoutes);

    app.post("/refresh_token", async (req, res) => {
      const token = req.cookies.rfx;
      if (!token) {
        return res.send({ ok: false, accessToken: "" });
      }

      let payload: any = null;
      try {
        payload = verify(token, process.env.REFRESH_TOKEN!);
      } catch (err) {
        console.log(err);
        return res.send({ ok: false, accessToken: "" });
      }

      const user = await User.findOne({ id: payload.userId });
      if (!user) {
        return res.send({ ok: false, accessToken: "" });
      }

      if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ ok: false, accessToken: "" });
      }

      res.cookie("rfx", refreshToken(user), {
        httpOnly: true
      });
      return res.send({ ok: true, accessToken: createAccessToken(user) });
    });

    // apolloserver graphql
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [userResolver]
      }),
      context: ({ req, res }) => ({ req, res })
    });

    apolloServer.applyMiddleware({ app });
  };
})();
