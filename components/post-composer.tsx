"use client";

import { ImageIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { createPost } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { POST_MAX_LENGTH } from "@/lib/constants";

export const PostComposer = ({
  avatarUrl,
  authorInitial,
  authorName,
}: {
  avatarUrl: string | null;
  authorInitial: string;
  authorName: string | null;
}) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const reset = () => {
    setOpen(false);
    setContent("");
    setImagePreview(null);
    formRef.current?.reset();
  };

  const avatar = avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={avatarUrl} alt="" className="size-full object-cover" />
  ) : (
    authorInitial
  );

  return (
    <div className="rounded-xl border bg-white p-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 text-left"
        >
          <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-600 font-semibold text-white">
            {avatar}
          </span>
          <span className="flex flex-1 items-center gap-3">
            {authorName && <span className="text-sm font-semibold">{authorName}</span>}
            <span className="flex-1 rounded-full border px-4 py-3 text-sm text-muted-foreground hover:bg-muted">
              Commencer un post pour faire connaitre votre actualité 
            </span>
          </span>
        </button>
      ) : (
        <form
          ref={formRef}
          action={async (formData) => {
            await createPost(formData);
            reset();
          }}
          className="space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-600 font-semibold text-white">
                {avatar}
              </span>
              {authorName && <span className="text-sm font-semibold">{authorName}</span>}
            </div>
            <Button type="button" variant="ghost" size="icon-sm" onClick={reset} aria-label="Annuler">
              <X className="size-4" />
            </Button>
          </div>

          <Textarea
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value.slice(0, POST_MAX_LENGTH))}
            placeholder="De quoi veux-tu parler ?"
            rows={4}
            autoFocus
          />

          <p className="text-right text-xs text-muted-foreground">
            {content.length} / {POST_MAX_LENGTH}
          </p>

          {imagePreview && (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="" className="max-h-64 w-full rounded-lg object-cover" />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="absolute top-2 right-2 rounded-full bg-white"
                onClick={() => {
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                aria-label="Retirer l'image"
              >
                <X className="size-4" />
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setImagePreview(URL.createObjectURL(file));
            }}
          />

          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon />
              Photo
            </Button>
            <Button type="submit" disabled={content.trim().length === 0}>
              Publier
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
