import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { Layout } from "../components/layout";
import { EmptyState } from "../components/common";
import { useFavorites } from "../contexts/FavoritesContext";
import { useCart } from "../contexts/CartContext";
import { formatPrice, calculateDiscount } from "../utils/helpers";

const Favorites = () => {
  const { items, removeFromFavorites, clearFavorites } = useFavorites();
  const { addItem } = useCart();

  const handleAddToCart = async (product) => {
    await addItem(product, 1);
  };

  const handleClearFavorites = () => {
    if (window.confirm("Are you sure you want to clear all favorites?")) {
      clearFavorites();
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <EmptyState
            icon={FiHeart}
            title="No favorites yet"
            description="Start adding products to your favorites to see them here!"
            actionText="Browse Products"
            actionLink="/products"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-500 mt-1">{items.length} items saved</p>
          </div>
          <button
            onClick={handleClearFavorites}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <FiTrash2 className="w-5 h-5" />
            <span>Clear All</span>
          </button>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => {
            const discount = calculateDiscount(
              product.compareAtPrice,
              product.price
            );

            return (
              <div key={product.id} className="card group">
                {/* Image */}
                <Link
                  to={`/products/${product.id}`}
                  className="relative aspect-square bg-gray-100 overflow-hidden block"
                >
                  <img
                    src={
                      product.images?.[0] ||
                      "https://via.placeholder.com/400x400?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{discount}%
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link
                    to={`/products/${product.id}`}
                    className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 mb-2 block"
                  >
                    {product.name}
                  </Link>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice &&
                      product.compareAtPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary flex-1 py-2 flex items-center justify-center space-x-2"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => removeFromFavorites(product.id)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors"
                      title="Remove from favorites"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Favorites;
