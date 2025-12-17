// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   halfPrice?: number;
//   description?: string;
//   imageUrl?: string;
//   imageUrls?: string[];
//   quantity?: string;
//   isVeg: boolean;
// }

// interface Props {
//   product: Product | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onAddToCart: (product: Product, portion: "full" | "half", qty: number) => void;
// }

// export const ProductDialog: React.FC<Props> = ({
//   product,
//   open,
//   onOpenChange,
//   onAddToCart,
// }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [portion, setPortion] = useState<"full" | "half">("full");
//   const [currentImgIndex, setCurrentImgIndex] = useState(0);

//   useEffect(() => {
//     if (open) {
//       setQuantity(1);
//       setPortion(product?.halfPrice ? "full" : "full");
//       setCurrentImgIndex(0);
//     }
//   }, [open, product]);

//   if (!product) return null;

//   const images =
//     product.imageUrls?.filter(Boolean).length
//       ? product.imageUrls!
//       : product.imageUrl
//       ? [product.imageUrl]
//       : ["/placeholder.svg"];

//   const price =
//     portion === "half"
//       ? product.halfPrice || product.price / 2
//       : product.price;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-full w-full h-full md:max-w-2xl md:h-auto md:max-h-[60vh] rounded-none md:rounded-2xl p-0 overflow-hidden flex flex-col">
//         {/* Header */}
//         <DialogHeader className="p-4 pb-1 shrink-0">
//           <DialogTitle className="text-lg md:text-xl pr-10 flex items-center gap-2">
//             {product.name}
//             <div
//               className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center ${
//                 product.isVeg
//                   ? "border-green-600 bg-green-500"
//                   : "border-red-600 bg-red-500"
//               }`}
//             >
//               <div className="w-2 h-2 bg-white rounded-full"></div>
//             </div>
//           </DialogTitle>
//         </DialogHeader>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto px-2 pb-4">
//           <div className="flex flex-col md:flex-row gap-3 md:gap-4">
//             {/* Image Gallery */}
//             <div className="relative w-full md:w-1/2 h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden shrink-0">
//               <img
//                 src={images[currentImgIndex]}
//                 alt={`${product.name} - ${currentImgIndex + 1}`}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.currentTarget.src = "/placeholder.svg";
//                 }}
//               />

//               {images.length > 1 && (
//                 <>
//                   <button
//                     onClick={() =>
//                       setCurrentImgIndex((i) =>
//                         i === 0 ? images.length - 1 : i - 1
//                       )
//                     }
//                     className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
//                   >
//                     <ChevronLeft size={20} />
//                   </button>
//                   <button
//                     onClick={() =>
//                       setCurrentImgIndex((i) =>
//                         i === images.length - 1 ? 0 : i + 1
//                       )
//                     }
//                     className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
//                   >
//                     <ChevronRight size={20} />
//                   </button>
//                   <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
//                     {currentImgIndex + 1} / {images.length}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Details */}
//             <div className="flex-1 flex flex-col justify-between px-3">
//               <div className="space-y-3">
//                 {product.description && (
//                   <p className="text-gray-700 text-sm leading-relaxed">
//                     {product.description}
//                   </p>
//                 )}

//                 {product.halfPrice && (
//                   <div>
//                     <p className="text-sm font-medium text-gray-700 mb-1">
//                       Plate Type :
//                     </p>
//                     <div className="flex gap-2">
//                       <Button
//                         variant={portion === "full" ? "default" : "outline"}
//                         size="sm"
//                         className="flex-1"
//                         onClick={() => setPortion("full")}
//                       >
//                         Full Plate
//                       </Button>
//                       <Button
//                         variant={portion === "half" ? "default" : "outline"}
//                         size="sm"
//                         className="flex-1"
//                         onClick={() => setPortion("half")}
//                       >
//                         Half Plate
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 {product.quantity && product.quantity !== "1" && (
//                   <p className="text-sm text-gray-600">
//                     <strong>Serves :</strong> {product.quantity}
//                   </p>
//                 )}

//                 <div className="flex items-center gap-6 mt-3">
//                   <p className="text-3xl font-bold text-green-600">
//                     ₹{(price * quantity).toFixed(0)}
//                   </p>

//                   <div className="flex items-center border rounded-lg">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8"
//                       onClick={() =>
//                         setQuantity((q) => Math.max(1, q - 1))
//                       }
//                     >
//                       <Minus size={14} />
//                     </Button>
//                     <span className="w-12 text-center font-medium">
//                       {quantity}
//                     </span>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8"
//                       onClick={() => setQuantity((q) => q + 1)}
//                     >
//                       <Plus size={14} />
//                     </Button>
//                   </div>
//                 </div>

//                 <Button
//                   className="mt-5 bg-yellow-500 hover:bg-yellow-700 text-white text-sm md:text-base"
//                   onClick={() => {
//                     onAddToCart(product, portion, quantity);
//                     onOpenChange(false);
//                   }}
//                 >
//                   Add to Cart
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
