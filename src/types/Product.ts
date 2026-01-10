export interface Product {
  id: string;
  name: string;
  description?: string | null;

  quantities: Array<{
    quantity: string;
    cakePrice: number;
    birthdayPackPrice?: number | null;
  }> | null;

  imageUrls?: string[] | null;
  imageUrl?: string | null; // legacy

  isVeg: boolean;

  createdAt?: any;
  updatedAt?: any;

  // legacy fields to be removed over time
  price?: number;
  halfPrice?: number | null;
  quantity?: string;
}