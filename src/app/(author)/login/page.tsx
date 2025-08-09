'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthorLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/posts/new';

  const [key, setKey] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/author/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      if (res.status === 204) {
        router.push(next);
        return;
      }
      const { error } = await res.json().catch(() => ({ error: { message: 'Unknown error' } }));
      setError(error?.message ?? 'Login failed');
    } catch (err: any) {
      setError(err?.message ?? 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '64px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 12 }}>
      <h1 style={{ marginBottom: 12 }}>Author Login</h1>
      <p style={{ marginBottom: 16, color: '#6b7280' }}>
        Enter your secret author key to continue;
      </p>
      <form onSubmit={onSubmit}>
        <label htmlFor="key" style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Author key;</label>
        <input
          id="key"
          name="key"
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Paste AUTHOR_KEY"
          autoComplete="current-password"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        {error && <div style={{ color: '#b91c1c', marginTop: 8 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading || !key}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid transparent',
            background: loading || !key ? '#e5e7eb' : '#111827',
            color: loading || !key ? '#6b7280' : '#fff',
            cursor: loading || !key ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
