'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Get the current origin dynamically
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      const callbackUrl = `${currentOrigin}/admin`;

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else if (result?.url) {
        // Use the returned URL to maintain the correct host
        window.location.href = result.url;
      } else {
        // Fallback to admin page with current origin
        window.location.href = callbackUrl;
      }
    } catch (_err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-serif font-light text-[#004d66] uppercase tracking-widest">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Bio Law Solutions Dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-600 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#004d66] focus:border-[#004d66] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-600 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#004d66] focus:border-[#004d66] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold tracking-widest uppercase text-white bg-[#004d66] hover:bg-[#003d52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004d66] transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <SessionProvider>
      <LoginForm />
    </SessionProvider>
  );
}
