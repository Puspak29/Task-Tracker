'use client';
import TaskCard from './TaskCard';
import { STATUS_CONFIG } from '@/lib/utils';
import { Plus, Inbox } from 'lucide-react';

const COLS = ['todo', 'in-progress', 'done'];

function Column({ status, tasks, onEdit, onDelete, onNewTask }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="bg-[#2d333b] border border-white/5 rounded-2xl flex flex-col min-h-[360px] overflow-hidden">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${cfg.headerBg} ${cfg.headerBorder}`}>
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{cfg.icon}</span>
          <h2 className={`text-[13.5px] font-bold tracking-wide ${cfg.color}`}>{cfg.label}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
            {tasks.length}
          </span>
          {status === 'todo' && (
            <button
              onClick={onNewTask}
              className="w-6.5 h-6.5 rounded-lg bg-brand/10 border border-brand/30 text-brand hover:bg-brand/25 hover:border-brand/50 flex items-center justify-center cursor-pointer transition-all duration-150"
              title="Add task"
            >
              <Plus size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Cards list */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 gap-2 text-center select-none">
            <Inbox size={28} className="text-[#EEEEEE]/40" />
            <p className="text-xs text-[#EEEEEE]/40 font-medium">No tasks yet</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}

function SkeletonColumn({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="bg-[#2d333b] border border-white/5 rounded-2xl flex flex-col min-h-[360px] overflow-hidden">
      <div className={`flex items-center justify-between p-4 border-b ${cfg.headerBg} ${cfg.headerBorder}`}>
        <div className="w-20 h-4 bg-white/5 rounded animate-pulse" />
        <div className="w-8 h-4 bg-white/5 rounded-full animate-pulse" />
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#393E46] border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
            <div className="w-16 h-4 bg-white/5 rounded animate-pulse" />
            <div className="w-full h-3 bg-white/5 rounded animate-pulse" />
            <div className="w-3/4 h-3 bg-white/5 rounded animate-pulse" />
            <div className="w-1/2 h-2.5 bg-white/5 rounded animate-pulse mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TaskBoard({ tasks, loading, onEdit, onDelete, onNewTask }) {
  const grouped = COLS.reduce((a, s) => ({ ...a, [s]: tasks.filter((t) => t.status === s) }), {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
      {COLS.map((s) =>
        loading ? (
          <SkeletonColumn key={s} status={s} />
        ) : (
          <Column
            key={s}
            status={s}
            tasks={grouped[s]}
            onEdit={onEdit}
            onDelete={onDelete}
            onNewTask={onNewTask}
          />
        )
      )}
    </div>
  );
}
