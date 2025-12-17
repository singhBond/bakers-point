// components/menu/PageViewsCounter.tsx
"use client";

import React, { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, increment } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Eye } from "lucide-react";

export const PageViewsCounter = () => {
  const [totalViews, setTotalViews] = useState<number>(0);

  useEffect(() => {
    // Count only once per session
    const hasViewed = sessionStorage.getItem("hasViewedMenu");
    if (!hasViewed) {
      const viewsRef = doc(db, "settings", "pageViews");
      setDoc(viewsRef, { count: increment(1) }, { merge: true }).catch(console.error);
      sessionStorage.setItem("hasViewedMenu", "true");
    }

    // Listen to real-time updates
    const unsub = onSnapshot(doc(db, "settings", "pageViews"), (snap) => {
      if (snap.exists() && typeof snap.data()?.count === "number") {
        setTotalViews(snap.data().count);
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className=" my-6 left-0 right-0 bg-linear-to-t from-black/90 to-black/70 text-white z-50 backdrop-blur-sm py-1">
      <div className="flex items-center justify-center gap-2 text-sm md:text-lg font-semibold">
        <Eye className="w-5 h-5 text-yellow-400" />
        <span>Total Visits:</span>
        <span className="text-yellow-400 text-lg md:text-2xl font-bold">
          {totalViews.toLocaleString()}
        </span>
        <span className="hidden md:inline text-gray-300">people love our menu!</span>
      </div>
    </div>
  );
};