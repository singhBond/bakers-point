// "use client";

// import React from "react";
// import { Button } from "@/src/components/ui/button";
// import { LogOut } from "lucide-react";

// interface AdminLayoutProps {
//   children: React.ReactNode;
// }

// export default function AdminLayout({ children }: AdminLayoutProps) {
//   const handleLogout = () => {
//     sessionStorage.removeItem("adminAuth");
//     window.location.href = "/admin/login";
//   };

//   return (
//     <section className="min-h-screen bg-linear-to-b from-yellow-700 to-yellow-100 p-4 md:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-yellow-50">
//             Admin – Raj Restro
//           </h1>

//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-yellow-50 hover:text-yellow-900"
//             onClick={handleLogout}
//           >
//             <LogOut className="mr-2 h-5 w-5" />
//             Logout
//           </Button>
//         </div>

//         {children}
//       </div>
//     </section>
//   );
// }
