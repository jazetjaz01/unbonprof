"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const fullName = formData.get("full_name") as string;

  await supabase
    .from("profiles")
    .update({ full_name: fullName, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  revalidatePath("/dashboard", "layout");
}

export async function upsertTeacherListing(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const headline = formData.get("headline") as string;
  const bio = formData.get("bio") as string;
  const city = formData.get("city") as string;
  const postalCode = formData.get("postal_code") as string;
  const hourlyRate = formData.get("hourly_rate") as string;
  const teachesOnline = formData.get("teaches_online") === "on";
  const teachesAtHome = formData.get("teaches_at_home") === "on";
  const teachesAtTeacherHome = formData.get("teaches_at_teacher_home") === "on";
  const firstLessonFree = formData.get("first_lesson_free") === "on";
  const publish = formData.get("status") === "published";
  const subjectIds = formData.getAll("subjects") as string[];

  await supabase.from("teachers").upsert({
    id: user.id,
    headline,
    bio,
    city,
    postal_code: postalCode,
    hourly_rate: hourlyRate ? Number(hourlyRate) : null,
    teaches_online: teachesOnline,
    teaches_at_home: teachesAtHome,
    teaches_at_teacher_home: teachesAtTeacherHome,
    first_lesson_free: firstLessonFree,
    status: publish ? "published" : "draft",
    updated_at: new Date().toISOString(),
  });

  await supabase.from("teacher_subjects").delete().eq("teacher_id", user.id);

  if (subjectIds.length > 0) {
    await supabase.from("teacher_subjects").insert(
      subjectIds.map((subjectId) => ({
        teacher_id: user.id,
        subject_id: subjectId,
      })),
    );
  }

  revalidatePath("/dashboard/annonce");
}
