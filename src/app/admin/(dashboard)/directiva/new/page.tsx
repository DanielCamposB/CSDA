import { DirectorForm } from "../director-form";
import { createDirector } from "../actions";

export default function NewDirectorPage() {
  return (
    <>
      <h1 className="mb-6 font-serif text-2xl font-bold text-primary">Nuevo miembro de directiva</h1>
      <DirectorForm action={createDirector} />
    </>
  );
}
