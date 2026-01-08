// app/admin/adminpanel/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { LogOut, Search, Trash2, Package } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { collection, onSnapshot, doc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Timestamp } from "firebase/firestore";

// Components
import DeliveryChargeSettings from "@/src/app/admin/DeliverySetting/page";
import AddCategoryDialog from "@/src/app/admin/Category/AddCategory/page";
import EditCategoryDialog from "@/src/app/admin/Category/EditCategory/page";
import AddProductDialog from "@/src/app/admin/Product/AddProduct/page";
import ProductRow from "@/src/app/admin/ProductTable/page";
import DeleteDialog from "@/src/app/admin/DeleteDialog/page";

// Bakery Icons for Loader
import { Cake, Croissant, Cookie, Coffee, Loader2 } from "lucide-react";
import AdminLoader from "@/src/components/AdminLoader";

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
  
  // NEW: Controls the full-screen bakery loader when categories are loading
  const [loadingCategories, setLoadingCategories] = useState(true);

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

  // Optional: Clean up junk categories
  useEffect(() => {
    const cleanup = async () => {
      const junk = [""];
      for (const name of junk) {
        const q = query(collection(db, "categories"), where("name", "==", name));
        const snap = await getDocs(q);
        for (const d of snap.docs) await deleteDoc(d.ref);
      }
    };
    cleanup();
  }, []);

  // Listen to categories — with full-screen loader control
  useEffect(() => {
    setLoadingCategories(true); // Show loader

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
      setLoadingCategories(false); // Hide loader when categories are ready
    });

    return () => unsub();
  }, []);

  // Listen to products per category (unchanged)
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
              quantity: data.quantity ?? undefined,
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
       <div 
      className="absolute inset-0   bg-repeat " 
      style={{ 
        backgroundImage: `url("https://i.pinimg.com/736x/02/b6/55/02b655eea8cd1491b90b358aa7ac1908.jpg")`,
        backgroundColor: "#5c4033" 
      }}
    >
    
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 mt-10">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-950">
            Admin - Bakery Point
          </h1>
          <Button
            variant="ghost"
            size="lg"
            className="text-yellow-950 hover:text-black hover:bg-amber-500"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-8 w-8" />
            Logout
          </Button>
        </div>

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
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden mb-10">
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-yellow-50">
                Menu Catalogue
              </h2>
              <AddCategoryDialog />
            </div>

            {/* FULL-SCREEN BAKERY LOADER — Only when categories are loading */}
            {loadingCategories ? (
              <AdminLoader/>
            ) : categories.length === 0 ? (
              <div className="text-center py-32">
                <div className="w-28 h-28 mx-auto mb-6 bg-yellow-200/60 rounded-full flex items-center justify-center">
                  <Package className="h-14 w-14 text-yellow-700" />
                </div>
                <p className="text-3xl font-bold text-yellow-50 mb-2">No categories yet</p>
                <p className="text-yellow-100 text-lg">Click "Add Category" to build your menu!</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-5">
                {categories.map((cat) => (
                  <AccordionItem
                    key={cat.id}
                    value={cat.id}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-yellow-200"
                  >
                    <AccordionTrigger className="px-2 py-2 hover:no-underline hover:bg-orange-50/50 transition">
                      <div className="flex items-center justify-between w-full pr-">
                        <div className="flex items-center gap-3">
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
                        <div className="flex items-center gap-2">
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
                            <thead className="bg-linear-to-r from-orange-100 to-yellow-100 border-b-2">
                              <tr>
                                {["Product", "Price", "Half", "Type", "Serves", "Image", "Actions"].map((h) => (
                                  <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
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
                                  <td colSpan={7} className="text-center py-16 text-gray-500 font-medium">
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
    </section>
  );
}