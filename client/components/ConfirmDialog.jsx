'use client';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmDialog({ task, onConfirm, onCancel }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#000000]/75 backdrop-blur-md flex items-center justify-center p-4 anim-fade" onClick={onCancel}>
      <div
        className="bg-[#393E46] border border-red-500/20 rounded-2xl p-7 max-w-sm w-full text-center shadow-2xl shadow-black/80 anim-slide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-400" />
        </div>

        <h2 id="confirm-title" className="text-lg font-bold text-[#EEEEEE] mb-2">Delete Task?</h2>
        <p className="text-sm text-[#EEEEEE]/70 leading-relaxed mb-6">
          You are about to delete{' '}
          <span className="text-[#EEEEEE] font-semibold">&ldquo;{task.title}&rdquo;</span>.
          This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            id="confirm-cancel-btn"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-lg text-[#EEEEEE]/70 hover:text-[#EEEEEE] hover:bg-white/10 text-xs font-semibold py-2 px-4 cursor-pointer transition-all"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            onClick={() => onConfirm(task._id)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 active:scale-95 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all shadow-md shadow-red-500/20 cursor-pointer"
          >
            <Trash2 size={14} />
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
