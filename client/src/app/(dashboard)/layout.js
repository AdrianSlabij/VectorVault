import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}