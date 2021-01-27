import * as jwt from "jsonwebtoken";
import * as express from "express";

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
