import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const DashboardProfileCard = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user!.id)
    .single();

  return (
    <div className="relative mb-14 overflow-hidden rounded-xl bg-white border">
      <div className="relative h-24 w-full">
        <Image
          src="/dashboard/banniere-profil.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <span className="absolute top-14 left-6 flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-orange-600 text-xl font-semibold text-white">
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt="Photo de profil"
            className="size-full object-cover"
          />
        ) : (
          (profile?.full_name?.[0]?.toUpperCase() ?? "?")
        )}
      </span>

      <div className="px-6 pt-10 pb-4">
        <p className="font-semibold">{profile?.full_name}</p>
      </div>
    </div>
  );
};
