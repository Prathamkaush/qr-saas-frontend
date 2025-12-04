"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");
    const name = params.get("name");

    if (token) {
      localStorage.setItem("token", token);
      
      // 🔥 FIX: Create a fake user object to match Email Login format
      const userObject = { name: name || "User", email: "" }; 
      localStorage.setItem("user", JSON.stringify(userObject));
      
      router.replace("/dashboard");
    } else {
      router.replace("/login?error=missing_token");
    }
  }, [params, router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-xl font-semibold">Finalizing secure login...</p>
    </div>
  );
}