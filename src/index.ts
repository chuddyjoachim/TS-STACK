import "reflect-metadata";
import dotenv from "dotenv";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import { createConnection } from "typeorm";

import userRoutes from "./routes/user.routes";

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
        .then(async (_) => {
          app.listen(App_Port, () => {
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
    app.use("/users", userRoutes);
  };
})();
