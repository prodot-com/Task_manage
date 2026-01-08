import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, CheckCircle2, 
  LayoutDashboard, LogOut, X, Edit3, 
  AlertTriangle, CheckCircle, Clock, Loader2
} from "lucide-react";
import { getTasks, createTask, deleteTask, updateTask } from "../api/taskapi";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

type TaskStatus = "pending" | "in_progress" | "completed";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<{title: string, description: string, status: TaskStatus}>({ 
    title: "", description: "", status: "pending" 
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleStatusCycle = async (task: Task) => {
    const statusSequence: TaskStatus[] = ["pending", "in_progress", "completed"];
    const currentIndex = statusSequence.indexOf(task.status);
    const nextStatus = statusSequence[(currentIndex + 1) % statusSequence.length];

    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));

    try {
      await updateTask(task.id, { status: nextStatus });
    } catch (err) {
      loadTasks();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      setIsModalOpen(false);
      loadTasks();
    } catch (err) {
      console.error("Action failed");
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case "pending": return { label: "Pending", style: "bg-zinc-800/50 text-zinc-400 border-zinc-700/50", icon: <Clock size={10}/> };
      case "in_progress": return { label: "In Progress", style: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <Loader2 size={10} className="animate-spin"/> };
      case "completed": return { label: "Completed", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <CheckCircle size={10}/> };
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex overflow-hidden">
      <aside className="w-72 border-r border-zinc-900 hidden lg:flex flex-col bg-black/20 backdrop-blur-sm">
        <div className="p-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <CheckCircle2 className="text-black w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight">Nexus</span>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-white text-black rounded-xl text-sm font-bold shadow-lg shadow-white/5">
            <LayoutDashboard size={18} strokeWidth={2.5} /> Tasks
          </button>
        </nav>

        <div className="p-8 border-t border-zinc-900/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900/40 rounded-xl transition-all text-xs font-black tracking-[0.2em]"
          >
            <LogOut size={16} /> LOGOUT
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-6 py-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-end mb-16">
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-2">Workspace</h1>
              <p className="text-zinc-500 text-sm font-medium tracking-wide">
                Synced: <span className="text-zinc-200">{tasks.filter(t => t.status === 'completed').length}</span>
                <span className="mx-1.5 text-zinc-800">/</span>
                <span className="text-zinc-400">{tasks.length} tasks</span>
              </p>
            </div>
            <button 
              onClick={() => { setEditingTask(null); setFormData({title:"", description:"", status:"pending"}); setIsModalOpen(true); }}
              className="group bg-white text-black px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> NEW TASK
            </button>
          </header>

          <div className="space-y-4">
            {loading ? (
              <div className="py-32 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-zinc-800" size={32} />
                <div className="font-bold text-[10px] text-zinc-700 tracking-[0.4em] uppercase">Initializing...</div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    config={getStatusConfig(task.status)}
                    onStatusClick={() => handleStatusCycle(task)}
                    onDelete={() => setDeleteConfirm(task.id)}
                    onEdit={() => { 
                      setEditingTask(task); 
                      setFormData({title:task.title, description:task.description||"", status:task.status}); 
                      setIsModalOpen(true); 
                    }}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <ModalWrapper onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSubmit} className="p-10">
              <h2 className="text-2xl font-bold mb-8 tracking-tight text-white">{editingTask ? 'Edit Task' : 'New Task'}</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 tracking-widest uppercase ml-1">Title</label>
                  <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="What needs to be done?" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-zinc-500 text-sm font-semibold transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 tracking-widest uppercase ml-1">Description</label>
                  <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Add some context..." className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-zinc-500 text-sm font-medium resize-none transition-colors" />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 tracking-widest uppercase ml-1">Status</label>
                  <div className="flex gap-2">
                    {(['pending', 'in_progress', 'completed'] as TaskStatus[]).map((s) => (
                      <button key={s} type="button" onClick={() => setFormData({...formData, status: s})} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${formData.status === s ? "bg-white text-black border-white shadow-lg shadow-white/5" : "bg-zinc-900/30 text-zinc-600 border-zinc-800 hover:border-zinc-700"}`}>
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full mt-10 py-4 bg-zinc-100 text-black rounded-2xl font-bold text-sm tracking-wide hover:bg-white transition-all active:scale-95 shadow-xl shadow-white/5">
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </form>
          </ModalWrapper>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <ModalWrapper onClose={() => setDeleteConfirm(null)}>
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-red-500">
                <AlertTriangle size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-3 text-white">Delete task?</h3>
              <p className="text-zinc-500 text-sm mb-10 leading-relaxed">This will permanently remove the task. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 text-zinc-400 text-xs font-bold tracking-widest hover:text-white transition-colors">CANCEL</button>
                <button onClick={async () => { await deleteTask(deleteConfirm!); setDeleteConfirm(null); loadTasks(); }} className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-xs font-bold tracking-widest hover:bg-red-500 transition-all active:scale-95 shadow-lg shadow-red-600/20">DELETE</button>
              </div>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskCard = ({ task, config, onDelete, onEdit, onStatusClick }: any) => {
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isCompleted ? 0.4 : 1, y: 0 }}
      className={`group flex items-center justify-between p-7 border rounded-[2rem] transition-all duration-300 ${
        isCompleted 
          ? "bg-zinc-900/20 border-zinc-900" 
          : isInProgress 
            ? "bg-zinc-900/40 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.03)]" 
            : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 shadow-lg shadow-black/20"
      }`}
    >
      <div className="flex-1 min-w-0 pr-4">
        <button 
          onClick={onStatusClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border mb-4 transition-all hover:brightness-125 active:scale-95 cursor-pointer ${config.style}`}
        >
          {config.icon} {config.label}
        </button>
        <h3 className={`font-bold text-xl leading-tight tracking-tight ${isCompleted ? 'text-zinc-600 line-through' : 'text-white'}`}>
          {task.title}
        </h3>
        {task.description && <p className="text-sm mt-2 text-zinc-500 font-medium line-clamp-1 leading-relaxed">{task.description}</p>}
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
        <button onClick={onEdit} className="p-3 bg-zinc-800/50 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"><Edit3 size={18}/></button>
        <button onClick={onDelete} className="p-3 bg-zinc-800/50 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 size={18}/></button>
      </div>
    </motion.div>
  );
};

const ModalWrapper = ({ children, onClose }: any) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.95, y: 20 }} 
      className="bg-[#0c0c0e] border border-zinc-800/50 w-full max-w-md rounded-[3rem] overflow-hidden relative shadow-2xl shadow-black"
    >
      <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-full hover:bg-zinc-900 text-zinc-600 hover:text-white transition-all"><X size={20}/></button>
      {children}
    </motion.div>
  </div>
);

export default Dashboard;