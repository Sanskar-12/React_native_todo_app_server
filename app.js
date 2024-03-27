import express from "express";
import userRouter from "./routes/users.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

export const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
    useTempFiles: true,
  })
);
app.use(cors());

//apis
app.use("/api/v1", userRouter);

app.get("/", (req, res) => {
  res.send("Hello from server");
});
