"use client";

import React, { useState , useEffect } from "react";
import { CategorySidebar } from "@/src/components/CategorySidebar";
import { ProductItem } from "@/src/components/ProductItem";
import { Cart } from "@/src/components/Cart";
import { PageViewsCounter } from "@/src/components/PageViewsCounter";
import { VegFilter } from "@/src/components/VegFilter";
import  ProductItemFetcher from "@/src/components/ProductItemFetcher";
import { Header } from "./Header";
import { Footer } from "./Footer";
import BakeryLoader from "./BakeryLoader";

// Skeleton loader
const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl bg-white shadow-md border border-gray-200">
    <div className="h-56 bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
      <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
    </div>
  </div>
);

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "veg" | "nonveg">("all");

  // Show bakery loader only on initial page load (no category selected yet)
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Simulate initial load - remove delay if you have real data loading logic
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // If still in initial loading state → show bakery loader
  if (isInitialLoading && !activeCategory) {
    return <BakeryLoader />;
  }
  return (
    <section className="min-h-screen bg-gradlinearient-to-b from-orange-100 to-yellow-100">

      {/* Header */}
      {/* <div className="text-center py-6 bg-linear-to-r from-orange-800 via-yellow-600 to-yellow-800 text-white"> */}
       
        <Header/>
      {/* </div> */}

      {/* Veg Filter */}
      <VegFilter filter={filter} setFilter={setFilter} />

      {/* Layout */}
      <div className="bg-orange-50 max-w-7xl mx-auto px-3 py-6 flex gap-2">

        {/* Sidebar */}
        <CategorySidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Products Grid */}
        <div className="flex-1">
          {/* <h2 className="text-3xl font-bold text-gray-800">
            {activeCategory ? "" : "Loading..."}
          </h2> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {activeCategory ? (
              <ProductItemFetcher categoryId={activeCategory} filter={filter} />
            ) : (
              Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
            )}
          </div>
        </div>
      </div>

      {/* Cart */}
      <Cart />

      {/* Page Views */}
      <PageViewsCounter />
      <Footer/>
    </section>
  );
}
