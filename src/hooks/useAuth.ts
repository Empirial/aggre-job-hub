import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/auth";

export const DEMO_MODE_KEY = "cg_demo_mode";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(DEMO_MODE_KEY) === "1") {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isDemo = sessionStorage.getItem(DEMO_MODE_KEY) === "1";
  return { user, loading, isDemo };
}
