import { createClient } from "@/lib/supabase/server";
import { BenefitForm } from "../benefit-form";
import { createBenefit } from "../actions";

export default async function NewBenefitPage() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase.from("sponsors").select("*").order("name");

  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Nuevo beneficio</h1>
      <BenefitForm action={createBenefit} sponsors={sponsors ?? []} />
    </>
  );
}
