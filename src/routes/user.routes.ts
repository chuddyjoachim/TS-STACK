import { Router } from "express";
const router = Router();

import {
  createUsers,
  getUsers,
  loginUser,
} from "../controllers/user.controller";

(async () => {
  router.get("/", getUsers);
  router.post("/register", createUsers);
  router.post("/login", loginUser);
})();

export default router;
