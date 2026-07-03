'use client';
import { Tag, Pencil, Trash2, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { PRIORITY_CONFIG, STATUS_CONFIG, formatDate, isOverdue, isDueToday, truncate } from '@/lib/utils';

export default function TaskCard({ task, onEdit, onDelete }) {
  const priority = PRIORITY_CONFIG[task.priority];
  const status   = STATUS_CONFIG[task.status];
  const overdue  = isOverdue(task.dueDate, task.status);
  const dueToday = !overdue && isDueToday(task.dueDate);
  const done     = task.status === 'done';

  const stripeCls =
    task.priority === 'high'
      ? 'bg-gradient-to-b from-red-400 to-red-600'
      : task.priority === 'medium'
      ? 'bg-gradient-to-b from-amber-400 to-amber-600'
      : 'bg-gradient-to-b from-emerald-400 to-emerald-600';

  return (
    <div className={`anim-card relative bg-[#393E46] border border-white/5 rounded-2xl overflow-hidden group hover:border-brand/35 hover:-translate-y-0.5 transition-all duration-200 ${done ? 'opacity-60 hover:opacity-85' : ''}`}>
      {/* Side stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-r ${stripeCls}`} />

      <div className="pl-5 pr-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full border ${priority.bg} ${priority.color} ${priority.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              id={`edit-${task._id}`}
              onClick={() => onEdit(task)}
              className="w-7 h-7 rounded-lg border bg-brand/10 border-brand/20 text-brand hover:bg-brand/25 hover:border-brand/40 hover:shadow-[0_0_10px_rgba(0,173,181,0.15)] flex items-center justify-center cursor-pointer transition-all duration-150"
              title="Edit"
            >
              <Pencil size={12} />
            </button>
            <button
              id={`delete-${task._id}`}
              onClick={() => onDelete(task)}
              className="w-7 h-7 rounded-lg border bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/22 hover:border-red-500/40 hover:shadow-[0_0_10px_rgba(239,68,68,0.15)] flex items-center justify-center cursor-pointer transition-all duration-150"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-sm font-semibold text-[#EEEEEE] leading-snug mb-1.5 flex items-start gap-1.5 ${done ? 'line-through text-[#EEEEEE]/40' : ''}`}>
          {done && <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />}
          <span className="break-words">{task.title}</span>
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-[#EEEEEE]/70 leading-relaxed mb-3 break-words">{truncate(task.description, 110)}</p>
        )}

        {/* Tags */}
        {task.tags?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
            <Tag size={10} className="text-[#EEEEEE]/40 shrink-0" />
            {task.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] font-semibold text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-md">
                #{t}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-[10px] font-semibold text-[#EEEEEE]/40 bg-white/3 border border-white/5 px-2 py-0.5 rounded-md">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/4">
          {task.dueDate ? (
            <div className={`flex items-center gap-1 text-[11px] font-semibold ${overdue ? 'text-red-400' : dueToday ? 'text-amber-400' : 'text-[#EEEEEE]/40'}`}>
              {overdue ? <AlertCircle size={11} /> : <Clock size={11} />}
              <span>
                {overdue ? 'Overdue · ' : dueToday ? 'Today · ' : ''}
                {formatDate(task.dueDate)}
              </span>
            </div>
          ) : <span />}
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${status.bg} ${status.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}
