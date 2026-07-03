'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckSquare, Plus, Menu, X, LogOut, User } from 'lucide-react';

export default function Navbar({ onNewTask }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#222831]/85 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
        {/* Brand */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/30 flex items-center justify-center shadow-lg shadow-brand/10">
            <CheckSquare size={19} className="text-brand" />
          </div>
          <div className="leading-none">
            <span className="text-lg font-extrabold text-[#EEEEEE] tracking-tight">
              TaskTrack
            </span>
          </div>
        </div>

        {/* Right side: actions + user */}
        <div className="flex items-center gap-3">
          {/* Desktop new task button */}
          <button
            id="navbar-new-task-btn-visible"
            onClick={onNewTask}
            className="hidden sm:inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-600/90 active:scale-95 text-[#222831] text-xs font-semibold px-4.5 py-2 rounded-lg transition-all duration-200 shadow-md shadow-brand/20 hover:-translate-y-0.5"
          >
            <Plus size={15} /> New Task
          </button>

          {/* User info & logout (desktop) */}
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center">
                  <User size={12} className="text-brand" />
                </div>
                <span className="text-xs font-medium text-[#EEEEEE]/80 max-w-[100px] truncate">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#EEEEEE]/50 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 px-3 py-1.5 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={13} />
                Logout
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden px-6 py-4 border-t border-white/5 bg-[#222831]/95 backdrop-blur-lg flex flex-col gap-3">
          {user && (
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center">
                <User size={13} className="text-brand" />
              </div>
              <span className="text-sm font-medium text-[#EEEEEE]/80 truncate">{user.name}</span>
            </div>
          )}
          <button
            onClick={() => {
              onNewTask();
              setMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 active:scale-95 text-[#222831] text-xs font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md shadow-brand/20"
          >
            <Plus size={15} /> New Task
          </button>
          {user && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 active:scale-95 text-red-400 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all duration-200"
            >
              <LogOut size={14} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

