// app/admin/adminpanel/components/EditCategoryDialog.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Pencil, X, Upload } from "lucide-react";
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
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

// ── Image Compression ──
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
        const byteSize = Math.round((dataUrl.length * 3) / 4);

        if (byteSize < TARGET_KB || quality <= 0.1) {
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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

type Category = {
  id: string;
  name?: string;
  imageUrl?: string;
};

interface EditCategoryDialogProps {
  category: Category;
}

// ── Drag & Drop Image Upload Component ──
const CategoryImageEdit: React.FC<{
  currentPreview: string;
  onImageChange: (compressed: string) => void;
  onRemove: () => void;
}> = ({ currentPreview, onImageChange, onRemove }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentPreview);

  useEffect(() => {
    setPreview(currentPreview);
  }, [currentPreview]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.[0]) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setPreview(compressed);
      onImageChange(compressed);
    } catch {
      alert("Failed to process image");
    }
  };

  return (
    <div className="space-y-3">
      <Label>Category Image <span className="text-red-500">*</span></Label>

      <input
        id="edit-category-image"
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
            onClick={() => {
              setPreview("");
              onRemove();
            }}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg opacity-90 hover:opacity-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-yellow-500 bg-yellow-50/60"
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
          onClick={() => document.getElementById("edit-category-image")?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-base font-medium text-gray-700">
            Drag & drop or click to upload new image
          </p>
          <p className="mt-1 text-sm text-gray-500">
            PNG, JPG, WEBP • Will be compressed to ~500KB
          </p>
        </div>
      )}
    </div>
  );
};

export default function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category.name || "");
  const [image, setImage] = useState<string | null>(category.imageUrl || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(category.name || "");
      setImage(category.imageUrl || null);
    }
  }, [open, category]);

  const handleImageChange = (compressed: string) => {
    setImage(compressed);
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Category name is required");
      return;
    }
    if (!image) {
      alert("Category image is required");
      return;
    }

    setIsLoading(true);
    try {
      await updateDoc(doc(db, "categories", category.id), {
        name: formatName(name),
        imageUrl: image,
        // Optional: add updatedAt if you want to track changes
        // updatedAt: serverTimestamp(),
      });

      setOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Check console.");
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

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update name and image for "{category.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-cat-name">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cakes, Biryani, Beverages"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Image Upload with Drag & Drop */}
          <CategoryImageEdit
            currentPreview={category.imageUrl || ""}
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
            onClick={handleSave}
            disabled={isLoading || !name.trim() || !image}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}