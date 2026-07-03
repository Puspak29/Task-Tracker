'use client';
import { useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-red-400 mt-1">
      <AlertCircle size={12} />
      {msg}
    </span>
  );
}

export default function FieldInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  maxLength,
  error,
  autoFocus = false,
  disabled = false,
  className = '',
  min,
}) {
  const inputRef = useRef(null);
  const hasError = !!error;

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only focus on mount

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[12.5px] font-bold text-[#EEEEEE]/70 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        maxLength={maxLength ? maxLength + 1 : undefined}
        className={`w-full bg-[#222831] border rounded-lg text-[#EEEEEE] text-sm p-3 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all placeholder:text-[#EEEEEE]/45 ${
          hasError ? 'border-red-500/50 bg-red-500/5' : 'border-white/8'
        } ${className}`}
      />
      <div className="flex items-center justify-between min-h-[18px] mt-1">
        <FieldError msg={error} />
        {maxLength && (
          <span className={`text-[10px] ml-auto select-none ${value?.length > maxLength ? 'text-red-400' : 'text-[#EEEEEE]/45'}`}>
            {value?.length ?? 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  error,
  rows = 3,
  className = '',
}) {
  const hasError = !!error;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[12.5px] font-bold text-[#EEEEEE]/70 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-[#222831] border rounded-lg text-[#EEEEEE] text-sm p-3 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all placeholder:text-[#EEEEEE]/45 resize-y min-h-[86px] leading-relaxed ${
          hasError ? 'border-red-500/50 bg-red-500/5' : 'border-white/8'
        } ${className}`}
      />
      <div className="flex items-center justify-between min-h-[18px] mt-1">
        <FieldError msg={error} />
        {maxLength && (
          <span className={`text-[10px] ml-auto select-none ${value?.length > maxLength ? 'text-red-400' : 'text-[#EEEEEE]/45'}`}>
            {value?.length ?? 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export function SelectField({
  id,
  value,
  onChange,
  options,
  label,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[12.5px] font-bold text-[#EEEEEE]/70 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#222831] border border-white/8 rounded-lg text-[#EEEEEE] text-sm p-3 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#393E46] text-[#EEEEEE]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
