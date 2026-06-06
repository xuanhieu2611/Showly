"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function setAccountType(
  accountType: "artist" | "client"
): Promise<{ redirect: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { redirect: "/login" };

  const { error } = await supabase
    .from("users")
    .update({ account_type: accountType })
    .eq("id", user.id);

  if (error) return { error: error.message };

  return { redirect: accountType === "artist" ? "/join" : "/discover" };
}
