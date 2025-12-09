import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { formatPrice, calculateDiscount } from "../../utils/helpers";
import StarRating from "../common/StarRating";

const ProductCard = ({ product }) => {
  const { addItem, loading } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const discount = calculateDiscount(product.compareAtPrice, product.price);
  const isProductFavorite = isFavorite(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(product, 1);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <Link to={`/products/${product.id}`} className="card group block">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={
            product.images?.[0] ||
            "https://via.placeholder.com/400x400?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
            className="p-2 bg-white rounded-full shadow-md hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50"
            title="Add to cart"
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isProductFavorite
                ? "bg-red-500 text-white"
                : "bg-white hover:bg-red-500 hover:text-white"
            }`}
            title={
              isProductFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <FiHeart
              className={`w-5 h-5 ${isProductFavorite ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center space-x-2 mb-2">
          <StarRating rating={product.rating || 0} size="sm" />
          <span className="text-sm text-gray-500">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
