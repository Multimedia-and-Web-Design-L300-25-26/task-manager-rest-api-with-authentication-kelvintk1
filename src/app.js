import express from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Add this temporarily to test if server is working
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

export default app;