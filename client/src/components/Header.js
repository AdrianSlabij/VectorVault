"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { House, FileText, MessageSquare } from "lucide-react";

export default function Header({ session }) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
    router.push("/sign-in");
  };

  return (
    <header className="border-b p-4 flex justify-between items-center bg-white">
      <div className="flex gap-2 items-center">
        <Button asChild variant="ghost" className="font-bold text-lg">
          <Link href="/home" className="flex items-center gap-2">
            <House className="w-5 h-5" />
            <span>Home</span>
          </Link>
        </Button>

        <Button asChild variant="ghost">
          <Link href="/files" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Files</span>
          </Link>
        </Button>

        <Button asChild variant="ghost">
          <Link href="/chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <span className="text-sm text-gray-500">
          Hey, {session?.user?.email}!
        </span>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  );
}