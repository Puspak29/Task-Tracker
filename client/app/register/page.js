'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CheckSquare, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed rounded-full pointer-events-none z-0 filter blur-[120px] w-[600px] h-[600px] bg-brand/8 top-[-200px] left-[-150px]" />
      <div className="fixed rounded-full pointer-events-none z-0 filter blur-[120px] w-[500px] h-[500px] bg-brand/5 bottom-[-100px] right-[-150px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8 select-none">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/30 flex items-center justify-center shadow-lg shadow-brand/10">
            <CheckSquare size={22} className="text-brand" />
          </div>
          <span className="text-2xl font-extrabold text-[#EEEEEE] tracking-tight">TaskTrack</span>
        </div>

        <div className="bg-[#393E46] border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/60">
          <h1 className="text-xl font-bold text-[#EEEEEE] mb-1">Create an account</h1>
          <p className="text-sm text-[#EEEEEE]/60 mb-6">Get started with TaskTrack</p>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5" noValidate>
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-name" className="text-[12.5px] font-bold text-[#EEEEEE]/70 uppercase tracking-wider">
                Name
              </label>
              <input
                id="reg-name"
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#222831] border border-white/8 rounded-lg text-[#EEEEEE] text-sm p-3 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all placeholder:text-[#EEEEEE]/45"
                autoFocus
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-[12.5px] font-bold text-[#EEEEEE]/70 uppercase tracking-wider">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#222831] border border-white/8 rounded-lg text-[#EEEEEE] text-sm p-3 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all placeholder:text-[#EEEEEE]/45"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-[12.5px] font-bold text-[#EEEEEE]/70 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#222831] border border-white/8 rounded-lg text-[#EEEEEE] text-sm p-3 pr-10 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all placeholder:text-[#EEEEEE]/45"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EEEEEE]/45 hover:text-[#EEEEEE]/70 transition-all cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-confirm" className="text-[12.5px] font-bold text-[#EEEEEE]/70 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                placeholder="Repeat your password"
                className="w-full bg-[#222831] border border-white/8 rounded-lg text-[#EEEEEE] text-sm p-3 outline-none focus:border-brand/50 focus:bg-brand/5 transition-all placeholder:text-[#EEEEEE]/45"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 active:scale-[0.98] text-[#222831] text-sm font-bold py-3 rounded-lg transition-all shadow-md shadow-brand/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <UserPlus size={16} />
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-[#EEEEEE]/50 text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand hover:text-brand/80 font-semibold transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
