import { cn } from "@/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  error?: string;
}

export function AuthInput({ label, icon, id, error, className, ...props }: AuthInputProps) {
  return (
    <div className="space-y-stack-sm">
      <label className="block font-label-sm text-label-sm text-surface-variant" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full bg-inverse-surface border border-outline/30 rounded-lg py-3 pl-10 pr-4 text-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/20 transition-all shadow-inner",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="font-label-sm text-label-sm text-error">{error}</p>}
    </div>
  );
}
