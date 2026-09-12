import { upsertTeacherListing } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function AnnoncePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("*")
    .eq("id", user!.id)
    .maybeSingle();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name")
    .order("name");

  const { data: teacherSubjects } = await supabase
    .from("teacher_subjects")
    .select("subject_id")
    .eq("teacher_id", user!.id);

  const selectedSubjectIds = new Set(
    (teacherSubjects ?? []).map((row) => row.subject_id),
  );

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Mon annonce</CardTitle>
        <CardDescription>
          Renseigne ton profil pour apparaître dans les recherches de professeurs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={upsertTeacherListing} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="headline">Titre</Label>
            <Input
              id="headline"
              name="headline"
              defaultValue={teacher?.headline ?? ""}
              placeholder='Ex. "Prof de maths agrégé"'
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Présentation</Label>
            <Textarea
              id="bio"
              name="bio"
              rows={5}
              defaultValue={teacher?.bio ?? ""}
              placeholder="Présente ton parcours et ta pédagogie..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input id="city" name="city" defaultValue={teacher?.city ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Code postal</Label>
              <Input id="postal_code" name="postal_code" defaultValue={teacher?.postal_code ?? ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourly_rate">Tarif horaire (€)</Label>
            <Input
              id="hourly_rate"
              name="hourly_rate"
              type="number"
              min={0}
              step="0.01"
              defaultValue={teacher?.hourly_rate ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label>Mode de cours</Label>
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="teaches_online"
                  defaultChecked={teacher?.teaches_online ?? false}
                />
                En ligne
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="teaches_at_home"
                  defaultChecked={teacher?.teaches_at_home ?? false}
                />
                Chez l&apos;élève
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="teaches_at_teacher_home"
                  defaultChecked={teacher?.teaches_at_teacher_home ?? false}
                />
                Chez moi
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="first_lesson_free"
                  defaultChecked={teacher?.first_lesson_free ?? false}
                />
                Premier cours offert
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Matières enseignées</Label>
            <div className="grid max-h-64 grid-cols-2 gap-x-4 gap-y-2 overflow-y-auto rounded-md border p-3 text-sm sm:grid-cols-3">
              {(subjects ?? []).map((subject) => (
                <label key={subject.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="subjects"
                    value={subject.id}
                    defaultChecked={selectedSubjectIds.has(subject.id)}
                  />
                  {subject.name}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="status"
                defaultChecked={teacher?.status === "published"}
              />
              Publier mon annonce (visible par tout le monde)
            </label>
          </div>

          <Button type="submit">Enregistrer</Button>
        </form>
      </CardContent>
    </Card>
  );
}
