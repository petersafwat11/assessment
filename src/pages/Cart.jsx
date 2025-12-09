import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { Layout } from "../components/layout";
import { CartItem, CartSummary } from "../components/cart";
import { LoadingSpinner, EmptyState } from "../components/common";
import { useCart } from "../contexts/CartContext";

const Cart = () => {
  const { items, loading, clearCart } = useCart();

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  if (loading && items.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <EmptyState
            icon={FiShoppingCart}
            title="Your cart is empty"
            description="Looks like you haven't added any products to your cart yet. Start shopping to fill it up!"
            actionText="Start Shopping"
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
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <FiTrash2 className="w-5 h-5" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {items.map((item) => (
                <CartItem key={item.id || item.productId} item={item} />
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
