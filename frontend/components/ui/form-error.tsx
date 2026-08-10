// Dashboard/settings counterpart to components/auth/form-error.tsx — uses
// the theme-aware shadcn `destructive` token instead of the MD3 `error`
// token, matching how the rest of the dashboard (e.g. DeleteAccountButton)
// signals errors, since dashboard pages flip with the light/dark toggle
// while the auth pages use a fixed-dark palette.
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">
      <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
      <p className="font-body-md text-sm">{message}</p>
    </div>
  );
}
