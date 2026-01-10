// app/admin/adminpanel/components/EditProductDialog.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Upload, X, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Switch } from "@/src/components/ui/switch";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import type { Product } from "@/src/types/Product";

// Local type alias matching your Product.quantities structure
type QuantityItem = {
  quantity: string;
  cakePrice: number;
  birthdayPackPrice?: number | null;
};

// Image Compression (unchanged)
const compressImage = (file: File): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => (img.src = e.target?.result as string);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      let { width, height } = img;
      const MAX = 1200;

      if (width > height && width > MAX) {
        height = (height * MAX) / width;
        width = MAX;
      } else if (height > MAX) {
        width = (width * MAX) / height;
        height = MAX;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.9;

      const compressLoop = () => {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const sizeKB = (dataUrl.length * 0.75) / 1024;

        if (sizeKB < 500 || quality <= 0.1) {
          resolve(dataUrl);
        } else {
          quality -= 0.1;
          setTimeout(compressLoop, 0);
        }
      };

      compressLoop();
    };

    img.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });

// DragDropUpload (same as AddProductDialog)
const DragDropUpload: React.FC<{
  onImagesChange: (imgs: string[]) => void;
  previews: string[];
  onRemove: (i: number) => void;
  disabled?: boolean;
}> = ({ onImagesChange, previews, onRemove, disabled = false }) => {
  const [drag, setDrag] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || disabled) return;

    const compressed = await Promise.all([...files].map(compressImage));
    const valid = compressed.filter(Boolean) as string[];

    if (valid.length > 0) onImagesChange(valid);
  };

  return (
    <div className="space-y-4">
      <input
        id="edit-prod-img"
        type="file"
        hidden
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />

      <div className="flex flex-wrap items-end gap-3">
        {previews.map((src, i) => (
          <div key={i} className="relative group">
            <img
              src={src}
              alt="preview"
              className="w-28 h-28 object-cover rounded-md border border-gray-200"
            />
            <button
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              onClick={() => onRemove(i)}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <div
          className={`flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
            drag ? "border-yellow-500 bg-yellow-50" : "border-gray-300 hover:border-yellow-500"
          } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
          onDragOver={(e) => {
            if (disabled) return;
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            if (disabled) return;
            e.preventDefault();
            setDrag(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => !disabled && document.getElementById("edit-prod-img")?.click()}
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="mt-1 text-xs text-gray-600">
            {previews.length ? "Add more" : "Upload"}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500">Auto-compressed under 500KB</p>
    </div>
  );
};

interface EditProductDialogProps {
  categoryId: string;
  product: Product;
}

export default function EditProductDialog({ categoryId, product }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state — auto-filled from product
  const [name, setName] = useState(product.name || "");
  const [desc, setDesc] = useState(product.description || "");
  const [isVeg, setVeg] = useState(product.isVeg ?? true);
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<QuantityItem[]>([]);

  // Auto-fill when dialog opens
  useEffect(() => {
    if (!open) return;

    setName(product.name || "");
    setDesc(product.description || "");
    setVeg(product.isVeg ?? true);

    // Images
    const existingImages =
      product.imageUrls?.filter(Boolean) ?? (product.imageUrl ? [product.imageUrl] : []);
    setImages(existingImages);
    setPreviews(existingImages);

    // Quantities loading (support both modern and legacy)
    let loaded: QuantityItem[] = [];

    // Modern format (preferred)
    if (Array.isArray(product.quantities) && product.quantities.length > 0) {
      loaded = product.quantities.map((q) => ({
        quantity: String(q.quantity ?? "").trim() || "",
        cakePrice: Number(q.cakePrice) || 0,
        birthdayPackPrice: q.birthdayPackPrice ?? null,
      }));
    }
    // Legacy fallback (if quantities is null/empty but price exists)
    else if (product.price != null) {
      loaded = [
        {
          quantity: String(product.quantity ?? "").trim(),
          cakePrice: Number(product.price) || 0,
          birthdayPackPrice: product.halfPrice ?? null,
        },
      ];
    }

    // Safety net — always have at least one row
    if (loaded.length === 0) {
      loaded = [{ quantity: "", cakePrice: 0, birthdayPackPrice: null }];
    }

    setQuantities(loaded);
  }, [open, product]);

  const addImages = (newImages: string[]) => {
    setImages((prev) => [...prev, ...newImages]);
    setPreviews((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addQuantityRow = () => {
    setQuantities((prev) => [...prev, { quantity: "", cakePrice: 0, birthdayPackPrice: null }]);
  };

  const updateQuantity = (
    index: number,
    field: keyof QuantityItem,
    value: string
  ) => {
    setQuantities((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              [field]:
                field === "cakePrice" || field === "birthdayPackPrice"
                  ? value === "" ? null : Number(value) || 0
                  : value.trim(),
            }
          : q
      )
    );
  };

  const removeQuantity = (index: number) => {
    if (quantities.length === 1) {
      alert("At least one quantity option is required.");
      return;
    }
    setQuantities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("Name is required");
    if (quantities.some((q) => !q.quantity.trim() || q.cakePrice <= 0)) {
      return alert("All quantities must have a label and valid cake price (>0)");
    }

    setLoading(true);

    try {
      await updateDoc(doc(db, "categories", categoryId, "products", product.id), {
        name: name.trim(),
        description: desc.trim() || null,
        quantities: quantities.map((q) => ({
          quantity: q.quantity.trim(),
          cakePrice: q.cakePrice,
          birthdayPackPrice: q.birthdayPackPrice ?? null,
        })),
        imageUrls: images.length ? images : null,
        imageUrl: images[0] || null,
        isVeg,
        // Clean legacy fields
        price: null,
        halfPrice: null,
        quantity: null,
        updatedAt: new Date(),
      });

      setOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            All existing details are pre-filled automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Name */}
          <div className="space-y-1">
            <Label>Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="Enter Item Name"
            />
          </div>

          {/* Quantities & Prices */}
          <div className="space-y-3">
            <Label>Quantities & Prices *</Label>
            {quantities.map((q, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-4">
                  <Input
                    placeholder="e.g. 2 Pound, 1 Pc"
                    value={q.quantity}
                    onChange={(e) => updateQuantity(i, "quantity", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs">Cake Price *</Label>
                  <Input
                    type="number"
                    placeholder="Cake Price"
                    value={q.cakePrice || ""}
                    onChange={(e) => updateQuantity(i, "cakePrice", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs">Birthday Pack Price</Label>
                  <Input
                    type="number"
                    placeholder="Birthday Pack Price"
                    value={q.birthdayPackPrice ?? ""}
                    onChange={(e) => updateQuantity(i, "birthdayPackPrice", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeQuantity(i)}
                    disabled={loading || quantities.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              size="sm"
              variant="outline"
              onClick={addQuantityRow}
              disabled={loading}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Quantity
            </Button>
          </div>

          {/* Veg Switch */}
          <div className="flex items-center space-x-3">
            <Switch checked={isVeg} onCheckedChange={setVeg} disabled={loading} />
            <Label className="font-medium">
              {isVeg ? <span className="text-green-600">Veg</span> : <span className="text-red-600">Non-Veg</span>}
            </Label>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description (Optional)</Label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              disabled={loading}
              placeholder="Enter Item Description here"
            />
          </div>

          {/* Images */}
          <div className="space-y-1">
            <Label>Images</Label>
            <DragDropUpload
              previews={previews}
              onImagesChange={addImages}
              onRemove={removeImage}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={
              loading ||
              !name.trim() ||
              quantities.some((q) => !q.quantity.trim() || q.cakePrice <= 0)
            }
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}