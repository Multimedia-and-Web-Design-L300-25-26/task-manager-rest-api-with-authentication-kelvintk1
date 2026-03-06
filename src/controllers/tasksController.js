import Task from "../models/Task.js";

// POST /api/tasks
export const createTask = async (req, res) => {
    // Creating a new task
    // Created task should have an owner
    const { title, description } = req.body;
    const owner = req.user._id;

    try {
        const task = new Task({ title, description, owner });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET /api/tasks
export const getTasks = async (req, res) => {
    // Return only tasks belonging to the authenticated user
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    // Check ownership and delete task
    const { id } = req.params;
    try {
        const task = await Task.findOne({ _id: id, owner: req.user._id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await task.deleteOne({_id: id})
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
