import { NewsForm } from "../news-form";
import { createNews } from "../actions";

export default function NewNewsPage() {
  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Nueva noticia</h1>
      <NewsForm action={createNews} />
    </>
  );
}
