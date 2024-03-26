import express from "express";
import { register, verify } from "../controllers/users.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", isAuthenticated, verify);

export default router;
