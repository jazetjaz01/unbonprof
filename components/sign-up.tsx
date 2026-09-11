"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { signup, loginWithGoogle } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/logo";

const formSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const CardShell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-1 items-center justify-center px-4 py-16">
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-linear-to-b from-muted/50 to-card px-8 py-8 shadow-lg/5 dark:from-transparent dark:shadow-xl">
      <div
        className="absolute inset-0 -top-px -left-px z-0"
        style={{
          backgroundImage: `
      linear-gradient(to right, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px)
    `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
      repeating-linear-gradient(
            to right,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          repeating-linear-gradient(
            to bottom,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)
    `,
          WebkitMaskImage: `
repeating-linear-gradient(
            to right,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          repeating-linear-gradient(
            to bottom,
            black 0px,
            black 3px,
            transparent 3px,
            transparent 8px
          ),
          radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)
    `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      <div className="relative isolate flex flex-col items-center">
        {children}
      </div>
    </div>
  </div>
);

const SignUp = () => {
  const searchParams = useSearchParams();
  const checkEmail = searchParams.get("check-email");

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    await signup(formData);
  };

  if (checkEmail) {
    return (
      <CardShell>
        <Logo />
        <p className="mt-4 text-center font-medium text-xl">
          Vérifie ta boîte mail
        </p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          On t&apos;a envoyé un lien de confirmation pour activer ton compte.
        </p>
      </CardShell>
    );
  }

  return (
    <CardShell>
      <Logo />
      <p className="mt-4 text-center font-medium text-xl">
        Rejoins unbonprof en quelques secondes
      </p>

      <form action={loginWithGoogle} className="mt-8 w-full">
        <Button type="submit" variant="outline" className="w-full gap-3">
          <GoogleLogo />
          Continuer avec Google
        </Button>
      </form>

      <div className="my-7 flex w-full items-center justify-center overflow-hidden">
        <Separator />
        <span className="px-2 text-sm">OU</span>
        <Separator />
      </div>

      <form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email</FieldLabel>
              <Input
                aria-invalid={fieldState.invalid}
                className="w-full"
                placeholder="Email"
                type="email"
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Mot de passe</FieldLabel>
              <Input
                aria-invalid={fieldState.invalid}
                className="w-full"
                placeholder="Mot de passe"
                type="password"
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
          S&apos;inscrire
        </Button>
      </form>

      <p className="mt-5 text-center text-sm">
        Déjà un compte ?
        <Link className="ml-1 text-muted-foreground underline" href="/auth/login">
          Se connecter
        </Link>
      </p>
    </CardShell>
  );
};

const GoogleLogo = () => (
  <svg
    className="inline-block size-lg shrink-0 align-sub text-inherit"
    fill="none"
    height="1.2em"
    id="icon-google"
    viewBox="0 0 16 16"
    width="1.2em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M15.6823 8.18368C15.6823 7.63986 15.6382 7.0931 15.5442 6.55811H7.99829V9.63876H12.3194C12.1401 10.6323 11.564 11.5113 10.7203 12.0698V14.0687H13.2983C14.8122 12.6753 15.6823 10.6176 15.6823 8.18368Z"
        fill="#4285F4"
      />
      <path
        d="M7.99812 16C10.1558 16 11.9753 15.2915 13.3011 14.0687L10.7231 12.0698C10.0058 12.5578 9.07988 12.8341 8.00106 12.8341C5.91398 12.8341 4.14436 11.426 3.50942 9.53296H0.849121V11.5936C2.2072 14.295 4.97332 16 7.99812 16Z"
        fill="#34A853"
      />
      <path
        d="M3.50665 9.53295C3.17154 8.53938 3.17154 7.4635 3.50665 6.46993V4.4093H0.849292C-0.285376 6.66982 -0.285376 9.33306 0.849292 11.5936L3.50665 9.53295Z"
        fill="#FBBC04"
      />
      <path
        d="M7.99812 3.16589C9.13867 3.14825 10.241 3.57743 11.067 4.36523L13.3511 2.0812C11.9048 0.723121 9.98526 -0.0235266 7.99812 -1.02057e-05C4.97332 -1.02057e-05 2.2072 1.70493 0.849121 4.40932L3.50648 6.46995C4.13848 4.57394 5.91104 3.16589 7.99812 3.16589Z"
        fill="#EA4335"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect fill="white" height="16" width="15.6825" />
      </clipPath>
    </defs>
  </svg>
);

export default SignUp;
