// import React from "react";
// import {
//   Cake,
//   Sparkles,
//   Flame,
//   PartyPopper,
// } from "lucide-react";

// export const Header = () => (
//   <div className="relative overflow-hidden flex flex-col items-center text-center py-6 md:py-10 bg-gradient-to-r from-orange-700 via-orange-400 to-orange-800">

//     {/* Decorative floating elements */}
//     <div className="absolute top-4 left-6 animate-bounce">
//       <PartyPopper className="w-8 h-8 text-yellow-200" />
//     </div>

//     <div className="absolute top-6 right-6 animate-pulse">
//       <Sparkles className="w-7 h-7 text-yellow-100" />
//     </div>

//     <div className="absolute bottom-6 left-10 opacity-30 animate-float">
//       <Cake className="w-20 h-20 text-white" />
//     </div>

//     <div className="absolute bottom-8 right-12 opacity-40 animate-float-slow">
//       <Flame className="w-16 h-16 text-yellow-200" />
//     </div>

//     {/* Logo */}
//     <div className="relative z-10">
//       <img
//         src="/logo.png"
//         className="h-20 w-20 md:h-28 md:w-28 rounded-full border-4 border-yellow-200 shadow-xl bg-white"
//         alt="Logo"
//       />
//     </div>

//     {/* Title */}
//     <h1 className="relative z-10 text-3xl md:text-6xl font-medium text-yellow-100 drop-shadow-lg mt-3">
//     𝓑𝒶𝓀𝑒𝓇𝓈 𝒞𝓸𝓇𝓃𝑒𝓇

//     </h1>

//     {/* Tagline */}
//     <h2 className="relative z-10 text-xl md:text-4xl  text-white mt-2 flex items-center gap-2">
//      𝓗𝓸𝓾𝓼𝓮 𝓸𝓯 𝓒𝓪𝓴𝓮𝓼
//       <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
//     </h2>

//     {/* Contact */}
//     <p className="relative z-10 text-black max-w-2xl mt-3 text-sm md:text-lg font-medium">
//       📞 Mob: 9876543210
//     </p>

//     {/* Timings */}
//     <p className="relative z-10 text-yellow-50 max-w-2xl mt-1 text-xs md:text-md italic">
//       ~ Accepting Online Orders : 10:00 AM – 9:00 PM ~
//     </p>

//     {/* Bottom decorative wave */}
//     <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-r from-yellow-200/30 via-white/20 to-yellow-200/30" />
//   </div>
// );

