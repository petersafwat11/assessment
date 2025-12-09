import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { Layout } from "../components/layout";
import {
  ProductImages,
  ProductInfo,
  ProductGrid,
} from "../components/products";
import { LoadingSpinner, Alert } from "../components/common";
import { productsAPI } from "../services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await productsAPI.getById(id);

        if (response.data.success) {
          setProduct(response.data.data);

          // Fetch related products
          if (response.data.data.categoryId) {
            const relatedRes = await productsAPI.getByCategory(
              response.data.data.categoryId
            );
            if (relatedRes.data.success) {
              const related = relatedRes.data.data.products
                .filter((p) => p.id !== id)
                .slice(0, 4);
              setRelatedProducts(related);
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Alert type="error" message={error || "Product not found"} />
          <div className="mt-4 text-center">
            <Link to="/products" className="btn-primary">
              Back to Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary-600">
            Home
          </Link>
          <FiChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-primary-600">
            Products
          </Link>
          <FiChevronRight className="w-4 h-4" />
          <span className="text-gray-900 truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <ProductImages images={product.images} productName={product.name} />

          {/* Info */}
          <ProductInfo product={product} />
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews ({product.reviews.length})
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {review.userId?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{"⭐".repeat(review.rating)}</span>
                          {review.verifiedPurchase && (
                            <span className="badge-success">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <ProductGrid products={relatedProducts} loading={false} />
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
