'use client';
import { Search, SlidersHorizontal, X, ChevronDown, ArrowUpDown } from 'lucide-react';

const SelectField = ({ id, value, onChange, options, className = '' }) => (
  <div className={`relative ${className}`}>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-white/5 border border-white/5 rounded-lg text-[#EEEEEE] text-xs py-2 pl-3.5 pr-8.5 cursor-pointer outline-none focus:border-brand/40 hover:bg-white/8 transition-all"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#393E46] text-[#EEEEEE]">
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#EEEEEE]/40 pointer-events-none" />
  </div>
);

const FILTER_GROUPS = [
  {
    label: 'Filter:',
    icon: SlidersHorizontal,
    fields: [
      {
        id: 'filter-status',
        valueKey: 'status',
        options: [
          { value: 'all', label: 'All Status' },
          { value: 'todo', label: 'To Do' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'done', label: 'Done' },
        ],
      },
      {
        id: 'filter-priority',
        valueKey: 'priority',
        options: [
          { value: 'all', label: 'All Priority' },
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ],
      },
    ],
  },
  {
    label: 'Sort:',
    icon: ArrowUpDown,
    fields: [
      {
        id: 'sort-by',
        valueKey: 'sortBy',
        options: [
          { value: 'createdAt', label: 'Date Created' },
          { value: 'updatedAt', label: 'Last Updated' },
          { value: 'dueDate', label: 'Due Date' },
          { value: 'priority', label: 'Priority' },
          { value: 'title', label: 'Title' },
        ],
      },
      {
        id: 'sort-order',
        valueKey: 'order',
        options: [
          { value: 'desc', label: 'Descending' },
          { value: 'asc', label: 'Ascending' },
        ],
      },
    ],
  },
];

export default function FilterBar({ filters, updateFilter }) {
  const hasActiveFilters =
    filters.status !== 'all' || filters.priority !== 'all' || filters.search !== '';

  const clearFilters = () => {
    updateFilter('status', 'all');
    updateFilter('priority', 'all');
    updateFilter('search', '');
  };

  return (
    <div className="bg-[#393E46] border border-white/5 rounded-2xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#EEEEEE]/40 pointer-events-none" />
          <input
            id="filter-search"
            type="text"
            placeholder="Search tasks…"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-lg text-[#EEEEEE] text-sm py-2 pl-9 pr-9 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all placeholder:text-[#EEEEEE]/40"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none text-[#EEEEEE]/40 hover:text-[#EEEEEE] cursor-pointer p-1 rounded transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter & Sort groups */}
        {FILTER_GROUPS.map(({ label, icon: Icon, fields }) => (
          <div key={label} className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-[#EEEEEE]/50 font-semibold uppercase tracking-wider">
              <Icon size={12} />
              <span>{label}</span>
            </div>
            {fields.map(({ id, valueKey, options }) => (
              <SelectField
                key={id}
                id={id}
                value={filters[valueKey]}
                onChange={(v) => updateFilter(valueKey, v)}
                options={options}
              />
            ))}
          </div>
        ))}

        {/* Clear */}
        {hasActiveFilters && (
          <button
            id="clear-filters-btn"
            onClick={clearFilters}
            className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold py-2 px-3.5 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
