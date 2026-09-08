import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BenefitForm } from "../benefit-form";
import { updateBenefit } from "../actions";

export default async function EditBenefitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: benefit }, { data: sponsors }] = await Promise.all([
    supabase.from("benefits").select("*").eq("id", id).maybeSingle(),
    supabase.from("sponsors").select("*").order("name"),
  ]);
  if (!benefit) notFound();

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Editar beneficio</h1>
      <BenefitForm action={updateBenefit.bind(null, id)} sponsors={sponsors ?? []} initial={benefit} />
    </>
  );
}
