"use client";

import Link from "next/link";

export function RowActions({
  editHref,
  deleteAction,
}: {
  editHref: string;
  deleteAction: (formData: FormData) => void;
}) {
  return (
    <td className="whitespace-nowrap px-4 py-3 text-right">
      <Link href={editHref} className="mr-3 font-medium text-secondary hover:underline">
        Editar
      </Link>
      <form
        action={deleteAction}
        onSubmit={(e) => {
          if (!confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")) {
            e.preventDefault();
          }
        }}
        className="inline"
      >
        <button type="submit" className="font-medium text-red-600 hover:underline">
          Eliminar
        </button>
      </form>
    </td>
  );
}
