import { createError, createSuccess } from "../middleware/response.js";
import User from "../models/Users.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res
        .status(200)
        .json(createSuccess(200, "User updated succfully", updateUser));
    } catch (error) {
      next(createError(400, error.message));
    }
  } else {
    return next(createError(403, "You can update only you account!"));
  }
};

// Delete User
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json(createSuccess(200, "User has been deleted"));
    } catch (error) {
      next(createError(400, error.message));
    }
  } else {
    return next(createError(403, "You can delete only you account!"));
  }
};

// get a user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return createError(400, "No record found");
    }
    res.json(createSuccess(200, "Success", user));
  } catch (error) {
    next(createError(400, error.message));
  }
};

// subscriber
export const subscribe = async (req, res, next) => {
  try {
    await User.findById(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req, params.id, {
      $inc: { subscribers: 1 },
    });
    res.json(createSuccess(200, "Subscription succesfull!"));
  } catch (error) {
    next(createError(400, error.message));
  }
};

// unsubscriber
export const unsubscribe = async (req, res, next) => {
  try {
    await User.findById(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req, params.id, {
      $inc: { subscribers: -1 },
    });
    res.json(createSuccess(200, "UnSubscription succesfull!"));
  } catch (error) {
    next(createError(400, error.message));
  }
};

export const like = (req, res, next) => {
  console.log("test is working");
};
export const dislike = (req, res, next) => {
  console.log("test is working");
};
