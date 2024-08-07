import dotenv from "dotenv";
import express from "express";
import connectDb from "./config.js";
// import cors from "cors";
import cookieParser from "cookie-parser";
import { Router } from "./src/routes/rotes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors(option));
app.use(express.static("public"));

app.use("/api/user", Router);
app.listen(process.env.PORT, () => {
  console.log(`prot is running in ${process.env.PORT}`);
  connectDb();
});
