import mongoose from "mongoose";
import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import { createError, createSuccess } from "../middleware/response.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(201).json(createSuccess(201, "User has been created!", newUser));
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      $or: [{ name: req.body.name }, { email: req.body.email }],
    });

    if (!user) return next(createError(404, "User not found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    const token = jwt.sign({ id: user._id }, process.env.JWTKEY);
    const { password, ...other } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(createSuccess(200, `Welcome back ${user.name}`, other));
  } catch (err) {
    next(err);
  }
};
