import { useState, useEffect } from "react";
import { FiFilter, FiX, FiChevronDown } from "react-icons/fi";
import { categoriesAPI } from "../../services/api";

const ProductFilters = ({ filters, onFilterChange, onReset }) => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        if (response.data.success) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
  ];

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between py-2"
      >
        <span className="flex items-center space-x-2 font-medium">
          <FiFilter className="w-5 h-5" />
          <span>Filters</span>
        </span>
        <FiChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Filters Content */}
      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 md:mt-0">
          {/* Category Filter */}
          <div>
            <label className="label">Category</label>
            <select
              value={filters.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="label">Sort By</label>
            <select
              value={filters.sort || ""}
              onChange={(e) => handleChange("sort", e.target.value)}
              className="input"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="label">Min Price</label>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) => handleChange("minPrice", e.target.value)}
              className="input"
              min="0"
            />
          </div>

          <div>
            <label className="label">Max Price</label>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) => handleChange("maxPrice", e.target.value)}
              className="input"
              min="0"
            />
          </div>
        </div>

        {/* Reset Filters */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FiX className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
