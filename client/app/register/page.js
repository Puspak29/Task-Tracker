'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserPlus } from 'lucide-react';
import { BackgroundOrbs, AuthBrand, ErrorAlert } from '@/components/ui';
import FieldInput from '@/components/ui/FieldInput';
import PasswordField from '@/components/ui/PasswordField';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
      <BackgroundOrbs />

      <div className="relative z-10 w-full max-w-md">
        <AuthBrand />

        <div className="bg-[#393E46] border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/60">
          <h1 className="text-xl font-bold text-[#EEEEEE] mb-1">Create an account</h1>
          <p className="text-sm text-[#EEEEEE]/60 mb-6">Get started with TaskTrack</p>

          <ErrorAlert message={error} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5" noValidate>
            <FieldInput
              id="reg-name"
              label="Name"
              value={form.name}
              onChange={(v) => set('name', v)}
              placeholder="Your name"
              autoFocus
            />

            <FieldInput
              id="reg-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => set('email', v)}
              placeholder="you@example.com"
            />

            <PasswordField
              id="reg-password"
              label="Password"
              value={form.password}
              onChange={(v) => set('password', v)}
              placeholder="At least 6 characters"
            />

            <FieldInput
              id="reg-confirm"
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(v) => set('confirmPassword', v)}
              placeholder="Repeat your password"
            />

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
