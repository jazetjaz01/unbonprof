import { updateProfile } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, first_name, last_name, phone, address, avatar_url")
    .eq("id", user!.id)
    .single();

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Mon profil</CardTitle>
        <CardDescription>Ces informations sont utilisées sur unbonprof.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updateProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-600 text-xl font-semibold text-white">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt="Photo de profil"
                  className="size-full object-cover"
                />
              ) : (
                profile?.first_name?.[0]?.toUpperCase() ?? "?"
              )}
            </span>
            <div className="flex-1 space-y-2">
              <Label htmlFor="avatar">Photo de profil</Label>
              <Input id="avatar" name="avatar" type="file" accept="image/png,image/jpeg,image/webp" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile?.email ?? ""} disabled />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input id="last_name" name="last_name" defaultValue={profile?.last_name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input id="first_name" name="first_name" defaultValue={profile?.first_name ?? ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile?.phone ?? ""}
              placeholder="06 12 34 56 78"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              defaultValue={profile?.address ?? ""}
              placeholder="12 rue des Lilas, 75011 Paris"
            />
          </div>

          <Button type="submit">Enregistrer</Button>
        </form>
      </CardContent>
    </Card>
  );
}
