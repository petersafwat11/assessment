import { Link } from "react-router-dom";
import {
  FiPackage,
  FiChevronRight,
  FiCalendar,
  FiTrash2,
} from "react-icons/fi";
import { Layout } from "../components/layout";
import { EmptyState } from "../components/common";
import { useOrders } from "../contexts/OrdersContext";
import { formatPrice, formatDate, getOrderStatusColor } from "../utils/helpers";

const Orders = () => {
  const { orders, clearOrders } = useOrders();

  const getStatusBadgeClass = (status) => {
    const color = getOrderStatusColor(status);
    return `badge-${color}`;
  };

  const handleClearOrders = () => {
    if (window.confirm("Are you sure you want to clear all order history?")) {
      clearOrders();
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          {orders.length > 0 && (
            <button
              onClick={handleClearOrders}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <FiTrash2 className="w-5 h-5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <EmptyState
            icon={FiPackage}
            title="No orders yet"
            description="You haven't placed any orders yet. Start shopping to see your orders here!"
            actionText="Start Shopping"
            actionLink="/products"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono font-medium text-gray-900">
                      {order.id}
                    </p>
                  </div>
                  <span
                    className={`${getStatusBadgeClass(
                      order.status
                    )} capitalize`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Details */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(order.createdAt)}</span>
                  <span className="mx-2">•</span>
                  <span>{order.items?.length || 0} items</span>
                </div>

                {/* Order Items Preview */}
                <div className="flex items-center space-x-4 mb-4">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-xs text-gray-500 text-center px-1">
                        {item.name?.substring(0, 15)}...
                      </span>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500">
                        +{order.items.length - 3}
                      </span>
                    </div>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <span className="ml-2 text-lg font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details
                    <FiChevronRight className="w-5 h-5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
