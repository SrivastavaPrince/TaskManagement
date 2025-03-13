import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173", // Allow frontend
  credentials: true, // Allow cookies
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Welcome! You are authenticated.", user: req.user });
});
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
