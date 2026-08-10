import type { Metadata } from "next";

import { DeleteAccountButton } from "@/components/dashboard/delete-account-button";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata: Metadata = {
  title: "Settings - RecruitAI",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-stack-lg max-w-3xl">
      <header>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
          Settings
        </h2>
        <p className="font-body-md text-body-md text-muted-foreground mt-2">
          Manage your profile and account preferences.
        </p>
      </header>

      <ProfileForm />

      <section className="shadcn-card rounded-xl p-stack-lg flex flex-col gap-stack-sm">
        <h3 className="font-headline-md text-headline-md text-foreground">Appearance</h3>
        <p className="font-body-md text-sm text-muted-foreground">
          Use the theme toggle in the top bar to switch between light and dark mode — your
          preference is remembered automatically.
        </p>
      </section>

      <section className="shadcn-card rounded-xl p-stack-lg flex flex-col gap-stack-sm border-l-4 border-destructive">
        <h3 className="font-headline-md text-headline-md text-foreground">Danger zone</h3>
        <p className="font-body-md text-sm text-muted-foreground">
          Deleting your account permanently removes your resumes, jobs, and analysis history.
        </p>
        <DeleteAccountButton />
      </section>
    </div>
  );
}
