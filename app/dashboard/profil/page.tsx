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
    .select("full_name, email")
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
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile?.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Nom complet</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={profile?.full_name ?? ""}
              placeholder="Ton nom complet"
            />
          </div>
          <Button type="submit">Enregistrer</Button>
        </form>
      </CardContent>
    </Card>
  );
}
