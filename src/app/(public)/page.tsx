import Link from "next/link"
import { getPublishedPosts } from "@/modules/posts/posts.service"

export const revalidate = 60

type Props = {
  searchParams?: { page?: string; limit?: string }
}

export default async function HomePage({ searchParams = {} }: Props) {
  const pageParam = typeof searchParams.page === 'string' ? searchParams.page : '1'
  const limitParam = typeof searchParams.limit === 'string' ? searchParams.limit : '10'

  const page = Math.max(1, Number(pageParam))
  const limit = Math.min(50, Math.max(1, Number(limitParam)))

  const { items, total } = await getPublishedPosts(page, limit)
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <main className="container">
      <h1>Published posts</h1>

      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <Link href={`/posts/${p.slug}`}>{p.title}</Link>{" "}
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
