// app/admin/adminpanel/components/ProductSkeletonRow.tsx
import React from "react";

export default function ProductSkeletonRow() {
  return (
    <tr className="border-b hover:bg-orange-50/30 transition-colors">
      {/* Product Name + Image Placeholder */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
      </td>

      {/* Full Price */}
      <td className="px-4 py-4 text-center">
        <div className="h-7 bg-gray-200 rounded w-20 mx-auto animate-pulse" />
      </td>

      {/* Half Price */}
      <td className="px-4 py-4 text-center">
        <div className="h-6 bg-gray-200 rounded w-16 mx-auto animate-pulse" />
      </td>

      {/* Veg/Non-Veg Badge */}
      <td className="px-4 py-4">
        <div className="flex justify-center">
          <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </td>

      {/* Serves */}
      <td className="px-4 py-4 text-center">
        <div className="h-5 bg-gray-200 rounded w-24 mx-auto animate-pulse" />
      </td>

      {/* Image Preview */}
      <td className="px-4 py-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-14 h-14 bg-gray-200 rounded-lg animate-pulse" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-300 rounded-full animate-pulse" />
          </div>
        </div>
      </td>

      {/* Action Buttons */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-2">
          <div className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </td>
    </tr>
  );
}