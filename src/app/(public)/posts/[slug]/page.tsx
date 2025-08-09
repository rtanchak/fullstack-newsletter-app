import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getPublishedPost } from "@/modules/posts/posts.service";

type Props = { params: { slug: string } };

export const revalidate = 60;

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) notFound();

  return (
    <article className="prose max-w-3xl">
      <h1>{post.title}</h1>

      <p style={{ opacity: 0.7, fontSize: 14 }}>
        {post.publishedAt ? format(post.publishedAt, "yyyy-MM-dd") : ""}
      </p>

      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
        {post.content}
      </div>
    </article>
  )
}
