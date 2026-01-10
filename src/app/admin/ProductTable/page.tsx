// app/admin/adminpanel/components/ProductRow.tsx
"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

import EditProductDialog from "../Product/Edit Product/page";
import DeleteDialog from "../DeleteDialog/page";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import type { Product } from "@/src/types/Product";   // ← Use the central type!

interface ProductRowProps {
  categoryId: string;
  product: Product;
}

export default function ProductRow({ categoryId, product }: ProductRowProps) {
  const primaryImage = product.imageUrls?.[0] ?? product.imageUrl ?? "";
  const totalImages = (product.imageUrls?.length ?? 0) + (product.imageUrl ? 1 : 0);

  // Helper to safely get quantities array (handles both formats)
  const getQuantities = (): Array<{
    quantity: string;
    cakePrice: number;
    birthdayPackPrice?: number | null;
  }> => {
    // Modern format
    if (Array.isArray(product.quantities) && product.quantities.length > 0) {
      return product.quantities;
    }

    // Legacy format fallback
    if (product.price != null) {
      return [
        {
          quantity: product.quantity ?? "Standard",
          cakePrice: Number(product.price) || 0,
          birthdayPackPrice: product.halfPrice ?? null,
        },
      ];
    }

    // Ultimate fallback
    return [{ quantity: "—", cakePrice: 0 }];
  };

  const quantities = getQuantities();

  // Sort by price (lowest first)
  const sortedQuantities = [...quantities].sort((a, b) => a.cakePrice - b.cakePrice);
  const firstQuantity = sortedQuantities[0];

  const hasBirthdayPackOption = quantities.some(
    (q) => typeof q.birthdayPackPrice === "number" && q.birthdayPackPrice > 0
  );

  // Quantity labels for display
  const quantityLabels = quantities
    .map((q) => q.quantity.trim())
    .filter(Boolean);

  const quantityDisplay =
    quantityLabels.length === 1
      ? quantityLabels[0]
      : quantityLabels.length > 3
        ? `${quantityLabels.slice(0, 3).join(", ")} +${quantityLabels.length - 3} more`
        : quantityLabels.join(", ") || "—";

  const isLegacy = !Array.isArray(product.quantities) && product.price != null;

  return (
    <tr className="border-b hover:bg-orange-50/60 transition-colors duration-200">
      {/* Product Name */}
      <td className="px-4 py-4">
        <div className="font-medium text-gray-900 max-w-xs">
          {product.name}
          {isLegacy && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Legacy
            </Badge>
          )}
        </div>
      </td>

      {/* Starting Price */}
      <td className="px-4 py-4 text-center">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-green-700">
            ₹{firstQuantity.cakePrice || "—"}
          </span>
          {hasBirthdayPackOption && (
            <span className="text-xs text-blue-600 mt-1">+ Pack available</span>
          )}
        </div>
      </td>

      {/* Quantity Options */}
      <td className="px-4 py-4 text-center">
        <div className="max-w-xs mx-auto">
          <span
            className="text-sm font-medium text-gray-700 block truncate"
            title={quantityLabels.join(", ")}
          >
            {quantityDisplay}
          </span>
          {quantities.length > 1 && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {quantities.length} sizes
            </Badge>
          )}
        </div>
      </td>

      {/* Veg / Non-Veg */}
      <td className="px-4 py-4">
        <div className="flex justify-center">
          <Badge
            variant={product.isVeg ? "default" : "destructive"}
            className={`px-3 py-1.5 font-medium ${
              product.isVeg ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            } text-white`}
          >
            <div className="w-2 h-2 mr-1.5 rounded-full bg-white" />
            {product.isVeg ? "VEG" : "NON-VEG"}
          </Badge>
        </div>
      </td>

      {/* Images */}
      <td className="px-4 py-4">
        <div className="flex justify-center">
          {primaryImage ? (
            <div className="relative group">
              <img
                src={primaryImage}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 shadow-sm transition-transform group-hover:scale-110"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />
              {totalImages > 1 && (
                <div className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  {totalImages}
                </div>
              )}
            </div>
          ) : (
            <div className="w-14 h-14 bg-gray-100 border-2 border-dashed rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-2">
          <EditProductDialog categoryId={categoryId} product={product} />

          <DeleteDialog
            title="Delete Product"
            description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
            onConfirm={async () => {
              try {
                await deleteDoc(doc(db, "categories", categoryId, "products", product.id));
              } catch (err) {
                console.error("Delete failed:", err);
                alert("Failed to delete product");
              }
            }}
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DeleteDialog>
        </div>
      </td>
    </tr>
  );
}