import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getAuthTokenOrRedirect() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session.access_token;
}