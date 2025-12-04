"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

// 1. ISOLATE LOGIC: Put useSearchParams inside a separate component
function AuthCallbackLogic() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {
      // 1. Save Token
      localStorage.setItem("token", token);
      
      // 2. Save User Data (Crucial for Topbar name)
      const userObject = { 
        name: name || "User", 
        email: email || "" 
      }; 
      localStorage.setItem("user", JSON.stringify(userObject));
      
      // 3. Redirect
      router.replace("/dashboard");
    } else {
      // Handle error or missing token
      const error = params.get("error");
      if (error) {
          router.replace(`/login?error=${error}`);
      } else {
          // Wait a moment in case params populate slowly, otherwise redirect
           const timeout = setTimeout(() => router.replace("/login"), 3000);
           return () => clearTimeout(timeout);
      }
    }
  }, [params, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-4 bg-white">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Authenticating...</p>
    </div>
  );
}

// 2. MAIN PAGE: Wrap the logic in Suspense
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <AuthCallbackLogic />
    </Suspense>
  );
}