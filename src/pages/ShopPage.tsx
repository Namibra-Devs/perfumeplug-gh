import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Grid, List, RotateCcw } from "lucide-react";

import ProductCard from "../components/product/ProductCard";
import Header from "../components/layout/Header";
import CustomSelect from "../components/ui/CustomSelect";

import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { ProductSkeleton } from "../components/product/ProductSkeleton";

const ShopPage: React.FC = () => {
  const location = useLocation();

  // Read query params
  const query = new URLSearchParams(location.search);
  const initialCategory = query.get("category") || "all";
  const searchQuery = query.get("q") || "";

  // UI states
  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks
  const { categories, loading: catLoading} = useCategories();
  const { products, loading, error, refetch, pagination } = useProducts({
    page: currentPage,
    category: category === "all" ? "" : category,
    search: searchQuery,
    minPrice: 0,
    maxPrice,
    sortBy,
  });

  const sortList = [
    { value: "newest", label: "Newest" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
  ];

  // Sync category with URL
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory.toLowerCase());
    }
  }, [initialCategory]);

  const clearFilters = () => {
    setCategory("all");
    setMaxPrice(1000);
    setSortBy("newest");
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, maxPrice, sortBy, searchQuery]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (pagination?.hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <>
      <Header title="Shop Perfumes" descripton="Discover our curated collection" />

      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex flex-col lg:flex-row gap-8">

          {/* -------------------------------------- */}
          {/* SIDEBAR (Always visible) */}
          {/* -------------------------------------- */}
          <div className="lg:w-80">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/20 backdrop-blur-lg rounded-lg border border-yellow-600/20 shadow-2xl p-6 sticky top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-400 hover:text-blue-600"
                >
                  Reset
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-yellow-500 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setCategory("all")}
                    className={`block w-full text-left px-3 py-2 rounded-lg ${
                      category === "all"
                        ? "bg-yellow-800/30 text-yellow-400"
                        : "text-gray-300 hover:bg-yellow-700/20"
                    }`}
                  >
                    All Products
                  </button>

                  {/* Show skeleton placeholders while category loading */}
                  {catLoading &&
                    Array.from({ length: 4 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-8 bg-yellow-900/20 animate-pulse rounded-md"
                      />
                    ))}

                  {!catLoading &&
                    categories?.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setCategory(c.name)}
                        className={`block w-full text-left px-3 py-2 rounded-lg ${
                          category === c.name.toLowerCase()
                            ? "bg-yellow-800/30 text-yellow-400"
                            : "text-gray-300 hover:bg-yellow-700/20"
                        }`}
                      >
                        <div className="flex justify-between items-center text-sm">
                          <span>{c.name}</span>
                          {c.productCount && (
                            <span className="text-gray-100 text-sm">({c.productCount})</span>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-yellow-500 mb-3">Max Price</h3>

                {loading ? (
                  <div className="h-3 w-full bg-yellow-900/20 animate-pulse rounded-md" />
                ) : (
                  <>
                    <input
                      title="Range"
                      type="range"
                      min="0"
                      max="1000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-1 bg-yellow-900 rounded-lg"
                    />

                    <div className="text-sm text-gray-200 flex justify-between">
                      <span>₵0</span>
                      <span>₵{maxPrice}</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* -------------------------------------- */}
          {/* MAIN CONTENT AREA */}
          {/* -------------------------------------- */}
          <div className="flex-1">

            {/* Toolbar */}
            <div className="bg-black/20 rounded-lg border border-yellow-600/20 shadow-2xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                
                {/* Number of results */}
                <span className="text-sm text-gray-200">
                  <span className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-lg">
                    {loading ? "…" : products.length}
                  </span>{" "}
                  products found
                  {pagination && !loading && (
                    <span className="text-gray-400 ml-2">
                      (Page {pagination.currentPage} of {pagination.totalPages}, {pagination.totalProducts} total)
                    </span>
                  )}
                  {searchQuery && (
                    <>
                      {" "}
                      for <span className="text-yellow-300">{searchQuery}</span>
                    </>
                  )}
                </span>

                {/* View + Sort */}
                <div className="flex items-center space-x-4">
                  <button
                    title="Sync"
                    onClick={() => refetch()}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <RotateCcw size={18} />
                  </button>

                  {/* View Mode Buttons */}
                  <div className="flex border border-yellow-600/20 rounded-lg overflow-hidden">
                    <button
                      title="Grid"
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-yellow-600/20 text-white"
                          : "text-white"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>

                    <button
                      title="List"
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-yellow-600/20 text-white"
                          : "text-white"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <CustomSelect
                    value={sortBy}
                    onChange={setSortBy}
                    options={sortList}
                    className="px-3 py-2 min-w-40"
                  />
                </div>
              </div>
            </div>

            {/* --------------------------------------------------- */}
            {/* PRODUCT SECTION */}
            {/* --------------------------------------------------- */}

            {/* LOADING: Show skeletons inside product area */}
            {loading && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                    : "space-y-4"
                }
              >
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ProductSkeleton key={idx} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* SUCCESS */}
            {products.length > 0 && (
              <motion.div
                layout
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                    : "space-y-4"
                }
              >
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* EMPTY STATE */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12 text-gray-300">
                <Filter className="h-12 w-12 mx-auto text-yellow-400" />
                <h3 className="text-lg mt-4">No products found</h3>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* PAGINATION */}
            {!loading && pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-300">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)} of{' '}
                  {pagination.totalProducts} products
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPrevPage}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      pagination.hasPrevPage
                        ? 'bg-black/20 border-yellow-600/20 text-yellow-400 hover:bg-yellow-700/20'
                        : 'bg-gray-800/20 border-gray-600/20 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {/* First page */}
                    {pagination.currentPage > 3 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="w-10 h-10 rounded-lg bg-black/20 border border-yellow-600/20 text-yellow-400 hover:bg-yellow-700/20 transition-colors"
                        >
                          1
                        </button>
                        {pagination.currentPage > 4 && (
                          <span className="text-gray-400 px-2">...</span>
                        )}
                      </>
                    )}

                    {/* Current page and neighbors */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      if (pageNum < 1 || pageNum > pagination.totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg border transition-colors ${
                            pageNum === pagination.currentPage
                              ? 'bg-yellow-600/30 border-yellow-400 text-yellow-400'
                              : 'bg-black/20 border-yellow-600/20 text-yellow-400 hover:bg-yellow-700/20'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Last page */}
                    {pagination.currentPage < pagination.totalPages - 2 && (
                      <>
                        {pagination.currentPage < pagination.totalPages - 3 && (
                          <span className="text-gray-400 px-2">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(pagination.totalPages)}
                          className="w-10 h-10 rounded-lg bg-black/20 border border-yellow-600/20 text-yellow-400 hover:bg-yellow-700/20 transition-colors"
                        >
                          {pagination.totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      pagination.hasNextPage
                        ? 'bg-black/20 border-yellow-600/20 text-yellow-400 hover:bg-yellow-700/20'
                        : 'bg-gray-800/20 border-gray-600/20 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopPage;