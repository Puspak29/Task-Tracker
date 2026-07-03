'use client';
import { useState, useEffect, useRef } from 'react';
import { X, Plus, Tag, Save, AlertCircle, CheckSquare } from 'lucide-react';
import { formatTag } from '@/lib/utils';

const CHAR_LIMIT = { title: 100, description: 500 };

const FieldError = ({ msg }) =>
  msg ? (
    <span className="flex items-center gap-1 text-xs text-red-400 mt-1">
      <AlertCircle size={12} />
      {msg}
    </span>
  ) : null;

export default function TaskModal({ task, onClose, onSave }) {
  const isEdit = !!task;
  const titleRef = useRef(null);

  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? task.dueDate.substring(0, 10) : '',
    tags: task?.tags || [],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    titleRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const addTag = () => {
    const tag = formatTag(tagInput.trim());
    if (!tag) return;
    if (form.tags.includes(tag)) {
      setTagInput('');
      return;
    }
    if (form.tags.length >= 10) return;
    set('tags', [...form.tags, tag]);
    setTagInput('');
  };

  const removeTag = (tag) => set('tags', form.tags.filter((t) => t !== tag));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length > CHAR_LIMIT.title)
      errs.title = `Title must be ${CHAR_LIMIT.title} characters or less`;
    if (form.description.length > CHAR_LIMIT.description)
      errs.description = `Description must be ${CHAR_LIMIT.description} characters or less`;
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
        tags: form.tags,
      });
      onClose();
    } catch {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#000000]/75 backdrop-blur-md flex items-center justify-center p-4 anim-fade" onClick={onClose} onKeyDown={handleKeyDown}>
      <div
        className="bg-[#393E46] border border-brand/20 rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/80 anim-slide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
              <CheckSquare size={16} className="text-brand" />
            </div>
            <h2 id="modal-title" className="text-base font-bold text-[#EEEEEE]">
              {isEdit ? 'Edit Task' : 'Create Task'}
            </h2>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="bg-white/5 border border-white/5 rounded-lg text-[#EEEEEE]/70 hover:text-[#EEEEEE] hover:bg-white/10 w-8 h-8 flex items-center justify-center cursor-pointer transition-all"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form id="task-form" onSubmit={handleSubmit} className="p-6 flex flex-col gap-4.5 animate-none" noValidate>
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-title" className="text-[12.5px] font-bold text-[#EEEEEE]/70 flex items-center gap-1.5 uppercase tracking-wider">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="task-title"
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="What needs to be done?"
              className={`w-full bg-[#222831] border rounded-lg text-[#EEEEEE] text-sm p-3 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all placeholder:text-[#EEEEEE]/45 ${
                errors.title ? 'border-red-500/50 bg-red-500/5' : 'border-white/8'
              }`}
              maxLength={CHAR_LIMIT.title + 1}
            />
            <div className="flex items-center justify-between min-h-[18px] mt-1">
              <FieldError msg={errors.title} />
              <span className={`text-[10px] ml-auto select-none ${form.title.length > CHAR_LIMIT.title ? 'text-red-400' : 'text-[#EEEEEE]/45'}`}>
                {form.title.length}/{CHAR_LIMIT.title}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-description" className="text-[12.5px] font-bold text-[#EEEEEE]/70 flex items-center gap-1.5 uppercase tracking-wider">Description</label>
            <textarea
              id="task-description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Add more details (optional)…"
              rows={3}
              className={`w-full bg-[#222831] border rounded-lg text-[#EEEEEE] text-sm p-3 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all placeholder:text-[#EEEEEE]/45 resize-y min-h-[86px] leading-relaxed ${
                errors.description ? 'border-red-500/50 bg-red-500/5' : 'border-white/8'
              }`}
            />
            <div className="flex items-center justify-between min-h-[18px] mt-1">
              <FieldError msg={errors.description} />
              <span className={`text-[10px] ml-auto select-none ${form.description.length > CHAR_LIMIT.description ? 'text-red-400' : 'text-[#EEEEEE]/45'}`}>
                {form.description.length}/{CHAR_LIMIT.description}
              </span>
            </div>
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-status" className="text-[12.5px] font-bold text-[#EEEEEE]/70 flex items-center gap-1.5 uppercase tracking-wider">Status</label>
              <select
                id="task-status"
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="w-full bg-[#222831] border border-white/8 rounded-lg text-[#EEEEEE] text-sm p-3 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all"
              >
                <option value="todo" className="bg-[#393E46] text-[#EEEEEE]">To Do</option>
                <option value="in-progress" className="bg-[#393E46] text-[#EEEEEE]">In Progress</option>
                <option value="done" className="bg-[#393E46] text-[#EEEEEE]">Done</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-priority" className="text-[12.5px] font-bold text-[#EEEEEE]/70 flex items-center gap-1.5 uppercase tracking-wider">Priority</label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={(e) => set('priority', e.target.value)}
                className="w-full bg-[#222831] border border-white/8 rounded-lg text-[#EEEEEE] text-sm p-3 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all"
              >
                <option value="high" className="bg-[#393E46] text-[#EEEEEE]">High</option>
                <option value="medium" className="bg-[#393E46] text-[#EEEEEE]">Medium</option>
                <option value="low" className="bg-[#393E46] text-[#EEEEEE]">Low</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-due-date" className="text-[12.5px] font-bold text-[#EEEEEE]/70 flex items-center gap-1.5 uppercase tracking-wider">Due Date</label>
            <input
              id="task-due-date"
              type="date"
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
              className="w-full bg-[#222831] border border-white/8 rounded-lg text-[#EEEEEE] text-sm p-3 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all"
              min={new Date().toISOString().substring(0, 10)}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-tag-input" className="text-[12.5px] font-bold text-[#EEEEEE]/70 flex items-center gap-1.5 uppercase tracking-wider">
              Tags
              <span className="text-[#EEEEEE]/45 font-normal normal-case tracking-normal ml-1">({form.tags.length}/10)</span>
            </label>
            <div className="flex items-center bg-[#222831] border border-white/8 rounded-lg overflow-hidden focus-within:border-brand/50 focus-within:bg-brand/5 transition-all">
              <Tag size={14} className="ml-3.5 text-[#EEEEEE]/45 shrink-0" />
              <input
                id="task-tag-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                  if (e.key === ',') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type tag and press Enter…"
                className="flex-1 bg-transparent border-none text-[#EEEEEE] text-sm py-2.5 px-2.5 outline-none placeholder:text-[#EEEEEE]/45"
                disabled={form.tags.length >= 10}
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-brand/10 border-l border-white/5 text-brand px-4.5 h-11 hover:bg-brand/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!tagInput.trim() || form.tags.length >= 10}
              >
                <Plus size={14} />
              </button>
            </div>

            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs font-semibold text-brand bg-brand/10 border border-brand/20 py-1 pl-3 pr-2 rounded-full">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="bg-white/5 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer text-[#EEEEEE]/45 hover:bg-red-500/20 hover:text-red-400 transition-all"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 justify-end pt-2">
            <button
              id="modal-cancel-btn"
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-lg text-[#EEEEEE]/70 hover:text-[#EEEEEE] hover:bg-white/10 text-xs font-semibold py-2 px-4 cursor-pointer transition-all"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              id="modal-save-btn"
              type="submit"
              className="inline-flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-600/90 active:scale-95 text-[#222831] text-xs font-bold py-2 px-4 rounded-lg transition-all shadow-md shadow-brand/20 cursor-pointer"
              disabled={submitting}
            >
              <Save size={14} />
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
