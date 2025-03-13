import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password"); // Attach user data (without password)
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export default protect;
