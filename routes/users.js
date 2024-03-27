import express from "express";
import {
  addTask,
  forgetPassword,
  getMyProfile,
  login,
  logout,
  register,
  removeTask,
  resetPassword,
  updatePassword,
  updateProfile,
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
router.get("/me", isAuthenticated, getMyProfile);
router.put("/updateprofile", isAuthenticated, updateProfile);
router.put("/updatepassword", isAuthenticated, updatePassword);
router.post("/forgetpassword", forgetPassword);
router.post("/resetpassword", resetPassword);

export default router;
