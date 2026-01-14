// app/admin/adminpanel/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { LogOut, Search, Trash2, Package, GripVertical } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Timestamp } from "firebase/firestore";

// Components
import DeliveryChargeSettings from "@/src/app/admin/DeliverySetting/page";
import AddCategoryDialog from "@/src/app/admin/Category/AddCategory/page";
import EditCategoryDialog from "@/src/app/admin/Category/EditCategory/page";
import AddProductDialog from "@/src/app/admin/Product/AddProduct/page";
import ProductRow from "@/src/app/admin/ProductTable/page";
import DeleteDialog from "@/src/app/admin/DeleteDialog/page";

// Icons & Loader
import { Cake, Croissant, Cookie, Coffee, Loader2 } from "lucide-react";
import AdminLoader from "@/src/components/AdminLoader";

import type { Product } from "@/src/types/Product";

const formatName = (raw: string) =>
  raw
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

interface Category {
  id: string;
  name?: string;
  imageUrl?: string;
  createdAt?: Timestamp;
  order?: number;           // ← added
}

export default function AdminPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCat, setProductsByCat] = useState<Record<string, Product[]>>({});
  const [loadingProductsByCat, setLoadingProductsByCat] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Categories listener – now also reads order field
  useEffect(() => {
    setLoadingCategories(true);

    const unsub = onSnapshot(collection(db, "categories"), (snap) => {
      const fetched: Category[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name ? formatName(data.name) : "Unnamed",
          imageUrl: data.imageUrl ?? undefined,
          createdAt: data.createdAt ?? undefined,
          order: typeof data.order === "number" ? data.order : 9999, // default high number
        };
      });

      // Sort by order field first, then by creation date (fallback)
      fetched.sort((a, b) => {
        const orderA = a.order ?? 9999;
        const orderB = b.order ?? 9999;

        if (orderA !== orderB) return orderA - orderB;

        const timeA = a.createdAt?.toMillis() ?? 0;
        const timeB = b.createdAt?.toMillis() ?? 0;
        return timeB - timeA; // newer first when orders are equal
      });

      setCategories(fetched);
      setLoadingCategories(false);
    });

    return () => unsub();
  }, []);

  // Save new order to Firestore
  const saveCategoryOrder = async (newCategories: Category[]) => {
    const batch = writeBatch(db);

    newCategories.forEach((cat, index) => {
      const ref = doc(db, "categories", cat.id);
      batch.update(ref, { order: index });
    });

    try {
      await batch.commit();
      // No need to setCategories again → snapshot will update automatically
    } catch (err) {
      console.error("Failed to save category order:", err);
    }
  };

  // Drag & Drop handlers
  const [dragId, setDragId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    setDragId(categoryId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;

    const newOrder = [...categories];

    const draggedIndex = newOrder.findIndex((c) => c.id === dragId);
    const targetIndex = newOrder.findIndex((c) => c.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Remove dragged item
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    // Insert at new position
    newOrder.splice(targetIndex, 0, draggedItem);

    setCategories(newOrder);
    saveCategoryOrder(newOrder);

    setDragId(null);
  };

  // ... rest of your product listeners remain unchanged ...
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    categories.forEach((cat) => {
      setLoadingProductsByCat((prev) => ({ ...prev, [cat.id]: true }));

      const unsub = onSnapshot(
        collection(db, "categories", cat.id, "products"),
        (snap) => {
          const prods: Product[] = snap.docs.map((d) => {
            const data = d.data();
            let quantities: Product["quantities"] = data.quantities ?? null;

            if (!Array.isArray(quantities) || quantities.length === 0) {
              if (data.price != null) {
                quantities = [
                  {
                    quantity: data.quantity ?? "",
                    cakePrice: Number(data.price) || 0,
                    birthdayPackPrice: data.halfPrice ?? null,
                  },
                ];
              } else {
                quantities = null;
              }
            }

            const imageUrls = data.imageUrls || (data.imageUrl ? [data.imageUrl] : []);

            return {
              id: d.id,
              name: data.name ?? "Unnamed Item",
              quantities,
              description: data.description ?? null,
              imageUrls: imageUrls.length > 0 ? imageUrls : null,
              imageUrl: imageUrls[0] ?? null,
              isVeg: data.isVeg ?? true,
              createdAt: data.createdAt ?? null,
              price: data.price ?? null,
              halfPrice: data.halfPrice ?? null,
              quantity: data.quantity ?? null,
            } as Product;
          });

          prods.sort((a, b) => {
            const aTime = a.createdAt?.toMillis() ?? 0;
            const bTime = b.createdAt?.toMillis() ?? 0;
            return bTime - aTime;
          });

          setProductsByCat((prev) => ({ ...prev, [cat.id]: prods }));
          setLoadingProductsByCat((prev) => ({ ...prev, [cat.id]: false }));
        }
      );

      unsubs.push(unsub);
    });

    return () => unsubs.forEach((u) => u());
  }, [categories]);

  const allProducts = useMemo(() => {
    const list: (Product & { categoryId: string; categoryName?: string })[] = [];
    categories.forEach((cat) => {
      (productsByCat[cat.id] || []).forEach((p) => {
        list.push({ ...p, categoryId: cat.id, categoryName: cat.name });
      });
    });
    return list;
  }, [categories, productsByCat]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [allProducts, searchQuery]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-yellow-500 via-orange-400 to-red-400">
      {/* Wood texture overlay */}
      <div
        className="fixed inset-0 bg-repeat pointer-events-none z-0"
        style={{
          backgroundImage: `url("https://media.istockphoto.com/id/1351043359/vector/empty-blank-very-light-brown-or-beige-coloured-grunge-wooden-laminate-textured-effect-vector.jpg?s=612x612&w=0&k=20&c=SQ6pWOBouS-t_RlqzRdxmYrPPt8j-ENrV_xrPUrZ4KU=")`,
          backgroundSize: "800px",
          opacity: 0.18,
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative z-10 min-h-screen px-4 py-4 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 sm:gap-6 mb-4 mt-4 sm:mt-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-yellow-950">
              Admin - Bakery Point
            </h1>
            <Button
              variant="orange"
              size="lg"
              className="text-yellow-950 hover:text-black text-lg hover:bg-amber-500"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-8 w-8" />
              Logout
            </Button>
          </div>

          <div className="mb-8 sm:mb-10">
            <DeliveryChargeSettings />
          </div>

          {/* Global Search */}
          <div className="mb-4 sm:mb-10">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search any product by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-6 text-base sm:text-lg bg-white/95 backdrop-blur border-yellow-300 focus:border-yellow-500 shadow-xl"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchQuery.trim() ? (
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden mb-10 sm:mb-12">
              {/* ... search results table remains the same ... */}
              <div className="p-5 sm:p-6 border-b">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Search Results
                  {filteredProducts.length > 0 && (
                    <span className="text-base sm:text-lg font-normal text-gray-600 ml-3">
                      ({filteredProducts.length})
                    </span>
                  )}
                </h2>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 sm:py-16 text-gray-500">
                  No products found for "{searchQuery}"
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50 border-b-2">
                      <tr>
                        {["Product", "Price", "Half", "Serves", "Type", "Image", "Actions"].map((h) => (
                          <th key={h} className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <ProductRow key={p.id} categoryId={p.categoryId} product={p} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          ) : (
            <>
              {/* Menu Catalogue Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-yellow-800">
                  Menu List
                </h2>
                <AddCategoryDialog />
              </div>

              {loadingCategories ? (
                <AdminLoader />
              ) : categories.length === 0 ? (
                <div className="text-center py-20 sm:py-32">
                  <div className="w-28 h-28 mx-auto mb-6 bg-yellow-200/60 rounded-full flex items-center justify-center">
                    <Package className="h-14 w-14 text-yellow-700" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-50 mb-3">
                    No categories yet
                  </p>
                  <p className="text-yellow-100 text-base sm:text-lg">
                    Click "Add Category" to build your menu!
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-2 sm:space-y-6">
                  {categories.map((cat) => (
                    <AccordionItem
                      key={cat.id}
                      value={cat.id}
                      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-yellow-200"
                      draggable
                      onDragStart={(e) => handleDragStart(e, cat.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, cat.id)}
                    >
                      <AccordionTrigger className="px-3 sm:px-5 py-3 sm:py-4 hover:no-underline hover:bg-orange-50/50 transition cursor-grab active:cursor-grabbing">
                        <div className="flex items-center justify-between w-full pr-2">
                          <div className="flex items-center gap-2 sm:gap-4">
                            <GripVertical className="h-5 w-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                            {cat.imageUrl && (
                              <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl shadow-md"
                              />
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <span className="text-lg sm:text-xl font-bold text-gray-800">
                                {cat.name || "Unnamed Category"}
                              </span>
                              <span className="text-sm text-gray-600">
                                ({productsByCat[cat.id]?.length || 0} items)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <EditCategoryDialog category={cat} />
                            <DeleteDialog
                              title="Delete Category"
                              description="All products in this category will be permanently deleted."
                              itemName={cat.name}
                              onConfirm={async () => {
                                await deleteDoc(doc(db, "categories", cat.id));
                              }}
                            >
                              <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-50">
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </DeleteDialog>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-2 sm:px-6 pb-6 sm:pb-8 bg-gray-50/70">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-5 sm:mb-6">
                          <h3 className="text-lg font-semibold text-gray-700">Menu Items</h3>
                          <AddProductDialog categoryId={cat.id} />
                        </div>

                        <Card className="overflow-hidden shadow-lg">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                              <thead className="bg-linear-to-r from-orange-100 to-yellow-100 border-b-2">
                                <tr>
                                  {["Product", "Prices", "Serves", "Type", "Image", "Actions"].map((h) => (
                                    <th
                                      key={h}
                                      className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700"
                                    >
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(productsByCat[cat.id] || []).length > 0 ? (
                                  (productsByCat[cat.id] || []).map((p) => (
                                    <ProductRow
                                      key={p.id}
                                      categoryId={cat.id}
                                      product={p}
                                    />
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={7} className="text-center py-12 sm:py-16 text-gray-500 font-medium">
                                      No items yet. Click "Add Item" to get started!
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}