export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-2 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-error">
      <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
      <p className="font-body-md text-sm">{message}</p>
    </div>
  );
}
