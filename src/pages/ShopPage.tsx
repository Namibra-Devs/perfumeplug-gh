import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Filter, Grid, List, RotateCcw, X, Search, Tag } from "lucide-react";

import ProductCard from "../components/product/ProductCard";
import Header from "../components/layout/Header";
import CustomSelect from "../components/ui/CustomSelect";
import { SEOHead } from "../components/seo";
import { generateCategorySEO, generateSearchSEO, generateSEO } from "../utils/seo";

import { useProducts } from "../hooks/useProducts";
import { ProductSkeleton } from "../components/product/ProductSkeleton";

const ShopPage: React.FC = () => {
  const location = useLocation();

  // Read query params
  const query = new URLSearchParams(location.search);
  const initialCategory = query.get("category") || query.get("product") || "all"; // Support both category and product params
  const searchQuery = query.get("q") || "";

  // UI states
  const [category, setCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks - First fetch all products to get categories and brands
  const { products: allProducts, loading: allLoading } = useProducts({
    page: 1,
    limit: 1000, // Get all products to extract categories and brands
  });

  // Then fetch filtered products
  const { products, loading, error, refetch, pagination } = useProducts({
    page: currentPage,
    category: category === "all" ? "" : category,
    search: searchQuery,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    sortBy,
  });

  // Filter products by brand on the frontend since API might not support brand filtering
  const filteredProducts = useMemo(() => {
    if (selectedBrand === "all") return products;
    return products.filter(product => product.brand === selectedBrand);
  }, [products, selectedBrand]);

  const sortList = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  // Extract unique categories and brands from all products
  const { categories, brands, priceStats } = useMemo(() => {
    if (!allProducts || allProducts.length === 0) {
      return { categories: [], brands: [], priceStats: { min: 0, max: 1000 } };
    }

    // Get unique categories with counts
    const categoryMap = new Map<string, number>();
    const brandMap = new Map<string, number>();
    let minPrice = Infinity;
    let maxPrice = 0;

    allProducts.forEach(product => {
      // Categories
      if (product.category) {
        const cat = product.category.toLowerCase();
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      }

      // Brands
      if (product.brand) {
        brandMap.set(product.brand, (brandMap.get(product.brand) || 0) + 1);
      }

      // Price range
      if (product.sellingPrice) {
        minPrice = Math.min(minPrice, product.sellingPrice);
        maxPrice = Math.max(maxPrice, product.sellingPrice);
      }
    });

    const categories = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    const brands = Array.from(brandMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Limit to top 10 brands

    return {
      categories,
      brands,
      priceStats: {
        min: minPrice === Infinity ? 0 : Math.floor(minPrice),
        max: Math.ceil(maxPrice)
      }
    };
  }, [allProducts]);

  // Sync category with URL
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory.toLowerCase());
    }
  }, [initialCategory]);

  // Update price range when stats change
  useEffect(() => {
    if (priceStats.max > 0) {
      setPriceRange(prev => ({
        min: prev.min,
        max: Math.max(prev.max, priceStats.max)
      }));
    }
  }, [priceStats]);

  const clearFilters = () => {
    setCategory("all");
    setSelectedBrand("all");
    setPriceRange({ min: priceStats.min, max: priceStats.max });
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters = category !== "all" || selectedBrand !== "all" || 
    priceRange.min !== priceStats.min || priceRange.max !== priceStats.max;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, selectedBrand, priceRange, sortBy, searchQuery]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  // Generate dynamic SEO based on current filters
  const seo = useMemo(() => {
    if (searchQuery) {
      return generateSearchSEO(searchQuery, filteredProducts.length);
    } else if (category !== "all") {
      const categoryData = categories.find(cat => cat.name === category);
      return generateCategorySEO(category, categoryData?.count);
    } else {
      return generateSEO({
        title: 'Shop All Perfumes & Fragrances',
        description: 'Browse our complete collection of authentic designer perfumes, luxury fragrances, and body sprays. Find the perfect scent with free shipping on orders over ₵200.',
        keywords: ['shop perfumes', 'all fragrances', 'perfume collection', 'buy perfumes online Ghana']
      });
    }
  }, [searchQuery, category, categories, filteredProducts.length]);

  return (
    <>
      <SEOHead seo={seo} />
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
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </button>
                )}
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mb-6 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-400 mb-2">Active Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">
                        Category: {category}
                        <button onClick={() => setCategory("all")} className="hover:text-white">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedBrand !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs">
                        Brand: {selectedBrand}
                        <button onClick={() => setSelectedBrand("all")} className="hover:text-white">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {(priceRange.min !== priceStats.min || priceRange.max !== priceStats.max) && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-300 rounded-full text-xs">
                        Price: ₵{priceRange.min}-₵{priceRange.max}
                        <button onClick={() => setPriceRange({ min: priceStats.min, max: priceStats.max })} className="hover:text-white">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-yellow-500 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categories
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => setCategory("all")}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      category === "all"
                        ? "bg-yellow-800/30 text-yellow-400 border border-yellow-600/30"
                        : "text-gray-300 hover:bg-yellow-700/20"
                    }`}
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span>All Products</span>
                      <span className="text-gray-400 text-xs">
                        ({allProducts?.length || 0})
                      </span>
                    </div>
                  </button>

                  {allLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-8 bg-yellow-900/20 animate-pulse rounded-md"
                      />
                    ))
                  ) : (
                    categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setCategory(cat.name)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          category === cat.name
                            ? "bg-yellow-800/30 text-yellow-400 border border-yellow-600/30"
                            : "text-gray-300 hover:bg-yellow-700/20"
                        }`}
                      >
                        <div className="flex justify-between items-center text-sm">
                          <span className="capitalize">{cat.name.replace('-', ' ')}</span>
                          <span className="text-gray-400 text-xs">({cat.count})</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Brands */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-yellow-500 mb-3">Popular Brands</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <button
                      onClick={() => setSelectedBrand("all")}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedBrand === "all"
                          ? "bg-purple-800/30 text-purple-400 border border-purple-600/30"
                          : "text-gray-300 hover:bg-purple-700/20"
                      }`}
                    >
                      <div className="flex justify-between items-center text-sm">
                        <span>All Brands</span>
                        <span className="text-gray-400 text-xs">({brands.reduce((sum, b) => sum + b.count, 0)})</span>
                      </div>
                    </button>

                    {brands.map((brand) => (
                      <button
                        key={brand.name}
                        onClick={() => setSelectedBrand(brand.name)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedBrand === brand.name
                            ? "bg-purple-800/30 text-purple-400 border border-purple-600/30"
                            : "text-gray-300 hover:bg-purple-700/20"
                        }`}
                      >
                        <div className="flex justify-between items-center text-sm">
                          <span>{brand.name}</span>
                          <span className="text-gray-400 text-xs">({brand.count})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-yellow-500 mb-3">Price Range</h3>

                {allLoading ? (
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-yellow-900/20 animate-pulse rounded-md" />
                    <div className="h-6 w-full bg-yellow-900/20 animate-pulse rounded-md" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Min Price Input */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-300 w-8">Min:</label>
                      <input
                        type="number"
                        min={priceStats.min}
                        max={priceRange.max}
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="flex-1 px-2 py-1 bg-black/20 border border-yellow-600/20 rounded text-white text-sm"
                      />
                    </div>

                    {/* Max Price Input */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-300 w-8">Max:</label>
                      <input
                        type="number"
                        min={priceRange.min}
                        max={priceStats.max}
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="flex-1 px-2 py-1 bg-black/20 border border-yellow-600/20 rounded text-white text-sm"
                      />
                    </div>

                    {/* Price Range Slider */}
                    <div className="relative">
                      <input
                        type="range"
                        min={priceStats.min}
                        max={priceStats.max}
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-full h-2 bg-yellow-900/30 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="text-xs text-gray-400 flex justify-between">
                      <span>₵{priceStats.min}</span>
                      <span>₵{priceStats.max}</span>
                    </div>
                  </div>
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
                    {loading ? "…" : filteredProducts.length}
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
                    title="Refresh Products"
                    onClick={() => refetch()}
                    disabled={loading}
                    className={`p-2 rounded-lg transition-colors ${
                      loading 
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed" 
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    <RotateCcw size={18} className={loading ? "animate-spin" : ""} />
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

            {/* ERROR STATE */}
            {!loading && error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-red-900/20 backdrop-blur-lg border border-red-600/20 rounded-2xl p-8 max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="h-16 w-16 mx-auto bg-red-600/20 rounded-full flex items-center justify-center mb-4">
                      <X className="h-8 w-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Error Loading Products</h3>
                    <p className="text-red-300 mb-4">{error}</p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => refetch()}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                    >
                      Try Again
                    </button>
                    
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg font-medium transition-all duration-300"
                      >
                        Clear Filters & Retry
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUCCESS */}
            {!loading && !error && filteredProducts.length > 0 && (
              <motion.div
                layout
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
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
            {!loading && !error && filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-2xl p-8 max-w-md mx-auto">
                  <div className="mb-6">
                    <Search className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
                    
                    {searchQuery ? (
                      <p className="text-gray-300 mb-4">
                        No products found for "<span className="text-yellow-400">{searchQuery}</span>"
                        {hasActiveFilters && " with the current filters"}
                      </p>
                    ) : hasActiveFilters ? (
                      <p className="text-gray-300 mb-4">
                        No products match your current filter criteria
                      </p>
                    ) : (
                      <p className="text-gray-300 mb-4">
                        No products are currently available
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                      >
                        Clear All Filters
                      </button>
                    )}

                    {searchQuery && (
                      <div className="text-sm text-gray-400">
                        <p className="mb-2">Try:</p>
                        <ul className="space-y-1 text-left">
                          <li>• Checking your spelling</li>
                          <li>• Using different keywords</li>
                          <li>• Removing some filters</li>
                          <li>• Browsing all products</li>
                        </ul>
                      </div>
                    )}

                    {categories.length > 0 && !searchQuery && (
                      <div className="mt-6">
                        <p className="text-sm text-gray-400 mb-3">Browse by category:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {categories.slice(0, 4).map((cat) => (
                            <button
                              key={cat.name}
                              onClick={() => setCategory(cat.name)}
                              className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-xs hover:bg-yellow-600/30 transition-colors"
                            >
                              {cat.name.replace('-', ' ')} ({cat.count})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
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
                    title="Previous"
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPrevPage}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      pagination.hasPrevPage
                        ? 'bg-black/20 border-yellow-600/20 text-yellow-400 hover:bg-yellow-700/20'
                        : 'bg-gray-800/20 border-gray-600/20 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                   <ArrowLeft/>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {/* First page */}
                    {pagination.currentPage > 3 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="w-7 md:w-10 h-7 md:h-10 text-xs md:text-sm rounded-lg bg-black/20 border border-yellow-600/20 text-yellow-400 hover:bg-yellow-700/20 transition-colors"
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
                          className={`w-7 md:w-10 h-7 md:h-10 text-xs md:text-sm rounded-lg border transition-colors ${
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
                          className="w-7 md:w-10 h-7 md:h-10 text-xs md:text-sm rounded-lg bg-black/20 border border-yellow-600/20 text-yellow-400 hover:bg-yellow-700/20 transition-colors"
                        >
                          {pagination.totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    title="Next"
                    onClick={handleNextPage}
                    disabled={!pagination.hasNextPage}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      pagination.hasNextPage
                        ? 'bg-black/20 border-yellow-600/20 text-yellow-400 hover:bg-yellow-700/20'
                        : 'bg-gray-800/20 border-gray-600/20 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRight/>
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