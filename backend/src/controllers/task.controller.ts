import prisma from "../prisma.js";

export const getTasks = async (req: any, res: any) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user.userId },
  });
  res.json(tasks);
};

export const createTask = async (req: any, res: any) => {
  const { title, description } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      userId: req.user.userId,
    },
  });

  res.status(201).json(task);
};

export const updateTask = async (req: any, res: any) => {
  const { id } = req.params;

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: req.body,
  });

  res.json(task);
};

export const deleteTask = async (req: any, res: any) => {
  const { id } = req.params;

  await prisma.task.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Task deleted" });
};
