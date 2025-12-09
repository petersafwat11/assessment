import { Link } from "react-router-dom";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { formatPrice } from "../../utils/helpers";

const CartSummary = () => {
  const { items, total, itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  const shipping = total > 100 ? 0 : 15.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  return (
    <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      {/* Summary Items */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} items)</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (8%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        {/* Free Shipping Progress */}
        {shipping > 0 && (
          <div className="pt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Add {formatPrice(100 - total)} for free shipping</span>
              <span>{formatPrice(total)} / $100</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${Math.min((total / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Grand Total */}
      <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
        <span>Total</span>
        <span>{formatPrice(grandTotal)}</span>
      </div>

      {/* Checkout Button */}
      {isAuthenticated ? (
        <Link
          to="/checkout"
          className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
        >
          <FiShoppingBag className="w-5 h-5" />
          <span>Proceed to Checkout</span>
        </Link>
      ) : (
        <Link
          to="/login"
          state={{ from: { pathname: "/checkout" } }}
          className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
        >
          <span>Sign in to Checkout</span>
          <FiArrowRight className="w-5 h-5" />
        </Link>
      )}

      {/* Continue Shopping */}
      <Link
        to="/products"
        className="btn-outline w-full py-3 mt-3 flex items-center justify-center"
      >
        Continue Shopping
      </Link>

      {/* Trust Badges */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>🔒 Secure checkout</span>
          <span>💳 Safe payment</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
