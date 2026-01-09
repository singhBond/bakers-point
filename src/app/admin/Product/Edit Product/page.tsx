// app/admin/adminpanel/components/EditProductDialog.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Upload, X, Trash2 } from "lucide-react";
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
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

// Image compression utility (unchanged)
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

// Updated DragDropUpload – inline with previews
const DragDropUpload: React.FC<{
  onImagesChange: (imgs: string[]) => void;
  previews: string[];
  onRemove: (i: number) => void;
}> = ({ onImagesChange, previews, onRemove }) => {
  const [drag, setDrag] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

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
      />

      <div className="flex flex-wrap items-end gap-3">
        {previews.map((src, i) => (
          <div key={i} className="relative group">
            <img
              src={src}
              alt="preview"
              className="w-28 h-28 object-cover rounded-md border"
            />
            <button
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              onClick={() => onRemove(i)}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <div
          className={`flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed rounded-md cursor-pointer transition ${
            drag ? "border-yellow-500 bg-yellow-50" : "border-gray-300 hover:border-yellow-500"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => document.getElementById("edit-prod-img")?.click()}
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

type QuantityPrice = {
  quantity: string;
  cakePrice: number;
  birthdayPackPrice?: number | null;
};

interface EditProductDialogProps {
  categoryId: string;
  products: {
    id: string;
    name: string;
    description?: string | null;
    quantities?: QuantityPrice[] | null;
    imageUrls?: string[] | null;
    imageUrl?: string;
    isVeg: boolean;
    // Legacy fields
    price?: number;
    halfPrice?: number | null;
    quantity?: string;
  };
}

export default function EditProductDialog({
  categoryId,
  products,
}: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(products.name);
  const [description, setDescription] = useState(products.description || "");
  const [isVeg, setIsVeg] = useState(products.isVeg);

  const [quantities, setQuantities] = useState<QuantityPrice[]>([]);

  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Initialize form when dialog opens
  useEffect(() => {
    if (open && products) {
      setName(products.name);
      setDescription(products.description || "");
      setIsVeg(products.isVeg);

      // Initialize quantities – handle legacy or new format
      let initialQuantities: QuantityPrice[] = [];

      if (products.quantities && products.quantities.length > 0) {
        initialQuantities = products.quantities.map((q) => ({
          quantity: q.quantity,
          cakePrice: q.cakePrice,
          birthdayPackPrice: q.birthdayPackPrice ?? undefined,
        }));
      } else if (products.price !== undefined) {
        // Legacy fallback
        initialQuantities = [
          {
            quantity: products.quantity || "Standard",
            cakePrice: products.price,
            birthdayPackPrice: products.halfPrice ?? undefined,
          },
        ];
      } else {
        // New item or empty
        initialQuantities = [{ quantity: "1kg", cakePrice: 0 }];
      }

      setQuantities(initialQuantities);

      // Initialize images
      const existingImages =
        products.imageUrls?.filter(Boolean) ||
        (products.imageUrl ? [products.imageUrl] : []);
      setImages(existingImages);
      setPreviews(existingImages);
    }
  }, [open, products]);

  const addImages = (imgs: string[]) => {
    setImages((p) => [...p, ...imgs]);
    setPreviews((p) => [...p, ...imgs]);
  };

  const removeImage = (i: number) => {
    setImages((p) => p.filter((_, x) => x !== i));
    setPreviews((p) => p.filter((_, x) => x !== i));
  };

  const addQuantityRow = () => {
    setQuantities((prev) => [
      ...prev,
      { quantity: "", cakePrice: 0, birthdayPackPrice: undefined },
    ]);
  };

  const updateQuantity = (
    index: number,
    field: keyof QuantityPrice,
    value: any
  ) => {
    setQuantities((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              [field]:
                field === "cakePrice" || field === "birthdayPackPrice"
                  ? Number(value) || 0
                  : value,
            }
          : q
      )
    );
  };

  const removeQuantity = (index: number) => {
    if (quantities.length === 1) {
      alert("At least one quantity is required.");
      return;
    }
    setQuantities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("Name is required");
    if (quantities.some((q) => !q.quantity.trim() || q.cakePrice <= 0)) {
      return alert("All quantities must have a label and valid cake price");
    }

    setIsLoading(true);

    try {
      await updateDoc(
        doc(db, "categories", categoryId, "products", products.id),
        {
          name: name.trim(),
          description: description.trim() || null,
          quantities: quantities.map((q) => ({
            quantity: q.quantity.trim(),
            cakePrice: q.cakePrice,
            birthdayPackPrice: q.birthdayPackPrice || null,
          })),
          imageUrls: images.length > 0 ? images : null,
          imageUrl: images[0] || "",
          isVeg,
        }
      );

      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setIsLoading(false);
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
            Update product details. Only cake + birthday pack price of selected quantity is shown to customers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Name */}
          <div className="space-y-1">
            <Label>Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
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
                    placeholder="e.g., 1kg, 500g"
                    value={q.quantity}
                    onChange={(e) => updateQuantity(i, "quantity", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs">Cake Price *</Label>
                  <Input
                    type="number"
                    placeholder="Cake only"
                    value={q.cakePrice || ""}
                    onChange={(e) => updateQuantity(i, "cakePrice", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs">Birthday Pack Price</Label>
                  <Input
                    type="number"
                    placeholder="Optional"
                    value={q.birthdayPackPrice || ""}
                    onChange={(e) =>
                      updateQuantity(i, "birthdayPackPrice", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeQuantity(i)}
                    disabled={isLoading}
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
              disabled={isLoading}
            >
              Add Quantity
            </Button>
          </div>

          {/* Veg Switch */}
          <div className="flex items-center space-x-3">
            <Switch checked={isVeg} onCheckedChange={setIsVeg} disabled={isLoading} />
            <Label className="font-medium">
              {isVeg ? <span className="text-green-600">Veg</span> : <span className="text-red-600">Non-Veg</span>}
            </Label>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description (Optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Images */}
          <div className="space-y-1">
            <Label>Images</Label>
            <DragDropUpload
              previews={previews}
              onImagesChange={addImages}
              onRemove={removeImage}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isLoading ||
              !name.trim() ||
              quantities.some((q) => !q.quantity.trim() || q.cakePrice <= 0)
            }
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {isLoading ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}