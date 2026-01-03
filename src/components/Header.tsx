// components/menu/Header.tsx
import React from "react";

export const Header = () => (
  <div className="flex flex-col items-center text-center py-4 bg-linear-to-r from-orange-700 via-orange-300 to-orange-800">
    <img src="/logo.png" className="h-20 rounded-full" alt="Logo" />
    <h1 className="text-3xl md:text-6xl font-extrabold text-yellow-100">
      Baker's Point
    </h1>
    <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">
      Fast • Tasty • Fresh
    </h2>
    <p className="text-black max-w-2xl mt-3 text-sm md:text-lg">Mob:9876543210</p>
    <p className="text-yellow-50 max-w-2xl mt-1 text-xs md:text-md">
      ~Accepting Online Order : 10:00 AM - 9:00 PM~
    </p>
  </div>
);
