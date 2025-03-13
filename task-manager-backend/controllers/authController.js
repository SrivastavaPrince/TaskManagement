import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Received Data:", { username, email, password }); // Debugging

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });

    if (user) {
      console.log("User created:", user); // Debugging
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      console.log("Failed to create user");
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.json({ message: "Logged out successfully" });
};
