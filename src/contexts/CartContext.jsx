import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import { calculateCartTotal, getCartItemCount } from "../utils/helpers";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const CART_STORAGE_KEY = "marketplace_cart";

// Get cart from localStorage for non-authenticated users
const getLocalCart = () => {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
};

// Save cart to localStorage for non-authenticated users
const saveLocalCart = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart from API or localStorage
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isAuthenticated) {
        const response = await cartAPI.get();
        if (response.data.success) {
          setItems(response.data.data.items || []);
        }
      } else {
        setItems(getLocalCart());
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cart");
      // Fallback to local cart on error
      setItems(getLocalCart());
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart when auth state changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  // Add item to cart
  const addItem = useCallback(
    async (product, quantity = 1) => {
      setLoading(true);
      setError(null);

      try {
        if (isAuthenticated) {
          const response = await cartAPI.add(product.id, quantity);
          if (response.data.success) {
            await fetchCart(); // Refresh cart from server
            return { success: true };
          }
        } else {
          // Handle local cart
          const existingIndex = items.findIndex(
            (item) => item.productId === product.id
          );
          let newItems;

          if (existingIndex >= 0) {
            newItems = items.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [
              ...items,
              {
                id: `local-${Date.now()}`,
                productId: product.id,
                quantity,
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  images: product.images,
                  stock: product.stock,
                },
              },
            ];
          }

          setItems(newItems);
          saveLocalCart(newItems);
          return { success: true };
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to add item";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, items, fetchCart]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (productId, quantity) => {
      setLoading(true);
      setError(null);

      try {
        if (quantity < 1) {
          return removeItem(productId);
        }

        if (isAuthenticated) {
          const response = await cartAPI.update(productId, quantity);
          if (response.data.success) {
            await fetchCart();
            return { success: true };
          }
        } else {
          const newItems = items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );
          setItems(newItems);
          saveLocalCart(newItems);
          return { success: true };
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to update item";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, items, fetchCart]
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (productId) => {
      setLoading(true);
      setError(null);

      try {
        if (isAuthenticated) {
          const response = await cartAPI.remove(productId);
          if (response.data.success) {
            await fetchCart();
            return { success: true };
          }
        } else {
          const newItems = items.filter((item) => item.productId !== productId);
          setItems(newItems);
          saveLocalCart(newItems);
          return { success: true };
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to remove item";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, items, fetchCart]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isAuthenticated) {
        const response = await cartAPI.clear();
        if (response.data.success) {
          setItems([]);
          return { success: true };
        }
      } else {
        setItems([]);
        saveLocalCart([]);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to clear cart";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    items,
    loading,
    error,
    itemCount: getCartItemCount(items),
    total: calculateCartTotal(items),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    clearError,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
