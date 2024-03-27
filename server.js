import { app } from "./app.js";
import { config } from "dotenv";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";

config({
  path: "./config/config.env",
});
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is Listening on port ${process.env.PORT}`);
});
