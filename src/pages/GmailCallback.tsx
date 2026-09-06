import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gmailApi, GMAIL_REDIRECT_URI } from "@/lib/api";

export default function GmailCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<"working" | "done" | "error">("working");
  const [message, setMessage] = useState("Connecting your Gmail account...");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = params.get("code");
    const error = params.get("error");

    if (error || !code) {
      setState("error");
      setMessage(
        error === "access_denied"
          ? "You cancelled the Gmail connection."
          : "Google did not return a sign-in code. Please try again."
      );
      return;
    }

    gmailApi
      .exchange(code, GMAIL_REDIRECT_URI)
      .then((res) => {
        setState("done");
        setMessage(`Gmail connected${res.email ? ` as ${res.email}` : ""}.`);
        setTimeout(() => navigate("/settings"), 1600);
      })
      .catch((e: unknown) => {
        setState("error");
        setMessage(e instanceof Error ? e.message : "Could not connect Gmail.");
      });
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center space-y-4">
        {state === "working" && <Loader2 className="w-6 h-6 animate-spin text-brand-600 mx-auto" />}
        {state === "done" && <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />}
        {state === "error" && <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />}
        <p className="text-sm text-gray-700">{message}</p>
        {state !== "working" && (
          <Button size="sm" variant="outline" onClick={() => navigate("/settings")}>
            Back to settings
          </Button>
        )}
      </div>
    </div>
  );
}
