import { AuthVisualPanel } from "@/components/auth/auth-visual-panel";

export function AuthLayout({ children, type }: { children: React.ReactNode, type: "login"| 'signup' }) {
  return (
    <div className="min-h-screen bg-on-surface text-surface flex items-center justify-center font-body-md overflow-hidden">
      <div className="w-full min-h-screen flex flex-col md:flex-row relative">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-gutter z-10 bg-on-surface/95 backdrop-blur-md relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
          </div>
          <div className="w-full max-w-[420px] fade-in-up">{children}</div>
        </div>

        {/* Right Side: Visuals */}
        <AuthVisualPanel type={type} />
      </div>
    </div>
  );
}
