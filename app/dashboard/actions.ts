"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { POST_MAX_LENGTH } from "@/lib/constants";

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

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const content = ((formData.get("content") as string) ?? "").trim().slice(0, POST_MAX_LENGTH);
  if (!content) return;

  let imageUrl: string | null = null;
  const image = formData.get("image") as File | null;
  if (image && image.size > 0) {
    const extension = image.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(path, image);

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from("posts").getPublicUrl(path);
      imageUrl = publicUrl;
    }
  }

  await supabase.from("posts").insert({
    author_id: user.id,
    content,
    image_url: imageUrl,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/posts");
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const postId = formData.get("post_id") as string;

  await supabase.from("posts").delete().eq("id", postId).eq("author_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/posts");
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createArticle(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();

  if (!title || !category || !content) return;

  let imageUrl: string | null = null;
  const image = formData.get("image") as File | null;
  if (image && image.size > 0) {
    const extension = image.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("articles")
      .upload(path, image);

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from("articles").getPublicUrl(path);
      imageUrl = publicUrl;
    }
  }

  const base = slugify(title) || "article";
  let slug = base;
  let suffix = 2;
  while (true) {
    const { data: existing } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  await supabase.from("articles").insert({
    author_id: user.id,
    title,
    category,
    content,
    image_url: imageUrl,
    slug,
  });

  revalidatePath("/actualite");
  redirect(`/actualite/${slug}`);
}

export async function updateArticle(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const articleId = formData.get("article_id") as string;

  const { data: article } = await supabase
    .from("articles")
    .select("author_id, slug, image_url")
    .eq("id", articleId)
    .single();
  if (article?.author_id !== user.id) redirect("/actualite");

  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();

  if (!title || !category || !content) return;

  const updates: Record<string, unknown> = { title, category, content };

  const image = formData.get("image") as File | null;
  if (image && image.size > 0) {
    const extension = image.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("articles")
      .upload(path, image);

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from("articles").getPublicUrl(path);
      updates.image_url = publicUrl;

      if (article.image_url) {
        const oldPath = article.image_url.split("/articles/").pop();
        if (oldPath) await supabase.storage.from("articles").remove([oldPath]);
      }
    }
  }

  await supabase.from("articles").update(updates).eq("id", articleId);

  revalidatePath("/actualite");
  revalidatePath(`/actualite/${article.slug}`);
  redirect(`/actualite/${article.slug}`);
}

export async function deleteArticle(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const articleId = formData.get("article_id") as string;

  const { data: article } = await supabase
    .from("articles")
    .select("image_url")
    .eq("id", articleId)
    .eq("author_id", user.id)
    .single();

  await supabase.from("articles").delete().eq("id", articleId).eq("author_id", user.id);

  if (article?.image_url) {
    const path = article.image_url.split("/articles/").pop();
    if (path) await supabase.storage.from("articles").remove([path]);
  }

  revalidatePath("/actualite");
  redirect("/actualite");
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