import React from "react";
import {
  Cake,
  Sparkles,
  Flame,
  PartyPopper,
  Balloon,
  Candy,
  Cookie,
} from "lucide-react";
import { greatVibes } from "@/src/app/font";
export const Header = () => (
  <div className="relative overflow-hidden flex flex-col items-center text-center py-4 md:py-12 bg-linear-to-b from-amber-100 via-amber-100 to-amber-300">
    {/* Light wooden texture overlay for bakery warmth */}
    <div
      className="absolute inset-0 opacity-20 bg-repeat"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/880710798/vector/seamless-vector-bakery-pastry-pattern.jpg?s=612x612&w=0&k=20&c=e5TN-lIQoRhqrdIoJhUs_VfhzcmDxEY869s6s1SRYF8=')",
      }}
    ></div>

    {/* Floating Balloons */}
    <div className="absolute top-6 left-6 animate-float">
      <Balloon className="w-12 h-12 text-red-500 rotate-12" />
    </div>
    <div className="absolute top-12 left-20 animate-float-slow">
      <Balloon className="w-10 h-10 text-red-500 -rotate-6" />
    </div>
    <div className="absolute top-2 right-6 animate-float">
      <Balloon className="w-14 h-14 text-red-500 rotate-8" />
    </div>
    <div className="absolute top-16 right-16 animate-float-slow">
      <Balloon className="w-10 h-10 text-red-500 -rotate-1" />
    </div>

    {/* Candles */}
    <div className="absolute bottom-20 left-12 animate-pulse">
      {/* <Flame className="w-10 h-10 text-orange-500" /> */}
    </div>
    <div className="absolute bottom-44 right-4 animate-pulse delay-300">
      <Flame className="w-8 h-8 text-red-500" />
    </div>
    <div className="absolute bottom-22 left-2 animate-pulse delay-500">
      <Flame className="w-8 h-8 text-red-500" />
    </div>

    {/* Bakery icons */}
    <div className="absolute top-20 left-4 opacity-60 animate-bounce-slow">
      <Sparkles className="w-6 h-6 text-amber-700 animate-pulse delay-200" />
    </div>
    <div className="absolute top-40 right-1 opacity-30 ">
      <Candy className="w-8 h-8 text-pink-500" />
    </div>

    <div className="absolute bottom-12 left-4 opacity-50 animate-float-slow">
      <PartyPopper className="w-10 h-10 text-pink-500 rotate-12" />
    </div>
    <div className="absolute bottom-12 right-4 opacity-50 animate-float-slow">
      <PartyPopper className="w-10 h-10 text-pink-500 -rotate-90" />
    </div>

    {/* Sparkles */}
    <div className="absolute top-10 right-32 animate-pulse">
      <Sparkles className="w-8 h-8 text-yellow-300" />
    </div>
    <div className="absolute bottom-32 left-24 animate-pulse">
      <Sparkles className="w-7 h-7 text-yellow-200" />
    </div>

    {/* Logo */}
    <div className="relative z-10">
      <img
        src="/logo2ylw.png"
        className="h-24 w-24 md:h-32 md:w-32 rounded-full "
        alt="Bakers Corner Logo"
      />
    </div>

    {/* Title */}
    <h1
      className={`relative z-10 text-6xl md:text-7xl text-red-700 drop-shadow-2xl mt-1 tracking-wider ${greatVibes.className}`}
      style={{
        textShadow: `
      1px 0 currentColor,
      0 1px currentColor,
      1px 1px currentColor
    `,
      }}
    >
      Bakers Corner
    </h1>

    {/* Tagline */}
    <h2
      className="relative  z-10 text-4xl md:text-5xl text-red-700 mt-1 flex items-center  justify-center great-vibes-regular"
      style={{
        textShadow: `
      1px 0 currentColor,
      0 1px currentColor,
      1px 1px currentColor
    `,
      }}
    >
      House of Cakes
      {/* <Sparkles className="w-8 h-8 text-amber-600 animate-pulse" /> */}
    </h2>

    {/* Contact */}
    <p className="relative z-10 text-pink-800 max-w-2xl mt-1 text-sm md:text-2xl font-semibold bg-amber-50/30 px-6 rounded-full border border-white/10">
      Mob: 6204864794 / 8877018456
    </p>

    {/* Timings */}
    <p className="relative z-10 text-pink-800 max-w-2xl mt-2 text-sm md:text-lg italic font-medium">
      ~ Accepting Online Orders : 10:00 AM – 9:00 PM ~
    </p>

    {/* Bottom decorative wave - soft cream */}
    <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-amber-300/60 via-amber-200/40 to-transparent" />
  </div>
);

// import React from "react";
// import {
//   Cake,
//   Sparkles,
//   Flame,
//   PartyPopper,
//   Balloon,
//   Candy,
//   Cookie,
// } from "lucide-react";

// export const Header = () => (
//   <div className="relative overflow-hidden flex flex-col items-center text-center py-4 md:py-12 bg-gradient-to-b from-pink-50 via-pink-100 to-pink-200">

//     {/* Subtle light wooden texture overlay kept very faint for pink theme */}
//     <div className="absolute inset-0 opacity-10 bg-repeat"
//          style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2zM24 14v4h-4v-4h-2v4h-4v2h4v4h2v-4h4v-2zM12 36v-4h-4v4h-2v-4h-4v-2h4v-4h2v4h4v2z\" fill=\"%23f472b6\"/%3E%3C/g%3E%3C/svg%3E')" }}>
//     </div>

