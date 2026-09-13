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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex-1 bg-linear-to-t from-orange-50 to-white">
      <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
        <aside className="w-full shrink-0 md:w-52">
          <DashboardProfileCard />
          <DashboardNav isAdmin={profile?.role === "admin"} />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
