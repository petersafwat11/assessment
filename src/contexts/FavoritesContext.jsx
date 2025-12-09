import { createContext, useContext, useState, useCallback } from "react";

const FavoritesContext = createContext(null);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

const FAVORITES_STORAGE_KEY = "marketplace_favorites";

// Get favorites from localStorage
const getLocalFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

// Save favorites to localStorage
const saveLocalFavorites = (items) => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
};

export const FavoritesProvider = ({ children }) => {
  const [items, setItems] = useState(() => getLocalFavorites());

  // Add item to favorites
  const addToFavorites = useCallback(
    (product) => {
      const exists = items.some((item) => item.id === product.id);
      if (exists) return { success: false, message: "Already in favorites" };

      const newItems = [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          images: product.images,
          rating: product.rating,
          reviewCount: product.reviewCount,
          stock: product.stock,
          addedAt: new Date().toISOString(),
        },
      ];

      setItems(newItems);
      saveLocalFavorites(newItems);
      return { success: true };
    },
    [items]
  );

  // Remove item from favorites
  const removeFromFavorites = useCallback(
    (productId) => {
      const newItems = items.filter((item) => item.id !== productId);
      setItems(newItems);
      saveLocalFavorites(newItems);
      return { success: true };
    },
    [items]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (product) => {
      const exists = items.some((item) => item.id === product.id);
      if (exists) {
        return removeFromFavorites(product.id);
      } else {
        return addToFavorites(product);
      }
    },
    [items, addToFavorites, removeFromFavorites]
  );

  // Check if item is in favorites
  const isFavorite = useCallback(
    (productId) => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setItems([]);
    saveLocalFavorites([]);
    return { success: true };
  }, []);

  const value = {
    items,
    itemCount: items.length,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
