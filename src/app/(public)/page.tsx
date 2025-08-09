import { prisma } from "@/lib/prisma"
export const revalidate = 60

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, slug: true, publishedAt: true },
  })
  return (
    <main className="container">
      <h1>Published posts</h1>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <a href={`/posts/${p.slug}`}>{p.title}</a>{" "}
            <small>{p.publishedAt?.toISOString()}</small>
          </li>
        ))}
      </ul>
    </main>
  )
}
