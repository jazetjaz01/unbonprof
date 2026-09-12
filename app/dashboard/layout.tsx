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
    <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-1 flex-col gap-6 px-4 py-8 md:flex-row sm:px-6 lg:px-8">
      <DashboardNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
