import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDisplayName(name: string | undefined | null, maxWords = 2) {
  if (!name || typeof name !== "string") return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length <= maxWords) return name.trim();
  return parts.slice(0, maxWords).join(" ");
}

// Cart calculation utilities
export type CartCalculationItem = {
  id: string;
  product: {
    price: number;
    offerPrice?: number;
  };
  quantity: number;
};

export type QuantityChange = {
  cartItemId: string;
  newQuantity: number;
};

export type CartTotals = {
  subTotal: number;
  totalDiscount: number;
  grandTotal: number;
};

/**
 * Calculate the effective price for a single item (offer price if available, otherwise regular price)
 */
export function getEffectivePrice(regularPrice: number, offerPrice?: number): number {
  return offerPrice && offerPrice < regularPrice ? offerPrice : regularPrice;
}

/**
 * Calculate the discount amount for a single item
 */
export function getItemDiscount(regularPrice: number, offerPrice?: number, quantity: number = 1): number {
  if (!offerPrice || offerPrice >= regularPrice) return 0;
  return (regularPrice - offerPrice) * quantity;
}

/**
 * Get the current quantity for an item, considering pending changes
 */
export function getCurrentQuantity(
  itemId: string,
  originalQuantity: number,
  pendingChanges: QuantityChange[]
): number {
  const pendingChange = pendingChanges.find(change => change.cartItemId === itemId);
  return pendingChange ? pendingChange.newQuantity : originalQuantity;
}

/**
 * Calculate cart totals including subtotal, discount, and grand total
 */
export function calculateCartTotals(
  cartItems: CartCalculationItem[],
  pendingChanges: QuantityChange[] = [],
  deliveryFee: number = 60
): CartTotals {
  let subTotal = 0;
  let totalDiscount = 0;

  cartItems.forEach(item => {
    const quantity = getCurrentQuantity(item.id, item.quantity, pendingChanges);
    const regularPrice = Number(item.product.price);
    const offerPrice = item.product.offerPrice ? Number(item.product.offerPrice) : undefined;
    
    // Add to subtotal (using effective price)
    const effectivePrice = getEffectivePrice(regularPrice, offerPrice);
    subTotal += effectivePrice * quantity;
    
    // Add to total discount
    totalDiscount += getItemDiscount(regularPrice, offerPrice, quantity);
  });

  const grandTotal = subTotal + deliveryFee;

  return {
    subTotal,
    totalDiscount,
    grandTotal
  };
}

/**
 * Update pending quantity changes array
 */
export function updatePendingChanges(
  currentChanges: QuantityChange[],
  itemId: string,
  newQuantity: number
): QuantityChange[] {
  const cartItemId = String(itemId);
  const existing = currentChanges.find(change => change.cartItemId === cartItemId);
  
  if (existing) {
    // Update existing pending change
    return currentChanges.map(change =>
      change.cartItemId === cartItemId
        ? { ...change, newQuantity }
        : change
    );
  } else {
    // Add new pending change
    return [...currentChanges, { cartItemId, newQuantity }];
  }
}
