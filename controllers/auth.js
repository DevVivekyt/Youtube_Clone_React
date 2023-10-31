import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import { createError, createSuccess } from "../middleware/response.js";
import jwt from "jsonwebtoken";

// Create User
export const signup = async (req, res, next) => {
  const { password, confirmPassword, ...userData } = req.body;

  if (password !== confirmPassword) {
    return res.json(
      createError(400, "Password and confirm password do not match!")
    );
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({
      ...userData,
      password: hash,
      profilePic: req.file.path,
    });

    await newUser.save();
    const newUserWithoutPassword = { ...newUser._doc };
    delete newUserWithoutPassword.password;

    res.json(
      createSuccess(201, "User has been created!", newUserWithoutPassword)
    );
  } catch (error) {
    next(error);
  }
};

// Login User

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
      .json(createSuccess(1, `Welcome back ${user.name}`, { other, token }));
  } catch (err) {
    next(err);
  }
};
