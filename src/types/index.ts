// // types/index.ts   (or types/product.ts)

// export interface Category {
//   id: string;
//   name: string;
//   imageUrl?: string;
//   createdAt?: any; // Firebase Timestamp or Date
// }

// // ── Modern Product structure (recommended from 2025+) ──
// export interface QuantityPrice {
//   quantity: string;              // e.g. "1kg", "500g", "6pcs", "2 Pound"
//   cakePrice: number;             // always required
//   birthdayPackPrice?: number | null;  // optional, null is allowed from Firestore
// }

// export interface Product {
//   id: string;
//   name: string;
//   description?: string | null;

//   // Main modern field — should be used going forward
//   quantities: QuantityPrice[];   // always array (even with 1 item)

//   // Legacy fields — keep only during migration (can be removed later)
//   price?: number;
//   halfPrice?: number | null;
//   quantity?: string;

//   // Images
//   imageUrl?: string;
//   imageUrls?: string[] | null;

//   isVeg: boolean;

//   // Optional timestamps
//   createdAt?: any;
//   updatedAt?: any;
// }

// // Keep your CartItem (updated to be more consistent)
// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;                 // final price (cakePrice or cakePrice + birthdayPack)
//   quantity: number;              // how many items customer ordered
//   portion: "half" | "full" | "custom"; // adjust according to your logic
//   selectedQuantityLabel?: string; // e.g. "1kg", "500g"
//   birthdayPack?: boolean;        // whether customer chose birthday pack add-on
//   description?: string;
//   imageUrl?: string;
//   isVeg: boolean;
//   serves?: string;
// }