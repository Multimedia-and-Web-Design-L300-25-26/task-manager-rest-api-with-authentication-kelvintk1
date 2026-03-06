import express from "express";
import Task from "../models/Task.js";
import { createTask, getTasks, deleteTask } from "../controllers/tasksController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", authMiddleware, createTask);

// GET /api/tasks
router.get("/", authMiddleware, getTasks);

// DELETE /api/tasks/:id
router.delete("/:id", authMiddleware, deleteTask);

export default router;