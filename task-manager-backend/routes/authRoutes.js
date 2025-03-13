import express from "express";
import User from "../models/User.js";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
export default router;
