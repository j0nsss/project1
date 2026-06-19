export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  sellingPrice: number | null;
  imageUri: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
