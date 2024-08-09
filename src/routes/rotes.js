import express from "express";
import { Login, resgeister } from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";

export const Router = express.Router();

Router.route("/signup").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  resgeister
);
Router.route("/login").post(Login);
