import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import { formatPrice } from "../../utils/helpers";

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem, loading } = useCart();
  const product = item.product;

  if (!product) return null;

  const handleQuantityChange = async (delta) => {
    const newQty = item.quantity + delta;
    if (newQty >= 1) {
      await updateQuantity(item.productId, newQty);
    }
  };

  const handleRemove = async () => {
    await removeItem(item.productId);
  };

  const itemTotal = product.price * item.quantity;

  return (
    <div className="flex items-center py-4 border-b border-gray-100 last:border-0">
      {/* Product Image */}
      <Link
        to={`/products/${product.id}`}
        className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
      >
        <img
          src={
            product.images?.[0] ||
            "https://via.placeholder.com/100x100?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 ml-4">
        <Link
          to={`/products/${product.id}`}
          className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>
        <p className="text-primary-600 font-semibold mt-1">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2 mx-4">
        <button
          onClick={() => handleQuantityChange(-1)}
          disabled={loading || item.quantity <= 1}
          className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          <FiMinus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(1)}
          disabled={loading || item.quantity >= (product.stock || 99)}
          className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Item Total */}
      <div className="w-24 text-right font-semibold text-gray-900">
        {formatPrice(itemTotal)}
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={loading}
        className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
        title="Remove item"
      >
        <FiTrash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartItem;
