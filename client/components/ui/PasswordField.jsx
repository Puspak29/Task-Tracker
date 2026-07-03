'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoFocus = false,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12.5px] font-bold text-[#EEEEEE]/70 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          ref={(el) => { if (autoFocus) el?.focus(); }}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#222831] border border-white/8 rounded-lg text-[#EEEEEE] text-sm p-3 pr-10 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all placeholder:text-[#EEEEEE]/45"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EEEEEE]/45 hover:text-[#EEEEEE]/70 transition-all cursor-pointer"
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
