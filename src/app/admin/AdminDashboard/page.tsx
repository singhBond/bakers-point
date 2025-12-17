// app/admin/adminpanel/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { LogOut, Search, Plus, Bike, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { collection, onSnapshot, doc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Timestamp } from "firebase/firestore";

// Import all updated components
import DeliveryChargeSettings from "@/src/app/admin/DeliverySetting/page";
import AddCategoryDialog from "@/src/app/admin/Category/AddCategory/page";
import EditCategoryDialog from "@/src/app/admin/Category/EditCategory/page";
import AddProductDialog from "@/src/app/admin/Product/AddProduct/page";
import ProductRow from "@/src/app/admin/ProductTable/page";
import ProductSkeletonRow from "@/src/app/admin/ProductSkeletonRow/page";
import DeleteDialog from "@/src/app/admin/DeleteDialog/page";

interface Category {
  id: string;
  name?: string;
  imageUrl?: string;
  createdAt?: Timestamp;
}

interface Product {
  id: string;
  name: string;
  price: number;
  halfPrice?: number | null;
  quantity?: string;
  description?: string;
  imageUrl?: string;
  imageUrls?: string[];
  isVeg: boolean;
  createdAt?: Timestamp;
}

const formatName = (raw: string) =>
  raw
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

export default function AdminPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCat, setProductsByCat] = useState<Record<string, Product[]>>({});
  const [loadingProductsByCat, setLoadingProductsByCat] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Flatten all products for global search
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

  // Cleanup junk categories (optional)
  useEffect(() => {
  const cleanup = async () => {
    const junk = ["Foods", "Test", "temp"];

    for (const name of junk) {
      // 🔥 Correct query syntax
      const q = query(
        collection(db, "categories"),   // your collection name here
        where("name", "==", name)
      );

      const snap = await getDocs(q);

      // Delete all matching docs
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    }
  };

  cleanup();
}, []);


  // Listen to categories
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "categories"), (snap) => {
      const fetched: Category[] = [];
      snap.docs.forEach((d) => {
        const data = d.data();
        fetched.push({
          id: d.id,
          name: data.name ? formatName(data.name) : "Unnamed",
          imageUrl: data.imageUrl ?? undefined,
          createdAt: data.createdAt ?? undefined,
        });
      });

      fetched.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() ?? 0;
        const bTime = b.createdAt?.toMillis() ?? 0;
        return bTime - aTime;
      });

      setCategories(fetched);
    });

    return () => unsub();
  }, []);

  // Listen to products per category
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    categories.forEach((cat) => {
      setLoadingProductsByCat((prev) => ({ ...prev, [cat.id]: true }));

      const unsub = onSnapshot(
        collection(db, "categories", cat.id, "products"),
        (snap) => {
          const prods: Product[] = snap.docs.map((d) => {
            const data = d.data();
            const imageUrls = data.imageUrls || (data.imageUrl ? [data.imageUrl] : []);
            return {
              id: d.id,
              name: data.name ?? "Unnamed Item",
              price: data.price ?? 0,
              halfPrice: data.halfPrice ?? undefined,
              quantity: data.quantity ?? undefined ? "1" : data.quantity,
              description: data.description ?? undefined,
              imageUrl: data.imageUrl ?? undefined,
              imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
              isVeg: data.isVeg ?? true,
              createdAt: data.createdAt ?? undefined,
            };
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

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    window.location.href = "/admin/login";
  };

  return (
    <section className="min-h-screen bg-linear-to-b from-yellow-500 via-orange-400 to-red-400 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl bold text-yellow-50 bold">
            Admin - Raj Restro
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-yellow-50 hover:text-white hover:bg-white/20"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>

        {/* Delivery Charge */}
        <DeliveryChargeSettings />

        {/* Global Search */}
        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search any product by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-6 text-lg bg-white/95 backdrop-blur border-yellow-300 focus:border-yellow-500 shadow-xl"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery.trim() ? (
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Search Results
                {filteredProducts.length > 0 && (
                  <span className="text-lg font-normal text-gray-600 ml-3">
                    ({filteredProducts.length})
                  </span>
                )}
              </h2>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                No products found for "{searchQuery}"
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2">
                    <tr>
                      {["Product", "Price", "Half", "Type", "Serves", "Image", "Actions"].map((h) => (
                        <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <ProductRow
                        key={p.id}
                        categoryId={p.categoryId}
                        product={p}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ) : (
          <>
            {/* Categories Section */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-yellow-50">
                Menu Categories
              </h2>
              <AddCategoryDialog />
            </div>

            <Accordion type="single" collapsible className="space-y-5">
              {categories.map((cat) => (
                <AccordionItem
                  key={cat.id}
                  value={cat.id}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-yellow-200"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-orange-50/50 transition">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-4">
                        {cat.imageUrl && (
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-14 h-14 object-cover rounded-xl shadow-md"
                          />
                        )}
                        <span className="text-xl font-bold text-gray-800">
                          {cat.name || "Unnamed Category"}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({productsByCat[cat.id]?.length || 0} items)
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
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

                  <AccordionContent className="px-6 pb-6 bg-gray-50/70">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-lg font-semibold text-gray-700">Menu Items</h3>
                      <AddProductDialog categoryId={cat.id} />
                    </div>

                    <Card className="overflow-hidden shadow-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-orange-100 to-yellow-100 border-b-2">
                            <tr>
                              {["Product", "Price", "Half", "Type", "Serves", "Image", "Actions"].map((h) => (
                                <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {loadingProductsByCat[cat.id] ? (
                              Array(5)
                                .fill(0)
                                .map((_, i) => <ProductSkeletonRow key={i} />)
                            ) : (productsByCat[cat.id] || []).length > 0 ? (
                              (productsByCat[cat.id] || []).map((p) => (
                                <ProductRow
                                  key={p.id}
                                  categoryId={cat.id}
                                  product={p}
                                />
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-500">
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

            {categories.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-yellow-200/50 rounded-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-yellow-700" />
                </div>
                <p className="text-2xl font-bold text-yellow-50 mb-2">No categories yet</p>
                <p className="text-yellow-100">Click "Add Category" to create your first one!</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}