import { Router } from "express";
const router = Router();

import {
  createUsers,
  getUsers,
  loginUser,
} from "../controllers/user.controller";

(async () => {
  // const getter = await getUsers;
  router.get("/users", getUsers);
  router.post("/users/register", createUsers);
  router.post("/users/login", loginUser);
})();

export default router;
