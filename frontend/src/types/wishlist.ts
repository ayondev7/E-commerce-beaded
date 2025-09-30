export type WishlistItem = {
  id: string;
  customerId: string;
  productId: string;
  product: {
    id: string;
    categoryId: string;
    productCollection: string;
    productName: string;
    productDescription: string;
    productSlug: string;
    price: number;
    offerPrice?: number;
    isInCart?: boolean;
    images: string[];
    category: {
      id: string;
      name: string;
      image: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type WishlistListResponse = {
  wishlistItems: WishlistItem[];
};

export type AddToWishlistPayload = {
  productId: string;
};