// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLogin from "./login/page";
import AdminDashboard from "@/src/app/admin/AdminDashboard/page";

export default function AdminRoot() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth") === "true";
    setIsAuthenticated(auth);

    if (!auth) {
      router.replace("/admin"); // stay on /admin → shows login
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-600 to-red-600 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading Admin Panel...</div>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}