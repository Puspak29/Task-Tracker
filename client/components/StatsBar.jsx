'use client';
import { CheckSquare, Zap, TrendingUp, ListTodo } from 'lucide-react';

const cards = [
  {
    key: 'total',
    icon: TrendingUp,
    label: 'Total Tasks',
    iconColor: 'text-brand',
    iconBg: 'bg-brand/10 border-brand/20',
    hoverCls: 'hover:border-brand/30 hover:shadow-[0_0_20px_rgba(0,173,181,0.08)]',
  },
  {
    key: 'todo',
    icon: ListTodo,
    label: 'To Do',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    hoverCls: 'hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]',
  },
  {
    key: 'inProgress',
    icon: Zap,
    label: 'In Progress',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    hoverCls: 'hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]',
  },
  {
    key: 'done',
    icon: CheckSquare,
    label: 'Completed',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    hoverCls: 'hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]',
  },
];

export default function StatsBar({ stats, loading }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(({ key, icon: Icon, label, iconColor, iconBg, hoverCls }) => (
        <div
          key={key}
          className={`flex items-center gap-4 bg-[#393E46] border border-white/5 rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-200 ${hoverCls}`}
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconBg}`}
          >
            <Icon size={19} className={iconColor} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#EEEEEE] leading-none tracking-tight">
              {loading ? '–' : stats[key] ?? 0}
            </p>
            <p className="text-xs font-medium text-[#EEEEEE]/70 mt-1.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
