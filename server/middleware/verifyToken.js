import jwt from "jsonwebtoken";
import { createError } from "./response.js";

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(createError(401, "Unauthorized: Token is missing."));
  }

  jwt.verify(token, process.env.JWTKEY, (err, user) => {
    if (err) {
      return next(createError(403, "Forbidden: Token is not valid."));
    }
    req.user = user; // Add the user to the request object
    next();
  });
};
