import cors from "cors";
import express from "express";
import morgan from "morgan";
import { verify } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import { createAccessToken, refreshToken } from "./middleware/auth";
import { User } from "./entity/User";

import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { PROD } from "./constants";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// app.use(cookieParser());
app.use(
  session({
    name: "rfx",
    store: new RedisStore({
      client: redisClient,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 60,// * 24 * 7 * 12
      httpOnly: true,
      sameSite: 'lax',
      secure: PROD
    },
    saveUninitialized: false,
    secret: "noe089234nf",
    resave: false,
  })
);
app.use("/users", userRoutes);

/* reg res */
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
    httpOnly: true,
  });
  return res.send({ ok: true, accessToken: createAccessToken(user) });
});

export default app;
