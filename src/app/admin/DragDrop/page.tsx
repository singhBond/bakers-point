// app/admin/adminpanel/components/DragDropUpload.tsx
"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

// Reusable image compression (less than or equal to 500 KB, max 1200px dimension)
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
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
      const compress = () => {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const sizeKB = (dataUrl.length * 0.75) / 1024;

        if (sizeKB <= 500 || quality <= 0.1) {
          resolve(dataUrl);
        } else {
          quality -= 0.1;
          setTimeout(compress, 0);
        }
      };
      compress();
    };

    img.onerror = () => reject(new Error("Image load error"));
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
};

interface DragDropUploadProps {
  /** Current image previews (data URLs) */
  previews: string[];
  /** Callback when new images are added */
  onImagesChange: (newImages: string[]) => void;
  /** Callback when an image is removed */
  onRemove?: (index: number) => void;
  /** Optional label */
  label?: string;
}

export default function DragDropUpload({
  previews,
  onImagesChange,
  onRemove,
  label = "Images",
}: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0)  alert("Please select image files only") ; null;

    try {
      const compressed = await Promise.all(validFiles.map(compressImage));
      const validImages = compressed.filter((img): img is string => !!img);
      if (validImages.length > 0){
        onImagesChange(validImages);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process one or more images");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="space-y-5">
      {/* Label */}
 <div className="flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-gray-600" />
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          ({previews.length} {previews.length === 1 ? "image" : "images"})
        </span>
      </div>

      {/* Image Previews Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-lg transition-all"
            >
              <img
                src={src}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Size Badge */}
              <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                ~{(src.length * 0.75 / 1024).toFixed(0)} KB
              </div>

              {/* Remove Button */}
              {onRemove && (
                <button
                  onClick={() => onRemove(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-yellow-500 bg-yellow-50 shadow-lg scale-105"
            : "border-gray-300 hover:border-yellow-500 hover:bg-yellow-50/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-3">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-yellow-600" />
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-800">
              {previews.length > 0 ? "Add more images" : "Drop images here or click to upload"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports JPG, PNG, WebP • Auto-compressed less than or equal to 500 KB each
            </p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Hint */}
      <p className="text-xs text-center text-gray-500">
        Tip: First image will be used as thumbnail
      </p>
    </div>
  );
}