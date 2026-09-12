import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <DashboardNav />
      <div className="mx-auto w-full max-w-(--breakpoint-xl) flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
