'use client';
import { CheckSquare } from 'lucide-react';

export default function AuthBrand() {
  return (
    <div className="flex items-center justify-center gap-3 mb-8 select-none">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/30 flex items-center justify-center shadow-lg shadow-brand/10">
        <CheckSquare size={22} className="text-brand" />
      </div>
      <span className="text-2xl font-extrabold text-[#EEEEEE] tracking-tight">TaskTrack</span>
    </div>
  );
}
