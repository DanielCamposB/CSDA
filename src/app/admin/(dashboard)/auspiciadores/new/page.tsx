import { SponsorForm } from "../sponsor-form";
import { createSponsor } from "../actions";

export default function NewSponsorPage() {
  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Nuevo auspiciador</h1>
      <SponsorForm action={createSponsor} />
    </>
  );
}
