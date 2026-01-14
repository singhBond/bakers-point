// components/menu/ProductItem.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Minus, X } from "lucide-react";
import dynamic from "next/dynamic";

// ── Client-only DescriptionWithReadMore to prevent hydration mismatch ──
const DescriptionWithReadMore = dynamic(
  () =>
    Promise.resolve(({ text }: { text: string }) => {
      const [isExpanded, setIsExpanded] = useState(false);
      const maxLength = 120;

      if (!text || text.length <= maxLength) {
        return (
          <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
        );
      }

      return (
        <div className="text-sm text-gray-700 leading-relaxed">
          <p>
            {isExpanded ? text : `${text.slice(0, maxLength)}...`}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-orange-600 font-medium hover:underline"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          </p>
        </div>
      );
    }),
  { ssr: false }
);

interface QuantityOption {
  quantity: string;
  cakePrice: number;
  birthdayPackPrice?: number | null;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  imageUrls?: string[];
  quantities: QuantityOption[];
  isVeg: boolean;
}

interface ProductItemProps {
  product: Product;
  onClick?: () => void;
}

export const ProductItem = ({ product, onClick }: ProductItemProps) => {
  const [open, setOpen] = useState(false);
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(1);
  const [withBirthdayPack, setWithBirthdayPack] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedQuantityIndex, setSelectedQuantityIndex] = useState(0);

  // Reset on dialog open
  useEffect(() => {
    if (open) {
      setTempQuantity(1);
      setWithBirthdayPack(false);
      setCurrentImageIndex(0);
      setSelectedQuantityIndex(0);
    }
  }, [open]);

  if (!product.quantities || product.quantities.length === 0) {
    return null;
  }

  const selectedQty = product.quantities[selectedQuantityIndex];
  const hasBirthdayPackOption =
    selectedQty.birthdayPackPrice !== null &&
    selectedQty.birthdayPackPrice !== undefined;

  const basePrice = selectedQty.cakePrice;
  const addOnPrice =
    withBirthdayPack && hasBirthdayPackOption
      ? selectedQty.birthdayPackPrice!
      : 0;
  const currentPrice = basePrice + addOnPrice;
  const totalPrice = currentPrice * tempQuantity;

  const getImageArray = () => {
    return product.imageUrls?.length
      ? product.imageUrls.filter(Boolean)
      : product.imageUrl
      ? [product.imageUrl]
      : ["/placeholder.svg"];
  };

  const images = getImageArray();
  const firstImage = images[0];

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("fastfood_cart") || "[]");
    const newItem = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      quantity: tempQuantity,
      isVeg: product.isVeg,
      imageUrl: firstImage,
      serves: selectedQty.quantity,
      withBirthdayPack: withBirthdayPack && hasBirthdayPackOption,
      cakePrice: basePrice,
      birthdayPackPrice: hasBirthdayPackOption
        ? selectedQty.birthdayPackPrice
        : undefined,
    };

    const existingIndex = cart.findIndex(
      (i: any) =>
        i.id === newItem.id &&
        i.serves === newItem.serves &&
        i.withBirthdayPack === newItem.withBirthdayPack
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += tempQuantity;
    } else {
      cart.push(newItem);
    }

    localStorage.setItem("fastfood_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    const toast = document.createElement("div");
    toast.innerText = `Added ${tempQuantity}x ${product.name} (${
      selectedQty.quantity
    }${withBirthdayPack ? " + Pack" : ""})!`;
    toast.className =
      "fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);

    setOpen(false);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    } else {
      setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    }
  };

  const displayPriceForCard =
    product.quantities[0].cakePrice +
    (product.quantities[0].birthdayPackPrice || 0);

  // Prevent browser back when main dialog is open
  useEffect(() => {
    if (open) {
      window.history.pushState(null, "", window.location.href);

      const handlePopState = (e: PopStateEvent) => {
        setOpen(false);
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [open]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Product Card */}
      <div
        onClick={() => {
          onClick?.();
          setOpen(true);
        }}
        className="overflow-hidden rounded-2xl bg-orange-100 shadow-md shadow-orange-200 hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-orange-300 relative group"
      >
        <div className="absolute top-3 left-3 z-10">
          <div
            className={`w-6 h-6 border-2 rounded-sm flex items-center justify-center ${
              product.isVeg
                ? "border-green-600 bg-green-500"
                : "border-red-600 bg-red-500"
            }`}
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="relative w-full h-56 bg-gray-100">
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
          />
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-bold text-green-600">
              ₹{displayPriceForCard}
            </span>
            {product.quantities.length > 1 && (
              <span className="text-sm text-gray-500">Starting price</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Product Detail Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-full w-full h-full md:max-w-2xl md:h-auto md:max-h-[85vh] rounded-none md:rounded-2xl p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-4 md:p-6 pb-2 shrink-0 border-b">
            <DialogTitle className="text-lg md:text-2xl font-bold flex items-center gap-3 pr-10">
              {product.name}
              <div
                className={`w-6 h-6 border-2 rounded-sm flex items-center justify-center ${
                  product.isVeg
                    ? "border-green-600 bg-green-500"
                    : "border-red-600 bg-red-500"
                }`}
              >
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-3 py-1">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Image Section */}
              <div
                className="relative w-full md:w-1/2 h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden shrink-0 cursor-pointer group"
                onClick={() => setFullImageOpen(true)}
              >
                <img
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${product.name} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-4 py-2 rounded-full">
                    Click to enlarge
                  </span>
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage("prev");
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage("next");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Details Section */}
              <div className="flex-1 flex flex-col justify-between px-2 md:px-0">
                <div className="space-y-4">
                  {product.description && (
                    <div className="relative bg-gray-50 border-l-4 border-orange-400 rounded-lg p-3">
                      <span className="absolute -top-2 -left-1 text-5xl text-orange-300 font-serif">
                        “
                      </span>
                      <p className="italic text-gray-700 leading-relaxed font-serif">
                        <DescriptionWithReadMore text={product.description} />
                      </p>
                      <span className="absolute -bottom-7 right-2 text-5xl text-orange-300 font-serif">
                        ”
                      </span>
                    </div>
                  )}

                  <div>
                    <p className="text-md font-medium text-gray-700 mb-1">
                      Select Quantity:
                    </p>
                    <div className="grid grid-cols-4 md:grid-cols-3 gap-6">
                      {product.quantities.map((qty, index) => (
                        <Button
                          key={index}
                          variant={
                            selectedQuantityIndex === index
                              ? "default"
                              : "outline"
                          }
                          className={`h-10 w-18 text-sm font-medium rounded-xl ${
                            selectedQuantityIndex === index
                              ? "bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg"
                              : "border-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedQuantityIndex(index);
                            setWithBirthdayPack(false);
                          }}
                        >
                          {qty.quantity}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {hasBirthdayPackOption && (
                    <div>
                      <p className="text-md font-medium text-gray-700 mb-1">
                        Pack Type:
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant={!withBirthdayPack ? "amber" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => setWithBirthdayPack(false)}
                        >
                          Cake Only
                          <span className="ml-2 text-sm opacity-80">
                            ₹{basePrice}
                          </span>
                        </Button>
                        <Button
                          variant={withBirthdayPack ? "amber" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => setWithBirthdayPack(true)}
                        >
                          + Birthday Pack
                          <span className="ml-2 text-sm opacity-80">
                            ₹{selectedQty.birthdayPackPrice}
                          </span>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 mt-6">
                    <div>
                      <p className="text-3xl font-bold text-green-600">
                        ₹{totalPrice.toFixed(0)}
                      </p>
                      {withBirthdayPack && hasBirthdayPackOption && (
                        <p className="text-sm text-gray-500">
                          Cake ₹{basePrice} + Pack ₹
                          {selectedQty.birthdayPackPrice}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 whitespace-nowrap">
                        Qty:
                      </span>
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() =>
                            setTempQuantity(Math.max(1, tempQuantity - 1))
                          }
                        >
                          <Minus size={18} />
                        </Button>
                        <span className="w-14 text-center font-bold text-lg">
                          {tempQuantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => setTempQuantity(tempQuantity + 1)}
                        >
                          <Plus size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-7 text-lg mt-3 rounded-xl shadow-lg"
                    onClick={addToCart}
                  >
                    Add to Cart • ₹{totalPrice.toFixed(0)}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Screen Image Viewer */}
      <Dialog open={fullImageOpen} onOpenChange={setFullImageOpen}>
        <DialogContent className="max-w-full w-full h-full p-0 bg-black border-none rounded-none">
          <button
            onClick={() => setFullImageOpen(false)}
            className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-black/70 p-3 rounded-full transition"
          >
            <X size={28} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`${product.name} - full view`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-4 rounded-full transition"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-4 rounded-full transition"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};