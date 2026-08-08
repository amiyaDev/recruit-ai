import type { Metadata } from "next";

import { DeleteAccountButton } from "@/components/dashboard/delete-account-button";
import { MOCK_USER } from "@/constants/dashboard-mock-data";

export const metadata: Metadata = {
  title: "Settings - RecruitAI",
};

export default function SettingsPage() {
  const initials = MOCK_USER.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

      <section className="shadcn-card rounded-xl p-stack-lg flex flex-col gap-stack-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-body-md text-base font-semibold text-foreground">{MOCK_USER.name}</p>
            <p className="font-body-md text-sm text-muted-foreground">{MOCK_USER.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                {MOCK_USER.role}
              </span>
              {MOCK_USER.isVerified && (
                <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-tertiary-container/10 text-tertiary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md pt-stack-sm border-t border-border">
          <div className="space-y-stack-sm">
            <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="settings-name">
              Full name
            </label>
            <input
              id="settings-name"
              type="text"
              defaultValue={MOCK_USER.name}
              className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="space-y-stack-sm">
            <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="settings-email">
              Email address
            </label>
            <input
              id="settings-email"
              type="email"
              defaultValue={MOCK_USER.email}
              className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end pt-stack-sm">
            <button type="submit" className="shadcn-btn-primary font-label-sm text-sm px-6 py-2.5">
              Save changes
            </button>
          </div>
        </form>
      </section>

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
