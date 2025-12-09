import ProductCard from "./ProductCard";
import { LoadingSpinner, EmptyState } from "../common";
import { FiPackage } from "react-icons/fi";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={FiPackage}
        title="Error loading products"
        description={error}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={FiPackage}
        title="No products found"
        description="Try adjusting your search or filters to find what you're looking for."
        actionText="View all products"
        actionLink="/products"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
