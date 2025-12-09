import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiHeadphones,
} from "react-icons/fi";
import { Layout } from "../components/layout";
import { ProductGrid } from "../components/products";
import { LoadingSpinner } from "../components/common";
import { productsAPI, categoriesAPI } from "../services/api";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getFeatured(),
          categoriesAPI.getAll(),
        ]);

        if (productsRes.data.success) {
          setFeaturedProducts(productsRes.data.data.products || []);
        }
        if (categoriesRes.data.success) {
          setCategories(
            categoriesRes.data.data?.filter((c) => !c.parentId) || []
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    { icon: FiTruck, title: "Free Shipping", desc: "On orders over $100" },
    { icon: FiShield, title: "Secure Payment", desc: "100% secure checkout" },
    { icon: FiCreditCard, title: "Easy Returns", desc: "30-day return policy" },
    { icon: FiHeadphones, title: "24/7 Support", desc: "Dedicated support" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-auth text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Shop the latest trends with confidence. Quality products,
              competitive prices, and exceptional customer service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Shop Now
                <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/products?featured=true"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                View Featured
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" className="py-8" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.slice(0, 5).map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden"
                >
                  <img
                    src={
                      category.image ||
                      `https://via.placeholder.com/300x300?text=${category.name}`
                    }
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link
              to="/products?featured=true"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <FiArrowRight className="ml-1" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover why Marketplace
            is the best place to shop online.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Create Account
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
