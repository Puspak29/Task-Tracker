'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogIn } from 'lucide-react';
import { BackgroundOrbs, AuthBrand, ErrorAlert } from '@/components/ui';
import FieldInput from '@/components/ui/FieldInput';
import PasswordField from '@/components/ui/PasswordField';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password');
      return;
    }

    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <BackgroundOrbs />

      <div className="relative z-10 w-full max-w-md">
        <AuthBrand />

        <div className="bg-[#393E46] border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/60">
          <h1 className="text-xl font-bold text-[#EEEEEE] mb-1">Welcome back</h1>
          <p className="text-sm text-[#EEEEEE]/60 mb-6">Sign in to manage your tasks</p>

          <ErrorAlert message={error} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5" noValidate>
            <FieldInput
              id="login-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => set('email', v)}
              placeholder="you@example.com"
              autoFocus
            />

            <PasswordField
              id="login-password"
              label="Password"
              value={form.password}
              onChange={(v) => set('password', v)}
              placeholder="Enter your password"
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 active:scale-[0.98] text-[#222831] text-sm font-bold py-3 rounded-lg transition-all shadow-md shadow-brand/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <LogIn size={16} />
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-[#EEEEEE]/50 text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand hover:text-brand/80 font-semibold transition-all">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
