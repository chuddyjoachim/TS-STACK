import { Router } from "express";
import { auth } from "../middleware/auth";

const router = Router();

import {
  createUsers,
  getUsers,
  loginUser,
  deleteUser
} from "../controllers/user.controller";

(async () => {
  router.get("/", getUsers);
  router.post("/register", createUsers);
  router.post("/login", loginUser);
  router.delete("/delete", auth, deleteUser);
})();

export default router;
