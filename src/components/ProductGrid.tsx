// components/menu/ProductGrid.tsx
"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/src/lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { ProductItem } from "./ProductItem";

interface Product {
  id: string;
  name: string;
  price: number;
  halfPrice?: number;
  imageUrl?: string;
  imageUrls?: string[];
  isVeg: boolean;
}

export const ProductGrid = ({
  categoryId,
  filter,
  onProductClick,
}: {
  categoryId: string;
  filter: "all" | "veg" | "nonveg";
  onProductClick: (p: Product) => void;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);

    const q = query(collection(db, "categories", categoryId, "products"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => {
        const item = d.data();
        const imageUrls = item.imageUrls || (item.imageUrl ? [item.imageUrl] : []);

        return {
          id: d.id,
          name: item.name || "Unnamed",
          price: item.price || 0,
          halfPrice: item.halfPrice,
          imageUrl: item.imageUrl,
          imageUrls: imageUrls.filter(Boolean),
          isVeg: item.isVeg ?? true,
        } as Product;
      });

      setProducts(data);
      setLoading(false);
    });

    return () => unsub();
  }, [categoryId]);

  const filtered = products.filter((p) => {
    if (filter === "veg") return p.isVeg;
    if (filter === "nonveg") return !p.isVeg;
    return true;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 border-2 border-dashed rounded-2xl h-80 animate-pulse"
            />
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
      {filtered.map((p) => (
        <ProductItem
          key={p.id}
          product={p}
          onClick={() => onProductClick(p)}
        />
      ))}
    </div>
  );
};
