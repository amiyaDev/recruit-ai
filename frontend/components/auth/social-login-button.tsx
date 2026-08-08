import { GoogleIcon } from "@/components/auth/google-icon";

export function SocialLoginButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="w-full py-3 rounded-lg font-body-md text-body-md font-medium text-surface bg-inverse-surface border border-outline/30 hover:bg-outline/10 hover:border-outline/50 transition-all flex items-center justify-center gap-3"
    >
      <GoogleIcon className="w-5 h-5" />
      {label}
    </button>
  );
}
