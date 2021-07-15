import cors from "cors";
import express from "express";
import morgan from "morgan";
import { verify } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import { createAccessToken, refreshToken } from "./middleware/auth";
import { User } from "./entity/User";

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(cookieParser());
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
