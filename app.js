import express from "express";
import userRouter from "./routes/users.js";
import cookieParser from "cookie-parser";

export const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//apis
app.use("/api/v1", userRouter);
