'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PostStatus } from '@prisma/client';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [status, setStatus] = React.useState<PostStatus>(PostStatus.DRAFT);
  const [publishAt, setPublishAt] = React.useState<string>(''); // ISO-local
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body: Record<string, any> = { title, content, status };
      if (author) body.author = author;
      if (status === PostStatus.SCHEDULED && publishAt) body.publishedAt = new Date(publishAt).toISOString();

      const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 201) {
        const json = await res.json();
        const slug = json?.data?.slug as string | undefined;
        
        // For scheduled posts, always go to home page
        if (status === PostStatus.SCHEDULED) {
          router.push('/');
          return;
        }
        
        // For other post types, go to the post page if slug exists
        if (slug) router.push(`/posts/${slug}`);
        else router.push('/'); // fallback
        return;
      }

      const json = await res.json().catch(() => null);
      setError(json?.error?.message ?? `Failed with status ${res.status}`);
    } catch (err: any) {
      setError(err?.message ?? 'Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/v1/author/logout', {
        method: 'POST',
      });
      router.push('/author/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Create Post</h1>
      </div>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Fill in the fields and submit to create a draft, schedule, or publish now.
      </p>

      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: 6 }}>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          required
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        
        <label style={{ display: 'block', margin: '16px 0 6px' }}>Author</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author name"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
        />

        <label style={{ display: 'block', margin: '16px 0 6px' }}>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content…"
          required
          rows={10}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
        />

        <label style={{ display: 'block', margin: '16px 0 6px' }}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as PostStatus)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
        >
          <option value="DRAFT">DRAFT</option>
          <option value="SCHEDULED">SCHEDULED</option>
          <option value="PUBLISHED">PUBLISHED</option>
        </select>

        {status === PostStatus.SCHEDULED && (
          <>
            <label style={{ display: 'block', margin: '16px 0 6px' }}>Publish At (local datetime)</label>
            <input
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              required={status === PostStatus.SCHEDULED}
            />
          </>
        )}

        {error && <div style={{ color: '#b91c1c', marginTop: 12 }}>{error}</div>}

        <button
          type="submit"
          disabled={loading || !title || !content || (status === PostStatus.SCHEDULED && !publishAt)}
          style={{
            marginTop: 18,
            padding: '10px 14px',
            borderRadius: 8,
            background: '#111827',
            color: '#fff',
            border: '1px solid transparent',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
        >
          {loading ? 'Saving…' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
