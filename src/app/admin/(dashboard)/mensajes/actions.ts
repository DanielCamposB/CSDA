"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleHandled(id: string, handled: boolean) {
  const supabase = await createClient();
  await supabase.from("contact_messages").update({ handled: !handled }).eq("id", id);
  revalidatePath("/admin/mensajes");
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/mensajes");
}
