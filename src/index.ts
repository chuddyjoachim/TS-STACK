import "reflect-metadata";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import { createConnection, getRepository } from "typeorm";

import userRoutes from "./routes/user.routes";
import { User } from "./entity/User";

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const getUsers = async () => {
  const users = await getRepository(User)
    .find()
    .catch((err) => {
      console.log(err);
    });
  return users;
};

(async () => {
  const connection = await createConnection();
  connection
    .synchronize()
    .then(async (_) => {
      app.listen(3232, () => {
        console.log("listening on port 3232");
      });
      app.get("/sue", async (req, res) => {
        const result = await getUsers().catch((err) => {
          console.log(err);
        });
        res.json(result);
      });
      app.use(userRoutes);
    })
    .catch((err) => {
      console.log(err);
    });
})();
