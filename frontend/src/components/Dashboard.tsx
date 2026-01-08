import { useEffect, useState } from "react";
import { getTasks, createTask } from "../api/taskapi";

const Dashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  const addTask = async () => {
    await createTask({ title });
    setTitle("");
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
          placeholder="New task"
        />
        <button onClick={addTask} className="bg-black text-white px-4">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-2">
            {task.title} – {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
