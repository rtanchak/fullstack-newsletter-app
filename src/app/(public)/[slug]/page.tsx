import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

type Props = { params: { slug: string } }

export const revalidate = 60;

export default async function PostPage({ params }: Props) {
  const post = await prisma.post.findFirst({
    where: {
      slug: params.slug,
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
    },
    select: { title: true, content: true, publishedAt: true },
  })

  if (!post) return notFound()

  return (
    <article className="prose max-w-3xl">
      <h1>{post.title}</h1>
      <p style={{ opacity: 0.7, fontSize: 14 }}>
        {post.publishedAt?.toISOString().slice(0,10)}
      </p>
      <div>{post.content}</div>
    </article>
  )
}
