import { useState } from "react";
import {
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiCheck,
} from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import { formatPrice, calculateDiscount } from "../../utils/helpers";
import { StarRating, Alert } from "../common";

const ProductInfo = ({ product }) => {
  const { addItem, loading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = calculateDiscount(product.compareAtPrice, product.price);
  const isInStock = product.stock > 0;

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    const result = await addItem(product, quantity);
    if (result.success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.featured && <span className="badge-primary">Featured</span>}
        {discount > 0 && <span className="badge-danger">-{discount}% OFF</span>}
        {isInStock ? (
          <span className="badge-success">In Stock</span>
        ) : (
          <span className="badge-danger">Out of Stock</span>
        )}
      </div>

      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center space-x-3">
        <StarRating rating={product.rating || 0} size="md" showValue />
        <span className="text-gray-500">
          ({product.reviewCount || 0} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline space-x-3">
        <span className="text-3xl font-bold text-primary-600">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="text-xl text-gray-400 line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{product.description}</p>

      {/* Specifications */}
      {product.specifications &&
        Object.keys(product.specifications).length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
            <dl className="grid grid-cols-2 gap-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm text-gray-500 capitalize">{key}</dt>
                  <dd className="text-sm font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Add to Cart Section */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        {/* Quantity Selector */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <FiMinus className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 font-medium min-w-[50px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {product.stock} available
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleAddToCart}
            disabled={loading || !isInStock}
            className="btn-primary flex-1 py-3 flex items-center justify-center space-x-2"
          >
            {addedToCart ? (
              <>
                <FiCheck className="w-5 h-5" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <FiShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
          <button className="btn-outline p-3">
            <FiHeart className="w-5 h-5" />
          </button>
          <button className="btn-outline p-3">
            <FiShare2 className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {addedToCart && (
          <Alert type="success" message="Product added to cart successfully!" />
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
