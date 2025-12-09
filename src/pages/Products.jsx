import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "../components/layout";
import { ProductGrid, ProductFilters } from "../components/products";
import { productsAPI } from "../services/api";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Get filters from URL
  const filters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    featured: searchParams.get("featured") || "",
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.sort) params.sort = filters.sort;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.featured) params.featured = filters.featured;

        const response = await productsAPI.getAll(params);

        if (response.data.success) {
          setProducts(response.data.data.products || []);
          setPagination(
            response.data.data.pagination || { page: 1, pages: 1, total: 0 }
          );
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {filters.search ? `Search: "${filters.search}"` : "All Products"}
          </h1>
          <p className="text-gray-500 mt-1">
            {pagination.total} products found
          </p>
        </div>

        {/* Filters */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Products Grid */}
        <ProductGrid products={products} loading={loading} error={error} />

        {/* Pagination Info */}
        {!loading && products.length > 0 && (
          <div className="mt-8 text-center text-gray-500">
            Showing {products.length} of {pagination.total} products
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
