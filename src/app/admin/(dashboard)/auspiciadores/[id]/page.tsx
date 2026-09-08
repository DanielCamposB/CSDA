import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SponsorForm } from "../sponsor-form";
import { updateSponsor } from "../actions";

export default async function EditSponsorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: sponsor } = await supabase.from("sponsors").select("*").eq("id", id).maybeSingle();
  if (!sponsor) notFound();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Editar auspiciador</h1>
      <SponsorForm action={updateSponsor.bind(null, id)} initial={sponsor} />
    </>
  );
}
