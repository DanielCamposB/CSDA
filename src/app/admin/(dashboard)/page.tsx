import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function count(table: string) {
  const supabase = await createClient();
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminHomePage() {
  const [news, matches, players, galleries, pendingMessages] = await Promise.all([
    count("news"),
    count("matches"),
    count("players"),
    count("galleries"),
    (async () => {
      const supabase = await createClient();
      const { count } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("handled", false);
      return count ?? 0;
    })(),
  ]);

  const cards = [
    { label: "Noticias", value: news, href: "/admin/noticias" },
    { label: "Partidos", value: matches, href: "/admin/partidos" },
    { label: "Jugadores", value: players, href: "/admin/jugadores" },
    { label: "Galerías", value: galleries, href: "/admin/galeria" },
    { label: "Mensajes pendientes", value: pendingMessages, href: "/admin/mensajes" },
  ];

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Panel administrativo</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-black/10 bg-white p-6 hover:shadow-md"
          >
            <p className="text-3xl font-bold text-primary">{card.value}</p>
            <p className="mt-1 text-sm text-primary/60">{card.label}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
