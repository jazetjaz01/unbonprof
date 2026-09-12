import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function AvisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("rating_avg, rating_count")
    .eq("id", user!.id)
    .maybeSingle();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at")
    .eq("teacher_id", user!.id)
    .order("created_at", { ascending: false });

  if (!teacher) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Avis reçus</CardTitle>
          <CardDescription>
            Crée ton annonce pour commencer à recevoir des avis d&apos;élèves.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Avis reçus</CardTitle>
          <CardDescription>
            {teacher.rating_count > 0
              ? `${teacher.rating_avg} / 5 sur ${teacher.rating_count} avis`
              : "Pas encore d'avis"}
          </CardDescription>
        </CardHeader>
      </Card>

      {(reviews ?? []).map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <CardTitle className="text-base">{review.rating} / 5</CardTitle>
            <CardDescription>
              {new Date(review.created_at).toLocaleDateString("fr-FR")}
            </CardDescription>
          </CardHeader>
          {review.comment && (
            <CardContent className="text-sm">{review.comment}</CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
