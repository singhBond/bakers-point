// types/index.ts   (or src/types/index.ts)

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  createdAt?: any; // Firebase Timestamp or Date
}

// export interface Product {
//   id: string;
//   name: string;
//   price: number;
//   halfPrice?: number | undefined; 
//   quantity?: string;        // e.g. "2-3 people"
//   description?: string;
//   imageUrl?: string;
//   imageUrls?: string[];
//   createdAt?: any;
//   isVeg: boolean;
// }

export interface CartItem {
  id: string;
  name: string;
  price: number;
  halfPrice?: number |undefined ;
  quantity: number;
  portion: "half" | "full";
  description?: string;
  imageUrl?: string;
  imageUrls?: string[];
  isVeg: boolean;
  serves?: string;
}