'use client';
import { useState, useEffect } from 'react';
import { X, Plus, Tag, Save, CheckSquare } from 'lucide-react';
import { formatTag } from '@/lib/utils';
import FieldInput, { TextAreaField, SelectField, FieldError } from '@/components/ui/FieldInput';

const CHAR_LIMIT = { title: 100, description: 500 };

export default function TaskModal({ task, onClose, onSave }) {
  const isEdit = !!task;

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
          <FieldInput
            id="task-title"
            label="Title"
            required
            value={form.title}
            onChange={(v) => set('title', v)}
            placeholder="What needs to be done?"
            maxLength={CHAR_LIMIT.title}
            error={errors.title}
            autoFocus
          />

          <TextAreaField
            id="task-description"
            label="Description"
            value={form.description}
            onChange={(v) => set('description', v)}
            placeholder="Add more details (optional)…"
            maxLength={CHAR_LIMIT.description}
            error={errors.description}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <SelectField
              id="task-status"
              label="Status"
              value={form.status}
              onChange={(v) => set('status', v)}
              options={[
                { value: 'todo', label: 'To Do' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'done', label: 'Done' },
              ]}
            />

            <SelectField
              id="task-priority"
              label="Priority"
              value={form.priority}
              onChange={(v) => set('priority', v)}
              options={[
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
          </div>

          {/* Due Date */}
          <FieldInput
            id="task-due-date"
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(v) => set('dueDate', v)}
            min={new Date().toISOString().substring(0, 10)}
          />

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
                  if (e.key === 'Enter' || e.key === ',') {
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
