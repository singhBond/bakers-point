export type Product = {
  id: string;
  name: string;
  price: number;
  halfPrice?: number | null;
  quantity?: string;
  description?: string;
  imageUrl?: string;
  imageUrls?: string[];
  isVeg: boolean;
};
