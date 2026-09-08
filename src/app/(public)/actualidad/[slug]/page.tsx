import Image from "next/image";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { getNewsBySlug } from "@/lib/data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  return { title: post?.title ?? "Noticia" };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) notFound();

  return (
    <Section>
      <article className="mx-auto max-w-3xl">
        {post.category && (
          <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
            {post.category}
          </span>
        )}
        <h1 className="mt-2 font-serif text-3xl font-bold text-primary">{post.title}</h1>
        {post.published_at && (
          <p className="mt-2 text-sm text-primary/50">
            {new Date(post.published_at).toLocaleDateString("es-CL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        {post.cover_image_url && (
          <div className="relative mt-6 h-72 w-full overflow-hidden rounded-xl">
            <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-primary/80">
          {post.content}
        </div>
      </article>
    </Section>
  );
}
