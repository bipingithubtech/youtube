import express from "express";
import { resgeister } from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";

export const Router = express.Router();

Router.route("/signup").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  resgeister
);
