// app/admin/adminpanel/components/AddCategoryDialog.tsx
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
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

// ── Image Compression (same as before) ──
const compressImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => (img.src = e.target?.result as string);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      let { width, height } = img;
      const MAX_DIM = 1200;

      if (width > height && width > MAX_DIM) {
        height = Math.round((height * MAX_DIM) / width);
        width = MAX_DIM;
      } else if (height > MAX_DIM) {
        width = Math.round((width * MAX_DIM) / height);
        height = MAX_DIM;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.9;
      const TARGET_KB = 500 * 1024;

      const tryCompress = () => {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const byteLength = Math.round((dataUrl.length * 3) / 4);

        if (byteLength < TARGET_KB || quality <= 0.1) {
          resolve(dataUrl);
        } else {
          quality = Math.max(quality - 0.1, 0.1);
          setTimeout(tryCompress, 0);
        }
      };

      tryCompress();
    };

    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Format name helper
const formatName = (raw: string) =>
  raw
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

// ── Drag & Drop Upload Component ──
const CategoryImageUpload: React.FC<{
  preview: string;
  onImageChange: (compressed: string) => void;
  onRemove: () => void;
}> = ({ preview, onImageChange, onRemove }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.[0]) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      const compressed = await compressImage(file);
      onImageChange(compressed);
    } catch {
      alert("Failed to process image. Try another one.");
    }
  };

  return (
    <div className="space-y-3">
      <Label>Category Image <span className="text-red-500">*</span></Label>

      <input
        id="category-image-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Category preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-green-500 shadow-sm"
          />
          <button
            onClick={onRemove}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg opacity-90 hover:opacity-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-yellow-500 bg-yellow-50/50"
              : "border-gray-300 hover:border-yellow-500 hover:bg-gray-50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => document.getElementById("category-image-input")?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-base font-medium text-gray-700">
            Drag & drop or click to upload
          </p>
          <p className="mt-1 text-sm text-gray-500">
            PNG, JPG, WEBP • Auto-compressed to ~500KB
          </p>
        </div>
      )}
    </div>
  );
};

export default function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (compressed: string) => {
    setImage(compressed);
    setPreview(compressed);
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Category name is required.");
      return;
    }
    if (!image) {
      alert("Category image is required.");
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "categories"), {
        name: formatName(name),
        imageUrl: image,
        createdAt: serverTimestamp(),
        // Optional: you can add more fields later
        // productCount: 0,
        // isActive: true,
      });

      setName("");
      removeImage();
      setOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setName("");
          removeImage();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-md rounded-xl px-4 py-6 sm:px-6 sm:py-8">
        <DialogHeader>
          <DialogTitle>Add New Menu Category</DialogTitle>
          <DialogDescription>
            Create categories like "Cakes", "Cookies", "Pastry" etc.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="cat-name">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cakes, Pastry, Cookies"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Image Upload with Drag & Drop */}
          <CategoryImageUpload
            preview={preview}
            onImageChange={handleImageChange}
            onRemove={removeImage}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !name.trim() || !image}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {isLoading ? "Adding..." : "Add Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}