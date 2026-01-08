import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, CheckCircle2, Circle, 
  LayoutDashboard, LogOut, X, Edit3, 
  MoreVertical, AlignLeft, Calendar
} from "lucide-react";
import { getTasks, createTask, deleteTask, updateTask } from "../api/taskapi";

// --- Types ---
interface Task {
  id: number;
  title: string;
  description?: string;
  status: "pending" | "completed";
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ title: "", description: "" });

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({ title: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description || "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask({ ...formData, status: "pending" });
      }
      setIsModalOpen(false);
      loadTasks();
    } catch (err) {
      alert("Action failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Permanently delete this task?")) {
      await deleteTask(id);
      loadTasks();
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await updateTask(task.id, { status: newStatus });
    loadTasks();
  };

  useEffect(() => { loadTasks(); }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex overflow-hidden">
      {/* Sidebar - Same as Landing */}
      <aside className="w-64 border-r border-zinc-800 hidden lg:flex flex-col bg-black">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <CheckCircle2 className="text-black w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Nexus</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold">
            <LayoutDashboard size={18} /> My Tasks
          </button>
        </nav>
        <div className="p-6 border-t border-zinc-900">
           <button className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-sm">
             <LogOut size={18} /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
              <p className="text-zinc-500 text-sm mt-1">Manage your engineering backlog</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openCreateModal}
              className="bg-white text-black px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
            >
              <Plus size={18} /> New Task
            </motion.button>
          </header>

          <div className="space-y-4">
            {loading ? (
              <div className="py-20 text-center font-mono text-xs text-zinc-600 tracking-[0.2em]">FETCHING_RESOURCES...</div>
            ) : (
              <AnimatePresence>
                {tasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onToggle={() => toggleStatus(task)}
                    onDelete={() => handleDelete(task.id)}
                    onEdit={() => openEditModal(task)}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* MODAL: Create/Edit Task */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0c0c0e] border border-zinc-800 w-full max-w-lg rounded-[2rem] overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white p-2 hover:bg-zinc-900 rounded-full transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Title</label>
                    <input 
                      autoFocus
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Implement OAuth flow"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 text-right block">Description (Optional)</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Add more details about this task..."
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-500 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="mt-10 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-[2] py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-all">
                    {editingTask ? 'Update Task' : 'Save Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-Component for Tasks ---
const TaskCard = ({ task, onToggle, onDelete, onEdit }: any) => (
  <motion.div 
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="group flex items-start gap-4 p-5 bg-zinc-900/20 border border-zinc-900 rounded-2xl hover:border-zinc-700 transition-all"
  >
    <button onClick={onToggle} className={`mt-1 transition-colors ${task.status === 'completed' ? 'text-zinc-600' : 'text-zinc-400 hover:text-white'}`}>
      {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
    </button>
    
    <div className="flex-1">
      <h3 className={`font-bold text-lg leading-tight transition-all ${task.status === 'completed' ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>
        {task.title}
      </h3>
      {task.description && (
        <p className="text-zinc-500 text-sm mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="flex gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
          <Calendar size={12} /> Today
        </span>
        {task.description && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
            <AlignLeft size={12} /> Notes
          </span>
        )}
      </div>
    </div>

    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={onEdit} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
        <Edit3 size={18} />
      </button>
      <button onClick={onDelete} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
        <Trash2 size={18} />
      </button>
    </div>
  </motion.div>
);

export default Dashboard;