import "dotenv/config";
import path from "path";
import { ConnectionOptions } from "typeorm";
import { PROD } from "./constants";

export const ormConfig: ConnectionOptions = {
  type: "postgres",
  url: process.env.POSTGRESDB_URL,
  port: Number(process.env.POSTGRESDB_PORT),
  entities: [
    path.join(__dirname, "./entity/**/*.ts"),
    path.join(__dirname, "./entity/**/*.js"),
  ],
  migrations: [
    path.join(__dirname, "./migration/**/*.js"),
    path.join(__dirname, "./migration/**/*.ts"),
  ],
  synchronize: true,
  logging: !PROD,
};
