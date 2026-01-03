// src/components/loaders/BakeryLoader.tsx
"use client";

import { CakeSlice, Croissant, Coffee, Wheat, Cake, Dessert, Popcorn, Microwave } from "lucide-react";

export default function BakeryLoader() {
  return (
    <div className="fixed inset-0 min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-100 flex flex-col items-center justify-center z-50">
      {/* Bánh mì + croissant + cà phê + lúa mì bay lơ lửng */}
      <div className="relative w-64 h-48">
        <Dessert className="absolute top-8 left-4 w-12 h-12 text-amber-700 animate-bounce [animation-delay:0ms]" />
        < Cake className="absolute top-4 left-20 w-16 h-16 text-yellow-700 animate-bounce [animation-delay:200ms]" />
        <CakeSlice className="absolute top-12 right-8 w-14 h-14 text-orange-600 animate-bounce [animation-delay:400ms]" />
        <Popcorn className="absolute bottom-8 left-12 w-12 h-12 text-amber-800 animate-bounce [animation-delay:600ms]" />
      </div>

      {/* Oven "baking" animation */}
      <div className="mt- flex items-center gap-3">
  <div className="w-32 h-20 bg-linear-to-r from-orange-400 to-orange-700 rounded-lg shadow-2xl relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-t from-orange-600/50 to-transparent animate-pulse" />

    {/* Microwave icon */}
    <Microwave
      className="absolute inset-0 m-auto w-32 h-24 text-yellow-200 animate- "
    />

    <div className="absolute inset-x-0 bottom-0 h-8 bg-orange-500/30 animate-pulse [animation-delay:300ms]" />
  </div>
</div>


      {/* Text vui nhộn */}
      <div className="mt-8 text-center">
        <p className="text-3xl font-bold text-orange-800 tracking-wide">
          Baking fresh goodies...
        </p>
        <p className="text-lg text-amber-700 mt-2 animate-pulse">
          Just a few seconds, the oven is hot!
        </p>
      </div>

      {/* Dots bouncing */}
      <div className="flex gap-2 mt-6">
        {[0, 150, 300].map((delay) => (
          <div
            key={delay}
            className="w-3 h-3 bg-orange-600 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}