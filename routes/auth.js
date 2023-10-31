import express from "express";
import { signin, signup } from "../controllers/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

//CREATE A USER
router.post("/signup", upload, signup);
router.post("/upload", upload);

//SIGN IN
router.post("/signin", signin);

export default router;
