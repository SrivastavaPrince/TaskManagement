import Task from "../models/Task.js";

// @desc Create a new task
// @route POST /api/tasks
// @access Private (User must be logged in)
export const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  try {
    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user._id, // Get user ID from JWT middleware
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

// @desc Get all tasks for logged-in user
// @route GET /api/tasks
// @access Private
export const getTasks = async (req, res) => {
  try {
    const { search, status, priority, dueDate } = req.query;

    let query = { user: req.user._id };

    // 🔍 Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive search
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 🎯 Filter by status (pending/completed)
    if (status) {
      query.status = status;
    }

    // 🔥 Filter by priority (low, medium, high)
    if (priority) {
      query.priority = priority;
    }

    // 📅 Filter by due date (today, this week, overdue)
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate === "today") {
        query.dueDate = {
          $gte: today,
          $lt: new Date(today.getTime() + 86400000),
        };
      } else if (dueDate === "thisWeek") {
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        query.dueDate = { $gte: today, $lt: weekEnd };
      } else if (dueDate === "overdue") {
        query.dueDate = { $lt: today };
      }
    }

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// @desc Get a single task by ID
// @route GET /api/tasks/:id
// @access Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
};

// @desc Update a task
// @route PUT /api/tasks/:id
// @access Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

// @desc Delete a task
// @route DELETE /api/tasks/:id
// @access Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
