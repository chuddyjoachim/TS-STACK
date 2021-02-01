import * as jwt from "jsonwebtoken";
import * as express from "express";
import { User } from "../entity/User";
import * as dotenv from "dotenv";

dotenv.config();

export const auth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res
        .status(401)
        .json({ msg: "no authentication token, authorization denied" });

    const vpd = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";

    if (token) {
      const verifiedToken = jwt.verify(token, vpd);
      if (!verifiedToken) {
        return res
          .status(401)
          .json({ msg: "token verification failed, authorization denied" });
      }

      if (verifiedToken) {
        req.user = verifiedToken;
      }
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAccessToken = (user: User) => {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET ? process.env.JWT_SECRET : "",
    {
      expiresIn: "15m"
    }
  );
};

export const refreshToken = (user: User) => {
  return jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN ? process.env.REFRESH_TOKEN : "",
    {
      expiresIn: "7d"
    }
  );
};
