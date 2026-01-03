// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLogin from "./login/page";
import AdminDashboard from "@/src/app/admin/AdminDashboard/page";
import BakeryLoader from "@/src/components/BakeryLoader";

export default function AdminRoot() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth") === "true";
    setIsAuthenticated(auth);

    if (!auth) {
      router.replace("/admin");
    }
  }, [router]);

  // 🔹 Bakery loader while checking auth / fetching data
  if (isAuthenticated === null) {
    return <BakeryLoader />;
  }

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}
