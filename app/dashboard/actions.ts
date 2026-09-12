"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const firstName = (formData.get("first_name") as string) ?? "";
  const lastName = (formData.get("last_name") as string) ?? "";
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  const updates: Record<string, unknown> = {
    first_name: firstName,
    last_name: lastName,
    full_name: [firstName, lastName].filter(Boolean).join(" "),
    phone,
    address,
    updated_at: new Date().toISOString(),
  };

  const avatar = formData.get("avatar") as File | null;
  if (avatar && avatar.size > 0) {
    const extension = avatar.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/avatar.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatar, { upsert: true });

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      updates.avatar_url = `${publicUrl}?t=${Date.now()}`;
    }
  }

  await supabase.from("profiles").update(updates).eq("id", user.id);

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
