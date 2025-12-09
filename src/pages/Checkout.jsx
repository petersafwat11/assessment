import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiCreditCard, FiMapPin, FiCheck } from "react-icons/fi";
import { Layout } from "../components/layout";
import { LoadingSpinner, Alert } from "../components/common";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useOrders } from "../contexts/OrdersContext";
import { formatPrice } from "../utils/helpers";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shipping = total > 100 ? 0 : 15.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "USA",
      paymentMethod: "credit_card",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.product?.name,
          price: item.product?.price,
        })),
        subtotal: total,
        tax: tax,
        shipping: shipping,
        total: grandTotal,
        shippingAddress: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        paymentMethod: data.paymentMethod,
      };

      const result = createOrder(orderData);

      if (result.success) {
        await clearCart();
        navigate("/orders", {
          state: { success: true, orderId: result.order.id },
        });
      }
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiMapPin className="w-5 h-5 mr-2 text-primary-600" />
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label">Street Address</label>
                    <input
                      type="text"
                      className={`input ${errors.street ? "input-error" : ""}`}
                      {...register("street", {
                        required: "Street address is required",
                      })}
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.street.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">City</label>
                    <input
                      type="text"
                      className={`input ${errors.city ? "input-error" : ""}`}
                      {...register("city", { required: "City is required" })}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">State</label>
                    <input
                      type="text"
                      className={`input ${errors.state ? "input-error" : ""}`}
                      {...register("state", { required: "State is required" })}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">ZIP Code</label>
                    <input
                      type="text"
                      className={`input ${errors.zipCode ? "input-error" : ""}`}
                      {...register("zipCode", {
                        required: "ZIP code is required",
                      })}
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Country</label>
                    <input
                      type="text"
                      className={`input ${errors.country ? "input-error" : ""}`}
                      {...register("country", {
                        required: "Country is required",
                      })}
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiCreditCard className="w-5 h-5 mr-2 text-primary-600" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      value="credit_card"
                      {...register("paymentMethod")}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3">Credit Card</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      value="paypal"
                      {...register("paymentMethod")}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3">PayPal</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.id || item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {item.product?.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(
                          (item.product?.price || 0) * item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 mt-6 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <FiCheck className="w-5 h-5" />
                      <span>Place Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
