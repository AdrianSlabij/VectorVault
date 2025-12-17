import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server"; // Use Server Client

export default async function DashboardLayout({ children }) {
  // Fetch session on the server
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header is now here, passed session directly */}
      <Header session={session} />
      
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}