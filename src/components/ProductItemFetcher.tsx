// components/menu/ProductItemFetcher.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ProductItem } from "./ProductItem";
import { db } from "@/src/lib/firebase";
import { collection, query, onSnapshot, DocumentData } from "firebase/firestore";

interface QuantityOption {
  quantity: string;
  cakePrice: number;
  birthdayPackPrice?: number | null;
}

// Updated Product Interface to match new admin structure
interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  imageUrls?: string[];
  quantities: QuantityOption[]; // Required: array of sizes/prices
  isVeg: boolean;
}

interface ProductItemFetcherProps {
  categoryId: string;
  categoryName?: string;
  filter: "all" | "veg" | "nonveg";
}

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl bg-white shadow-md border border-gray-200 animate-pulse">
    <div className="h-56 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
      <div className="h-8 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

export default function ProductItemFetcher({
  categoryId,
  categoryName = "Menu",
  filter = "all",
}: ProductItemFetcherProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "categories", categoryId, "products"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items: Product[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;

          // Handle new structure with quantities array
          let quantities: QuantityOption[] = [];

          if (Array.isArray(data.quantities)) {
            quantities = data.quantities.map((q: any) => ({
              quantity: q.quantity?.trim() || "Standard",
              cakePrice: Number(q.cakePrice) || 0,
              birthdayPackPrice:
                q.birthdayPackPrice !== null && q.birthdayPackPrice !== undefined
                  ? Number(q.birthdayPackPrice)
                  : null,
            }));
          }

          // Fallback: If no quantities array (old product format), create one from price/halfPrice
          if (quantities.length === 0) {
            const fallbackPrice = Number(data.price) || 0;
            const fallbackHalf = data.halfPrice ? Number(data.halfPrice) : null;

            quantities = [
              {
                quantity: data.quantity || "Standard",
                cakePrice: fallbackPrice,
                birthdayPackPrice: fallbackHalf,
              },
            ];
          }

          // Filter out invalid quantities
          quantities = quantities.filter((q) => q.cakePrice > 0 && q.quantity);

          // Default to one empty if somehow still invalid
          if (quantities.length === 0) {
            quantities = [{ quantity: "1 Portion", cakePrice: 0 }];
          }

          return {
            id: doc.id,
            name: data.name || "Unnamed Item",
            description: data.description || undefined,
            imageUrl: data.imageUrl || undefined,
            imageUrls: Array.isArray(data.imageUrls)
              ? data.imageUrls.filter(Boolean)
              : data.imageUrl
              ? [data.imageUrl]
              : [],
            quantities,
            isVeg: data.isVeg ?? true,
          };
        });

        // Sort products by name for consistent display (optional)
        items.sort((a, b) => a.name.localeCompare(b.name));

        setProducts(items);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [categoryId]);

  // Apply veg/non-veg filter
  const filteredProducts = products.filter((p) => {
    if (filter === "veg") return p.isVeg;
    if (filter === "nonveg") return !p.isVeg;
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <>
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
      </>
    );
  }

  // Empty state
  if (filteredProducts.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.5m-9.5 0H4" />
          </svg>
        </div>
        <p className="text-xl font-medium text-gray-700">
          {filter === "all"
            ? "No items in this category yet."
            : filter === "veg"
            ? "No vegetarian items available."
            : "No non-vegetarian items available."}
        </p>
        <p className="text-gray-500 mt-2">Check back later for updates!</p>
      </div>
    );
  }

  return (
    <>
      {/* Category Header */}
      {categoryName && (
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800  flex items-center gap-3 col-span-full">
          {categoryName}
          <span className="text-sm font-normal text-gray-500">
            ({filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"})
          </span>
        </h2>
      )}

      {/* Product Grid */}
      {filteredProducts.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
        />
      ))}
    </>
  );
}