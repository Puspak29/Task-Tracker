'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StatsBar from '@/components/StatsBar';
import FilterBar from '@/components/FilterBar';
import TaskBoard from '@/components/TaskBoard';
import TaskModal from '@/components/TaskModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/context/AuthContext';
import { Plus, Loader2 } from 'lucide-react';
import { BackgroundOrbs } from '@/components/ui';

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { tasks, stats, loading, filters, updateFilter, createTask, updateTask, deleteTask } = useTasks();
  const [modal, setModal] = useState({ open: false, task: null });
  const [confirmTask, setConfirmTask] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222831]">
        <div className="flex items-center gap-3 text-[#EEEEEE]/60">
          <Loader2 size={22} className="animate-spin text-brand" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect is happening)
  if (!user) return null;

  const openCreate = () => setModal({ open: true, task: null });
  const openEdit   = (task) => setModal({ open: true, task });
  const closeModal = () => setModal({ open: false, task: null });
  const handleSave = (data) => modal.task ? updateTask(modal.task._id, data) : createTask(data);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <BackgroundOrbs />
      <div className="fixed rounded-full pointer-events-none z-0 filter blur-[120px] w-[350px] h-[350px] bg-brand/4 top-[40%] left-[40%]" />

      <Navbar onNewTask={openCreate} />

      <main className="relative z-10 px-6 py-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Heading */}
          <div className="mb-7 select-none">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#EEEEEE]">
              Task Board
            </h1>
            <p className="text-sm text-[#EEEEEE]/60 mt-1">
              Organize your work. Ship what matters.
            </p>
          </div>

          <StatsBar stats={stats} loading={loading} />
          <FilterBar filters={filters} updateFilter={updateFilter} />
          <TaskBoard
            tasks={tasks}
            loading={loading}
            onEdit={openEdit}
            onDelete={setConfirmTask}
            onNewTask={openCreate}
          />
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <button
        id="fab-new-task"
        onClick={openCreate}
        aria-label="New task"
        className="fixed bottom-7 right-6 z-40 w-12 h-12 rounded-full bg-brand hover:bg-brand/90 active:scale-95 text-[#222831] flex items-center justify-center shadow-lg shadow-brand/35 hover:scale-105 transition-all duration-200 cursor-pointer sm:hidden"
      >
        <Plus size={22} color="#222831" />
      </button>

      {modal.open && (
        <TaskModal task={modal.task} onClose={closeModal} onSave={handleSave} />
      )}
      {confirmTask && (
        <ConfirmDialog
          task={confirmTask}
          onConfirm={async (id) => {
            await deleteTask(id);
            setConfirmTask(null);
          }}
          onCancel={() => setConfirmTask(null)}
        />
      )}
    </div>
  );
}