//     {/* Floating Balloons - all in pink shades */}
//     <div className="absolute top-8 left-8 animate-float">
//       <Balloon className="w-12 h-12 text-pink-400 rotate-12" />
//     </div>
//     <div className="absolute top-12 left-20 animate-float-slow">
//       <Balloon className="w-10 h-10 text-pink-300 -rotate-6" />
//     </div>
//     <div className="absolute top-6 right-12 animate-float">
//       <Balloon className="w-14 h-14 text-pink-500 rotate-45" />
//     </div>
//     <div className="absolute top-16 right-8 animate-float-slow">
//       <Balloon className="w-9 h-9 text-pink-600 -rotate-12" />
//     </div>
//     <div className="absolute top-24 left-12 animate-float">
//       <Balloon className="w-11 h-11 text-rose-400 rotate-20" />
//     </div>

//     {/* Bakery icons - pink themed */}

//     <div className="absolute top-32 right-4 opacity-50 animate-bounce">
//       <Candy className="w-12 h-12 text-pink-500" />
//     </div>

//     <div className="absolute bottom-16 right-6 opacity-30 animate-float-slow">
//       <PartyPopper className="w-14 h-14 text-pink-600 rotate-12" />
//     </div>

//     {/* Sparkles - pink & rose tones */}
//     <div className="absolute top-10 right-32 animate-pulse opacity-15">
//       <Sparkles className="w-8 h-8 text-pink-300" />
//     </div>
//     <div className="absolute bottom-32 left-8 animate-pulse opacity-15">
//       <Sparkles className="w-7 h-7 text-rose-300" />
//     </div>
//     <div className="absolute top-32 left-8 animate-pulse delay-200 opacity-15">
//       <Sparkles className="w-6 h-6 text-pink-400" />
//     </div>

//     {/* Logo */}
//     <div className="relative z-10">
//       <img
//         src="/logo2.png"
//         className="h-40 w-40 md:h-48 md:w-48 rounded-full"
//         alt="Bakers Corner Logo"
//       />
//     </div>

//     {/* Title */}
//     <h1 className="relative z-10 text-3xl md:text-7xl font-bold text-pink-900 drop-shadow-2xl mt-1 tracking-wider">
//       𝓑𝒶𝓀𝑒𝓇𝓈 𝒞𝓸𝓇𝓃𝑒𝓇
//     </h1>

//     {/* Tagline */}
//     <h2 className="relative z-10 text-xl md:text-5xl text-pink-800 mt-3 flex items-center gap-3 justify-center">
//       𝓗𝓸𝓾𝓼𝓮 𝓸𝓯 𝓒𝓪𝓴𝓮𝓼
//       <Sparkles className="w-8 h-8 text-pink-500 animate-pulse opacity-15" />
//       <Sparkles className="w-6 h-6 text-rose-400 animate-pulse delay-200 opacity-15" />
//     </h2>

//     {/* Contact */}
//     <p className="relative z-10 text-pink-900 max-w-2xl mt-3 text-lg md:text-2xl font-semibold">
//       📞 Mob: 0000000000
//     </p>

//     {/* Timings */}
//     <p className="relative z-10 text-pink-700 max-w-2xl mt-2 text-sm md:text-lg italic font-medium">
//       ~ Accepting Online Orders : 10:00 AM – 9:00 PM ~
//     </p>

//     {/* Bottom decorative wave - soft pink */}
//     <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-pink-300/60 via-pink-200/40 to-transparent" />
//   </div>
// );

// import React from "react";
// import {
//   Cake,
//   Sparkles,
//   Flame,
//   PartyPopper,
//   Balloon,
//   Candy,
//   Cookie,
//   UtensilsCrossed,
// } from "lucide-react";

