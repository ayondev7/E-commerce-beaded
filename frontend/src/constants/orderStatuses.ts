export const orderStatuses = ["Pending", "Shipped", "Completed", "Canceled"] as const;

export type OrderStatus = typeof orderStatuses[number];