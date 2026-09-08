import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewsForm } from "../news-form";
import { updateNews } from "../actions";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("news").select("*").eq("id", id).maybeSingle();
  if (!post) notFound();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Editar noticia</h1>
      <NewsForm action={updateNews.bind(null, id)} initial={post} />
    </>
  );
}
