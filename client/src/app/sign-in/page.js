"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button"; // assuming you have Shadcn

export default function LoginPage() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // where to go after login
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Button onClick={handleLogin}>Sign in with Google</Button>
      <Button onClick={handleHome}>Home</Button>
    </div>
  );
}