// export const Header = () => (
//   <div className="relative overflow-hidden flex flex-col items-center text-center py-4 md:py-4 bg-[#f6cdb2]">

//     {/* Wooden Texture Background Overlay */}
//     <div
//       className="absolute inset-0 opacity-20 bg-repeat"
//       style={{
//         backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")`,
//         backgroundColor: "#5c4033"
//       }}
//     ></div>

//     {/* Gradient Overlay for depth */}
//     <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/40" />

//     {/* Floating Icons - Warm Earthy Tones */}
//     <div className="absolute top-8 left-8 animate-float opacity-40">
//       <Cookie className="w-12 h-12 text-amber-200 rotate-12" />
//     </div>
//     <div className="absolute top-24 left-20 animate-float-slow opacity-30">
//       <UtensilsCrossed className="w-10 h-10 text-orange-200 -rotate-6" />
//     </div>
//     <div className="absolute top-6 right-12 animate-float opacity-40">
//       <Cake className="w-14 h-14 text-amber-300 rotate-12" />
//     </div>
//     <div className="absolute top-20 right-24 animate-float-slow opacity-25">
//       <Flame className="w-8 h-8 text-orange-400" />
//     </div>
//     <div className="absolute bottom-24 left-12 animate-float opacity-30">
//       <Cookie className="w-11 h-11 text-amber-400 rotate-45" />
//     </div>

//    {/* Floating Balloons - all in pink shades */}

//      <div className="absolute top-12 left-6 animate-float-slow opacity-60">
//       <Balloon className="w-10 h-10 text-amber-700 -rotate-6" />
//        <Balloon className="w-14 h-14 text-amber-600 rotate-45" />
//      </div>
//      <div className="absolute top-16 right-8 animate-float-slow opacity-60">
//       <Balloon className="w-9 h-9 text-amber-600 -rotate-12" />
//        <Balloon className="w-11 h-11 text-amber-700 rotate-20" />
//     </div>

//     {/* Bakery icons */}
//     <div className="absolute top-32 right-4 opacity-40 animate-bounce ">
//       <Candy className="w-12 h-12 text-amber-500" />
//     </div>

//     {/* Logo with a wooden-border effect */}
//     <div className="relative z-10  rounded-full  ">
//       <img
//         src="/logo2.png"
//         className="h-40 w-32 md:h-48 md:w-48 rounded-full"
//         alt="Bakers Corner Logo"
//       />
//     </div>

//     {/* Title - Warm Cream/Gold Tones */}
//     <h1 className="relative z-10 text-4xl md:text-7xl font-bold text-amber-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mt-1 tracking-wider">
//       𝓑𝒶𝓀𝑒ry Point
//     </h1>

//     {/* Tagline */}
//     <h2 className="relative z-10 text-xl md:text-5xl text-amber-200/90 mt-1 flex items-center gap-3 justify-center">
//       <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
//       𝓗𝓸𝓾𝓼𝓮 𝓸𝓯 𝓒𝓪𝓴𝓮𝓼
//       <Sparkles className="w-6 h-6 text-amber-400 animate-pulse delay-200" />
//     </h2>

//     {/* Contact */}
//     <p className="relative z-10 text-amber-100 max-w-2xl mt-1 text-sm md:text-2xl font-semibold bg-black/20 px-6 py-1 rounded-full border border-white/10">
//       📞 Mob: 0000000000
//     </p>

//     {/* Timings */}
//     <p className="relative z-10 text-amber-200/70 max-w-2xl mt-1  text-sm md:text-lg italic font-medium">
//       — Freshly Baked Daily: 10:00 AM – 9:00 PM —
//     </p>

//     {/* Bottom decorative "Countertop" shadow */}
//     <div className="absolute bottom-0 left-0 w-full h-8 bg-amber-950/40 blur-sm" />
//   </div>
// );
