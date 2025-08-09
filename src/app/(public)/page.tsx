// src/app/(public)/page.tsx
import Link from "next/link"
import { findPublishedPosts } from "@/modules/posts/posts.repository"

export const revalidate = 60

type Props = {
  searchParams?: { page?: string; limit?: string }
}

export default async function HomePage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams?.page ?? 1))
  const limit = Math.min(50, Math.max(1, Number(searchParams?.limit ?? 10)))

  const { items, total } = await findPublishedPosts(page, limit)
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <main className="container">
      <h1>Published posts</h1>

      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <Link href={`/${p.slug}`}>{p.title}</Link>{" "}
            <small>{p.publishedAt ?? ""}</small>
          </li>
        ))}
      </ul>

      <nav style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <Link aria-disabled={page <= 1} href={`/?page=${page - 1}&limit=${limit}`}>
          Prev
        </Link>
        <span>
          Page {page} / {totalPages}
        </span>
        <Link aria-disabled={page >= totalPages} href={`/?page=${page + 1}&limit=${limit}`}>
          Next
        </Link>
      </nav>
    </main>
  )
}
