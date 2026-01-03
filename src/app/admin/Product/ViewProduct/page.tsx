// app/admin/adminpanel/components/ViewProductDialog.tsx
"use client";

import React from "react";
import { X, Package, IndianRupee, Clock, FileText, Eye, Camera, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";

type Product = {
  id: string;
  name: string;
  price: number;
  halfPrice?: number | null;
  quantity?: string;
  description?: string;
  imageUrl?: string;
  imageUrls?: string[];
  isVeg: boolean;
  createdAt?: { toDate(): Date } | null;
};

interface ViewProductDialogProps {
  product: Product;
}

export default function ViewProductDialog({ product }: ViewProductDialogProps) {
  const [open, setOpen] = React.useState(false);

  // Use first image from imageUrls or fallback to imageUrl
  const displayImage = product.imageUrls?.[0] || product.imageUrl || null;
  const totalImages = (product.imageUrls?.length || 0) + (product.imageUrl ? 1 : 0);

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return "N/A";
    return timestamp.toDate().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] w-full overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {product.name}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={product.isVeg ? "default" : "destructive"}
              className={`${
                product.isVeg
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              <div className="w-2 h-2 mr-1.5 rounded-full bg-white" />
              {product.isVeg ? "Veg" : "Non-Veg"}
            </Badge>
            {totalImages > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Camera className="h-3 w-3" />
                {totalImages} {totalImages === 1 ? "photo" : "photos"}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Main Image */}
          {displayImage ? (
            <div className="relative">
              <img
                src={displayImage}
                alt={product.name}
                className="w-full h-64 object-cover rounded-xl shadow-lg border"
              />
              {totalImages > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                  +{totalImages - 1} more
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
              <Package className="h-20 w-20 text-gray-400" />
            </div>
          )}

          {/* All Images Grid (if multiple) */}
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">All Images</h4>
              <div className="grid grid-cols-4 gap-3">
                {product.imageUrls.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-28 object-cover rounded-lg border hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => {
                      // Optional: click to enlarge
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="p-5 space-y-3 bg-linear-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <IndianRupee className="h-6 w-6 text-yellow-700" />
                <div>
                  <p className="text-sm text-gray-600">Full Price</p>
                  <p className="text-2xl font-bold text-gray-800">₹{product.price}</p>
                </div>
              </div>
            </Card>

            {product.halfPrice && (
              <Card className="p-5 space-y-3 bg-linear-to-br from-teal-50 to-cyan-50 border-teal-200">
                <div className="flex items-center gap-3">
                  <IndianRupee className="h-6 w-6 text-teal-700" />
                  <div>
                    <p className="text-sm text-gray-600">Half Price</p>
                    <p className="text-2xl font-bold text-gray-800">₹{product.halfPrice}</p>
                  </div>
                </div>
              </Card>
            )}

            {product.quantity && (
              <Card className="p-5 space-y-3 bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-blue-700" />
                  <div>
                    <p className="text-sm text-gray-600">Serves</p>
                    <p className="text-xl font-semibold text-gray-800">{product.quantity}</p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-5 space-y-3 bg-linear-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-purple-700" />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="text-lg font-medium text-gray-800">
                    {formatDate(product.createdAt)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Description */}
          {product.description && (
            <Card className="p-5 bg-gray-50 border">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Description</p>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setOpen(false)} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}