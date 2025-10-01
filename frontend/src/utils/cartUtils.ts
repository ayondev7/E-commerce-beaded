export interface CartItem {
  id: string | number;
  quantity: number;
  product: {
    price: number;
    offerPrice?: number;
  };
}

export interface CartCalculation {
  subTotal: number;
  totalDiscount: number;
  deliveryFee: number;
  grandTotal: number;
}

export const DELIVERY_FEE = 70;

export const getEffectivePrice = (regularPrice: number, offerPrice?: number): number => {
  return offerPrice && offerPrice > 0 ? offerPrice : regularPrice;
};

export const getItemDiscount = (regularPrice: number, offerPrice?: number, quantity: number = 1): number => {
  if (!offerPrice || offerPrice <= 0) return 0;
  return (regularPrice - offerPrice) * quantity;
};

export const getItemSubtotal = (regularPrice: number, offerPrice?: number, quantity: number = 1): number => {
  const effectivePrice = getEffectivePrice(regularPrice, offerPrice);
  return effectivePrice * quantity;
};

export const calculateCartTotals = (cartItems: CartItem[]): CartCalculation => {
  let subTotal = 0;
  let totalDiscount = 0;

  cartItems.forEach(item => {
    const regularPrice = Number(item.product.price);
    const offerPrice = item.product.offerPrice ? Number(item.product.offerPrice) : undefined;
    const quantity = item.quantity;

    subTotal += getItemSubtotal(regularPrice, offerPrice, quantity);
    totalDiscount += getItemDiscount(regularPrice, offerPrice, quantity);
  });

  const deliveryFee = DELIVERY_FEE;
  const grandTotal = subTotal + deliveryFee - totalDiscount;

  return {
    subTotal,
    totalDiscount,
    deliveryFee,
    grandTotal
  };
};

export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(num)) return "TK. 0";

  return `TK. ${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
