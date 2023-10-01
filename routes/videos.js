import express from "express";
import {
  SubscribedVideo,
  addVideo,
  addViews,
  deleteVideo,
  getVideo,
  randomVideo,
  trendsVideo,
  updateVideo,
} from "../controllers/video.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

// create video
router.post("/", verifyToken, addVideo);

// update video
router.put("/:id", verifyToken, updateVideo);

// delete video
router.delete("/:id", verifyToken, deleteVideo);

// get video
router.get("/find/:id", getVideo);

// update video view
router.put("/view/:id", addViews);
router.get("/trend", trendsVideo);
router.get("/random", randomVideo);
router.get("/sub", verifyToken, SubscribedVideo);
router.get("/tags", SubscribedVideo);
router.get("/seacrh", SubscribedVideo);
export default router;
