import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { products } from '../constants/mockData';
import Header from '../components/layout/Header';

const ShopPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Categories data
  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'men', name: "Men's Perfumes", count: products.filter(p => p.gender === 'men').length },
    { id: 'women', name: "Women's Perfumes", count: products.filter(p => p.gender === 'women').length },
    { id: 'unisex', name: 'Unisex Perfumes', count: products.filter(p => p.gender === 'unisex').length },
    { id: 'luxury', name: 'Luxury Collection', count: products.filter(p => p.category === 'luxury').length },
    { id: 'body-sprays', name: 'Body Sprays & Deodorants', count: products.filter(p => p.category === 'body-sprays').length },
    { id: 'gift-sets', name: 'Gift Sets', count: products.filter(p => p.category === 'gift-sets').length },
  ];

  // Brands data
  const brands = Array.from(new Set(products.map(p => p.brand))).sort();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      if (['men', 'women', 'unisex'].includes(selectedCategory)) {
        filtered = filtered.filter(p => p.gender === selectedCategory);
      } else {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Filter by genders
    if (selectedGenders.length > 0) {
      filtered = filtered.filter(p => selectedGenders.includes(p.gender));
    }

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
        break;
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'best-selling':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy, priceRange, selectedBrands, selectedGenders]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleGenderToggle = (gender: string) => {
    setSelectedGenders(prev =>
      prev.includes(gender)
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setSelectedBrands([]);
    setSelectedGenders([]);
  };

  return (
    <>
    <Header title='Shop Perfumes' descripton='Discover our curated collection of premium fragrances'/>
    <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:w-80">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/20 backdrop-blur-lg rounded-lg border border-yellow-600/20 shadow-2xl p-6 sticky top-24"
            >
              {/* Filters Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-yellow-500 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-yellow-800/30 text-yellow-500 font-medium'
                          : 'text-gray-300 hover:bg-yellow-700/30'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-100">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-yellow-500 mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div>
                    <input
                      title='Price Range'
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-1 bg-yellow-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-200">
                      <span>₵0</span>
                      <span>₵{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="font-medium text-yellow-500 mb-3">Brands</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-200">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <h3 className="font-medium text-yellow-500 mb-3">Gender</h3>
                <div className="space-y-2">
                  {['men', 'women', 'unisex'].map((gender) => (
                    <label key={gender} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes(gender)}
                        onChange={() => handleGenderToggle(gender)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-200 capitalize">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-black/20 rounded-lg border border-yellow-600/20 shadow-2xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-200">
                    <span className='bg-yellow-600/20 text-yellow-400 px-4 py-1.5 rounded-lg border border-yellow-600/20'>{filteredProducts.length}</span> products found
                  </span>
                  
                  {/* Mobile Filters Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex border border-yellow-600/20 rounded-lg overflow-hidden">
                    <button
                      title='Grid'
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-yellow-600/20 text-white' : 'text-white'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      title='List'
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-yellow-600/20 text-white' : 'text-white'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-200">Sort by:</span>
                    <select
                      title='Sort By'
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="newest">Newest</option>
                      <option value="best-selling">Best Selling</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mt-4 p-4 border-t"
                >
                  {/* Mobile filters content would go here */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Price Range</h3>
                      <input
                        title='Price Range'
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                    {/* Add other mobile filters as needed */}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div
                layout
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ShopPage;