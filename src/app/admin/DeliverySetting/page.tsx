// app/admin/adminpanel/components/DeliveryChargeSettings.tsx
"use client";

import React, { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import { Bike, Pencil } from "lucide-react";

export default function DeliveryChargeSettings() {
  const [deliveryCharge, setDeliveryCharge] = useState<number>(50);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState<string>("");

  // Listen to real-time delivery charge from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "deliveryCharge"), (snap) => {
      if (snap.exists() && typeof snap.data()?.amount === "number") {
        const amount = snap.data().amount;
        setDeliveryCharge(amount);
        setTempValue(amount.toString());
      } else {
        // Default fallback if not set
        setDeliveryCharge(50);
        setTempValue("50");
      }
    });

    return () => unsub();
  }, []);

  const handleSave = async () => {
    const value = parseInt(tempValue, 10);

    if (isNaN(value) || value < 0) {
      alert("Please enter a valid amount (0 or more)");
      return;
    }

    try {
      await setDoc(
        doc(db, "settings", "deliveryCharge"),
        { amount: value },
        { merge: true }
      );
      setDeliveryCharge(value);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update delivery charge:", err);
      alert("Failed to save. Check console for error.");
    }
  };

  const handleCancel = () => {
    setTempValue(deliveryCharge.toString());
    setIsEditing(false);
  };

  return (
    <Card className="mb-8 p-6 bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Icon + Info */}
        <div className="flex items-center gap-4">
          <Bike className="h-12 w-12 text-emerald-600" />
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Delivery Charge</h3>
            <p className="text-sm text-gray-600">
              This amount is added to every online (delivery) order
            </p>
          </div>
        </div>

        {/* Right: Amount + Edit */}
        <div className="flex items-center gap-4">
          {isEditing ? (
            <>
              <Input
                type="number"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-32 text-xl font-bold text-emerald-700 text-center"
                autoFocus
                min="0"
              />
              <Button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <span className="text-5xl font-extrabold text-emerald-700">
                ₹{deliveryCharge}
              </span>
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                onClick={() => {
                  setTempValue(deliveryCharge.toString());
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-5 w-5 mr-2" />
                Change
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}