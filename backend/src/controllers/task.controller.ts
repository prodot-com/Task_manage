import { Request, Response } from "express";
import prisma from "../prisma.js";

interface AuthRequest extends Request {
  user?: {
    userId: number;
  };
}

export const getTasks = async (req: any, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: req.user!.userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (existingTask.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found and cannot be deleted" });
    }

    if (task.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this task" });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Task successfully deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while deleting the task" });
  }
};
