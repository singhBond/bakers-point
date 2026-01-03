// app/admin/adminpanel/components/DeleteDialog.tsx
"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

interface DeleteDialogProps {
  title?: string;
  description?: string;
  itemName?: string; // Optional: show item name in warning
  onConfirm: () => Promise<void> | void;
  children: React.ReactNode;
  triggerVariant?: "default" | "destructive" | "ghost" | "icon";
}

export default function DeleteDialog({
  title = "Delete Item",
  description = "This action cannot be undone.",
  itemName,
  onConfirm,
  children,
  triggerVariant = "ghost",
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
      // Optional: show toast error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            {title}
          </DialogTitle>

          <DialogDescription className="text-center text-base text-gray-600 mt-3">
            {itemName ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">"{itemName}"</span>?
                <br />
              </>
            ) : null}
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Permanently
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}