// components/menu/Cart.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Store,
  Bike,
  X,
  Package,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number; // total price per item (cake + pack if selected)
  cakePrice: number;
  birthdayPackPrice?: number;
  quantity: number;
  serves: string; // e.g., "1kg", "500g"
  withBirthdayPack?: boolean;
  isVeg: boolean;
  imageUrl?: string;
}

export const Cart = () => {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderMode, setOrderMode] = useState<"offline" | "online">("offline");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("");
  const deliveryCharge = 50;

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fastfood_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCart(parsed);
      } catch (e) {
        console.error("Failed to parse cart", e);
        localStorage.removeItem("fastfood_cart");
      }
    }
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("fastfood_cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("fastfood_cart");
    }
  }, [cart]);

  // Listen for external cart updates (from ProductItem)
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("fastfood_cart");
      if (saved) {
        try {
          setCart(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener("cartUpdated", handleUpdate);
    return () => window.removeEventListener("cartUpdated", handleUpdate);
  }, []);

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item, i) =>
          i === index
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = orderMode === "online" ? subtotal + deliveryCharge : subtotal;

  const clearCart = () => {
    setCart([]);
    setOpen(false);
  };

  const sendWhatsAppOrder = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Please enter your name and phone number!");
      return;
    }
    if (orderMode === "online" && !address.trim()) {
      alert("Please enter delivery address!");
      return;
    }

    let message = `*New Order* 🍰%0A%0A`;
    message += `*Customer:* ${name.trim()}%0A`;
    message += `*Phone:* ${phone.trim()}%0A`;

    if (notes.trim()) message += `*Notes:* ${notes.trim()}%0A`;
    if (orderMode === "online") {
      message += `*Address:* ${address.trim()}%0A`;
      message += `*Delivery Charge:* +₹${deliveryCharge}%0A`;
    } else {
      message += `*Mode:*  Takeaway%0A`;
    }

    message += `%0A*Order Details:*%0A`;

    cart.forEach((item) => {
      const packText = item.withBirthdayPack ? " + Birthday Pack" : "";
      message += `• ${item.quantity}x ${item.name}%0A`;
      message += `   Qty: ${item.serves}${packText}%0A`;
      if (item.withBirthdayPack && item.birthdayPackPrice) {
        message += `    (Cake ₹${item.cakePrice}  +Birthday Pack ₹${item.birthdayPackPrice})%0A`;
      }
      message += `   Price: ₹${item.price * item.quantity}%0A%0A`;
    });

    message += `*Subtotal:* ₹${subtotal}%0A`;
    if (orderMode === "online") message += `*Delivery:* ₹${deliveryCharge}%0A`;
    message += `*TOTAL:* ₹${total}%0A%0AThank you for your order! 🎉`;

    const whatsappUrl = `https://wa.me/916204864794?text=${message}`;
    window.open(whatsappUrl, "_blank");
    clearCart();
  };

  // Prevent browser back when pressing Escape or clicking outside
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
      // Prevent history back
      window.history.pushState(null, "", window.location.href);
    }
  };

  // Handle browser back button – keep dialog open
  useEffect(() => {
    if (open) {
      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        setOpen(false);
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [open]);

  return (
    <main>
      {/* Floating Cart Button */}
      <div
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-6 z-50 cursor-pointer group"
      >
        <div className="relative bg-amber-700 hover:bg-amber-900 text-white p-4 rounded-full shadow-2xl border-2 border-white transition-all group-hover:scale-110">
          <ShoppingCart size={32} />
          {totalItems > 0 && (
            <span className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full min-w-9 h-9 flex items-center justify-center font-bold text-sm animate-pulse shadow-lg">
              {totalItems}
            </span>
          )}
        </div>
      </div>

      {/* Cart Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-0">
          <DialogHeader className="p-4 px-10 pb-3 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
            <DialogTitle className="text-xl font-bold flex items-center justify-between">
              <span className="flex items-center gap-3">
                <ShoppingCart size={28} />
                Your Cart ({totalItems})
              </span>
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={() => setOpen(false)}
                className="h-11 w-11 sm:h-11 sm:w-11"
              >
                <X size={24} className="text-gray-600 " />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <ShoppingCart size={80} className="mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium">Your cart is empty</p>
                <p className="text-sm mt-2">Explore our delicious cakes!</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-2 px-3 sm:px-0">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="
        mx-auto
        w-full max-w-3xl
        flex gap-3 sm:gap-4
        bg-gray-50
        rounded-2xl
        px-6 py-3 sm:p-4
        border border-gray-200
      "
                    >
                      {/* Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24  rounded-xl overflow-hidden shrink-0 bg-gray-200">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            (e.currentTarget.src = "/placeholder.svg")
                          }
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-bold text-base sm:text-lg text-gray-800 truncate">
                              {item.name}
                            </h4>

                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs sm:text-sm font-medium bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full">
                                {item.serves}
                              </span>

                              {item.withBirthdayPack && (
                                <span className="text-xs sm:text-sm font-medium bg-orange-100 text-orange-700 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                                  <Package size={14} />+ Pack
                                </span>
                              )}

                              <div
                                className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-md flex items-center justify-center ${
                                  item.isVeg
                                    ? "border-green-600 bg-green-500"
                                    : "border-red-600 bg-red-500"
                                }`}
                              >
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            </div>

                            <div className="mt-2 text-xs sm:text-sm text-gray-600">
                              {item.withBirthdayPack &&
                              item.birthdayPackPrice ? (
                                <>
                                  <span>Cake ₹{item.cakePrice}</span>
                                  <span className="mx-2">+</span>
                                  <span>Pack ₹{item.birthdayPackPrice}</span>
                                </>
                              ) : (
                                <span>₹{item.cakePrice} (Cake Only)</span>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            className="shrink-0"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </Button>
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(index, -1)}
                            >
                              <Minus size={14} />
                            </Button>

                            <span className="w-10 sm:w-12 text-center font-bold text-base sm:text-lg">
                              {item.quantity}
                            </span>

                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(index, 1)}
                            >
                              <Plus size={14} />
                            </Button>
                          </div>

                          <span className="font-bold text-lg sm:text-xl ml-4 text-green-600">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Mode */}
                <div className="bg-gray-100 rounded-2xl p-2 mx-3">
                  <p className="font-semibold mb-3">Order Type</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={orderMode === "offline" ? "green" : "outline"}
                      className="h-14"
                      onClick={() => setOrderMode("offline")}
                    >
                      <Store size={22} className="" />
                      Takeaway
                    </Button>
                    <Button
                      variant={orderMode === "online" ? "orange" : "outline"}
                      className="h-14"
                      onClick={() => setOrderMode("online")}
                    >
                      <Bike size={22} className="" />
                      Delivery (+₹50)
                    </Button>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4 mx-4">
                  <div className="space-y-1">
                    <Label>Your Name *</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Phone Number *</Label>
                    <Input
                      value={phone}
                      type="number"
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your mobile number..."
                    />
                  </div>
                  {orderMode === "online" && (
                    <div className="space-y-1">
                      <Label>Delivery Address *</Label>
                      <Textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Full address with landmark..."
                        rows={3}
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label>Special Instructions (Optional)</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="E.g., Less sweet, add cream, message on cake..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 mx-4  border-2 border-yellow-300">
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg">
                      <span>Subtotal</span>
                      <span className="font-bold">₹{subtotal}</span>
                    </div>
                    {orderMode === "online" && (
                      <div className="flex justify-between text-lg">
                        <span>Delivery Charge</span>
                        <span className="text-blue-600 font-bold">
                          +₹{deliveryCharge}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-2xl font-bold text-green-600 pt-4 border-t-2 border-dashed">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order */}
                <div className="w-full flex justify-center px-4 mt-6">
                  <Button
                    size="lg"
                    className="
      w-full max-w-sm
      h-14
      text-lg sm:text-xl
      font-bold
      bg-green-600 hover:bg-green-700
      shadow-lg
      rounded-xl
    "
                    onClick={sendWhatsAppOrder}
                    disabled={
                      !name ||
                      !phone ||
                      cart.length === 0 ||
                      (orderMode === "online" && !address)
                    }
                  >
                    Place Order via WhatsApp
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};
