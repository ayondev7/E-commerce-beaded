const ORDER_ROUTES = {
  getUserOrders: "/order/get-user-orders",
  getOrderById: (orderId: string | number) => `/order/get-order/${orderId}`,
  createOrder: "/order/create-order",
  updateOrderStatus: (orderId: string | number) => `/order/update-order-status/${orderId}`,
  cancelOrder: (orderId: string | number) => `/order/cancel-order/${orderId}`,
};

export default ORDER_ROUTES;
