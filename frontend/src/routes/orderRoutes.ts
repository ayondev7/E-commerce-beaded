import API_URL from ".";

const BASE = `${API_URL}/orders`;

const ORDER_ROUTES = {
  getUserOrders: `${BASE}/get-user-orders`,
  getOrderById: (orderId: string | number) => `${BASE}/get-order/${orderId}`,
  createOrder: `${BASE}/create-order`,
  updateOrderStatus: (orderId: string | number) => `${BASE}/update-order-status/${orderId}`,
  cancelOrder: (orderId: string | number) => `${BASE}/cancel-order/${orderId}`,
};

export default ORDER_ROUTES;
