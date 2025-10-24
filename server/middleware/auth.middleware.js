import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export const requireTeacher = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== "teacher") return res.status(403).json({ message: "Teacher access required" });
  next();
};