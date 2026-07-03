// Priority config
export const PRIORITY_CONFIG = {
  high: {
    label: 'High',
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
    badge: 'badge-high',
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    badge: 'badge-medium',
  },
  low: {
    label: 'Low',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    badge: 'badge-low',
  },
};

// Status config
export const STATUS_CONFIG = {
  todo: {
    label: 'To Do',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    headerBg: 'bg-blue-500/10',
    headerBorder: 'border-blue-500/40',
    glow: 'shadow-blue-500/10',
    dot: 'bg-blue-400',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    headerBg: 'bg-amber-500/10',
    headerBorder: 'border-amber-500/40',
    glow: 'shadow-amber-500/10',
    dot: 'bg-amber-400',
  },
  done: {
    label: 'Done',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    headerBg: 'bg-emerald-500/10',
    headerBorder: 'border-emerald-500/40',
    glow: 'shadow-emerald-500/10',
    dot: 'bg-emerald-400',
  },
};

// Format date
export const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Check if date is overdue
export const isOverdue = (date, status) => {
  if (!date || status === 'done') return false;
  return new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
};

// Check if due today
export const isDueToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const due = new Date(date);
  return (
    due.getDate() === today.getDate() &&
    due.getMonth() === today.getMonth() &&
    due.getFullYear() === today.getFullYear()
  );
};

// Truncate text
export const truncate = (text, max = 100) => {
  if (!text || text.length <= max) return text;
  return text.substring(0, max).trimEnd() + '…';
};

// Format tag (normalize)
export const formatTag = (tag) => tag.toLowerCase().replace(/\s+/g, '-');
