import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // Corrected `req.cookie` to `req.cookies`

  if (!token) {
    return next(errorHandler(401, "Unauthorized - Token not provided!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Forbidden - Invalid token!"));
    }
    req.user = user; // Attach user info to `req` for use in the controller
    next();
  });
};
