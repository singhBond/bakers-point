// app/admin/adminpanel/components/AddProductDialog.tsx
"use client";

import React, { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

// Image Compression
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

// Upload Box
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
      {/* Upload Box */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
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
        onClick={() => document.getElementById("add-prod-img")?.click()}
      >
        <Upload className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-sm text-gray-700">
          {previews.length ? "Add more images" : "Click or drag images here"}
        </p>
        <p className="text-xs text-gray-500">Auto-compressed under 500KB</p>
      </div>

      <input
        id="add-prod-img"
        type="file"
        hidden
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative group">
              <img src={src} className="w-full h-28 object-cover rounded-md border" />

              <button
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                onClick={() => onRemove(i)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AddProductDialog({ categoryId }: { categoryId: string }) {
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [halfPrice, setHalfPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState("1");
  const [desc, setDesc] = useState("");
  const [isVeg, setVeg] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const addImages = (imgs: string[]) => {
    setImages((p) => [...p, ...imgs]);
    setPreviews((p) => [...p, ...imgs]);
  };

  const removeImage = (i: number) => {
    setImages((p) => p.filter((_, x) => x !== i));
    setPreviews((p) => p.filter((_, x) => x !== i));
  };

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Name required");
    if (!price || price <= 0) return alert("Full price required");

    setLoad(true);

    try {
      await addDoc(collection(db, "categories", categoryId, "products"), {
        name: name.trim(),
        price: Number(price),
        halfPrice: halfPrice ? Number(halfPrice) : null,
        quantity,
        description: desc.trim() || null,
        imageUrls: images.length ? images : null,
        imageUrl: images[0] || "",
        isVeg,
        createdAt: serverTimestamp(),
      });

      // Reset
      setName("");
      setPrice("");
      setHalfPrice("");
      setQuantity("1");
      setDesc("");
      setVeg(true);
      setImages([]);
      setPreviews([]);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add");
    } finally {
      setLoad(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
          <Plus className="mr-1 h-4 w-4" /> Add Item
        </Button>
      </DialogTrigger>

      {/* Dialog */}
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
          <DialogDescription>Half price & description optional.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Name */}
          <div>
            <Label>Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} disabled={load} />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Full Price *</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                disabled={load}
              />
            </div>
            <div>
              <Label>Half Price</Label>
              <Input
                type="number"
                value={halfPrice}
                onChange={(e) => setHalfPrice(e.target.value ? Number(e.target.value) : "")}
                disabled={load}
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <Label>Serve for</Label>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={load}
            />
          </div>

          {/* Veg */}
          <div className="flex items-center space-x-3">
            <Switch checked={isVeg} onCheckedChange={setVeg} disabled={load} />
            <Label>{isVeg ? "Veg" : "Non-Veg"}</Label>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              disabled={load}
            />
          </div>

          {/* Images */}
          <div>
            <Label>Images</Label>

            <DragDropUpload
              previews={previews}
              onImagesChange={addImages}
              onRemove={removeImage}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={load}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={load || !name.trim() || !price}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {load ? "Adding…" : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
