import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.8Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.31 24 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.27a12 12 0 0 0 0 10.74l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.63l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

const FEATURES = [
  "AI-tailored CVs matched to each job",
  "Live job scraping from SA boards",
  "One-click cover letter generation",
  "Application pipeline tracking",
];

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in successfully");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(message);
    } finally {
      setGoogleSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        toast.success("Signed in successfully");
      } else {
        await signUpWithEmail(email, password);
        toast.success("Account created successfully");
      }
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[52%] bg-brand-600 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-[#c4680a] opacity-90" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />

        <div className="relative z-10">
          <img
            src="/CareergateLogo.png"
            alt="CareerGate"
            className="h-10 w-auto object-contain brightness-0 invert"
          />
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-snug">
              Land your next<br />South African job<br />with AI.
            </h1>
            <p className="mt-4 text-white/70 text-base leading-relaxed max-w-xs">
              CareerGate automates the most tedious parts of your job search — so you can focus on getting hired.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white/80 shrink-0" />
                <span className="text-white/80 text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-white/40 text-xs">
          CareerGate · Built for South African job seekers
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <img
            src="/CareergateLogo.png"
            alt="CareerGate"
            className="h-10 w-auto object-contain mx-auto"
          />
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === "signin"
                ? "Sign in to continue to CareerGate"
                : "Start your AI-powered job search"}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={googleSubmitting}
            onClick={handleGoogleSignIn}
            className="w-full gap-2"
          >
            {googleSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="h-px flex-1 bg-gray-200" />
            or continue with email
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-brand-600 hover:bg-brand-700 text-white w-full"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "signin" ? "Signing in…" : "Creating account…"}
                </span>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-brand-600 hover:underline font-medium"
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-brand-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
