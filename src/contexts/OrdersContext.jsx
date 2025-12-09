import { createContext, useContext, useState, useCallback } from "react";

const OrdersContext = createContext(null);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

const ORDERS_STORAGE_KEY = "marketplace_orders";

// Get orders from localStorage
const getLocalOrders = () => {
  try {
    const orders = localStorage.getItem(ORDERS_STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch {
    return [];
  }
};

// Save orders to localStorage
const saveLocalOrders = (orders) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => getLocalOrders());
  const [loading, setLoading] = useState(false);

  // Create a new order
  const createOrder = useCallback(
    (orderData) => {
      setLoading(true);

      const newOrder = {
        id: `order-${Date.now()}`,
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shipping: orderData.shipping,
        total: orderData.total,
        status: "pending",
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: "paid",
        createdAt: new Date().toISOString(),
      };

      const newOrders = [newOrder, ...orders];
      setOrders(newOrders);
      saveLocalOrders(newOrders);
      setLoading(false);

      return { success: true, order: newOrder };
    },
    [orders]
  );

  // Get order by ID
  const getOrderById = useCallback(
    (orderId) => {
      return orders.find((order) => order.id === orderId) || null;
    },
    [orders]
  );

  // Update order status
  const updateOrderStatus = useCallback(
    (orderId, status) => {
      const newOrders = orders.map((order) => {
        if (order.id === orderId) {
          const updates = { status };
          if (status === "shipped") {
            updates.shippedAt = new Date().toISOString();
          }
          if (status === "delivered") {
            updates.deliveredAt = new Date().toISOString();
          }
          return { ...order, ...updates };
        }
        return order;
      });

      setOrders(newOrders);
      saveLocalOrders(newOrders);
      return { success: true };
    },
    [orders]
  );

  // Clear all orders
  const clearOrders = useCallback(() => {
    setOrders([]);
    saveLocalOrders([]);
    return { success: true };
  }, []);

  const value = {
    orders,
    loading,
    orderCount: orders.length,
    createOrder,
    getOrderById,
    updateOrderStatus,
    clearOrders,
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};

export default OrdersContext;
