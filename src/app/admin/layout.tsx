"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth") === "true";
    setIsAuth(auth);

    // 🔐 If not authenticated & not on login page → redirect to login
    if (!auth && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }

    // 🚀 If authenticated & trying to access login → go to dashboard
    if (auth && pathname === "/admin/login") {
      router.replace("/admin/AdminDashboard");
    }
  }, [router, pathname]);

  // ⏳ Prevent flicker while checking auth
  if (isAuth === null) return null;

  return <>{children}</>;
}
