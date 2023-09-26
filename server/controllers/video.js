import Video from "../models/Video.js";
import Users from "../models/Users.js";
import { createError, createSuccess } from "../middleware/response.js";

// Create video
export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.json(createSuccess(200, "Video saved successfull", savedVideo));
  } catch (error) {
    next(createError(400, error.message));
  }
};

// Update video
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id);
    if (!video) return next(createError(404, "Video not found"));
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.json(createSuccess(200, "Video updated successfully", updatedVideo));
    } else {
      return next(createError(403, "You can update only video"));
    }
  } catch (error) {
    next(createError(404, error.message));
  }
};
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id);
    if (!video) return next(createError(404, "Video not found"));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.json(createSuccess(200, "Video has been deleted successfully"));
    } else {
      return next(createError(403, "You can delete only video"));
    }
  } catch (error) {
    next(createError(404, error.message));
  }
};
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.json(createSuccess(200, video));
  } catch (error) {
    next(createError(404, error.message));
  }
};

export const addViews = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.json(createSuccess(200, "The view has been increased."));
  } catch (error) {
    next(createError(404, error.message));
  }
};

export const randomVideo = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.json(createSuccess(200, videos));
  } catch (error) {
    next(createError(404, error.message));
  }
};

export const trendsVideo = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.json(createSuccess(200, videos));
  } catch (error) {
    next(createError(404, error.message));
  }
};

export const SubscribedVideo = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );
    res.json(
      createSuccess(
        200,
        list.flat().sort((a, b) => b.createdAt - a.createdAt)
      )
    );
  } catch (error) {
    next(createError(404, error.message));
  }
};

export const getByTags = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.json(createSuccess(200, videos));
  } catch (error) {
    next(createError(404, error.message));
  }
};
