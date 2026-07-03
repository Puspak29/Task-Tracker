import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'TaskTrack — Professional Task Tracker',
  description:
    'A professional MERN stack task tracker with kanban board, priorities, tags, and real-time updates.',
  keywords: 'task tracker, kanban, productivity, project management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1e1e2e',
              color: '#e2e8f0',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: 'var(--font-inter)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#1e1e2e' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#1e1e2e' },
            },
            loading: {
              iconTheme: { primary: '#8b5cf6', secondary: '#1e1e2e' },
            },
          }}
        />
      </body>
    </html>
  );
}
