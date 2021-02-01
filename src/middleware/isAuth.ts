import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { resContext } from "../context/resContext";
import * as dotenv from "dotenv";

dotenv.config();
export const isAuth: MiddlewareFn<resContext> = ({ context }, next) => {
  const auhtorization = context.req.headers["authorization"];

  if (!auhtorization) {
    throw new Error("not authenticated");
  }

  try {
    const token = auhtorization?.split(" ")[1];

    const payload = verify(token, process.env.JWT_SECRET!);

    if (!payload) {
      throw new Error("not authenticated");
    }

    payload ? (context.payload = payload as any) : "";
  } catch (err) {
    console.log(err);
    throw new Error("not authenticated");
  }

  return next();
};
