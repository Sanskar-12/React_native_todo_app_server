import express from "express";
import {
  addTask,
  login,
  logout,
  register,
  removeTask,
  updateTask,
  verify,
} from "../controllers/users.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/verify", isAuthenticated, verify);
router.post("/add", isAuthenticated, addTask);
router.delete("/delete/:taskId", isAuthenticated, removeTask);
router.put("/update/:taskId", isAuthenticated, updateTask);

export default router;
