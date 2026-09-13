import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardProfileCard } from "@/components/dashboard-profile-card";
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
    <div className="flex-1 bg-slate-50">
      <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
        <aside className="w-full shrink-0 md:w-72">
          <DashboardProfileCard />
          <DashboardNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
