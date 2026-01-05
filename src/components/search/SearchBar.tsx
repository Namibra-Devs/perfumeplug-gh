// src/components/search/SearchBar.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Product } from '../../types/product';
import { useProducts } from '../../hooks/useProducts';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useSearchCache } from '../../hooks/useSearchCache';
import { matchCategory, debounce, formatCategoryName, validateSearchQuery } from '../../utils/searchUtils';
import { SearchResults, SearchSuggestions } from './index';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Search history management
  const { 
    addSearchTerm, 
    removeSearchTerm, 
    clearSearchHistory, 
    getPopularSearches, 
    getRecentSearches,
    hasHistory 
  } = useSearchHistory();

  // Search cache for performance
  const { getCachedResults, setCachedResults } = useSearchCache();

  // Fetch all products to extract categories and enable frontend search
  const { products: allProducts, loading: allLoading } = useProducts({
    page: 1,
    limit: 500, // Adjust based on your needs
  });

  // Extract unique categories from all products
  const { categories, filteredProducts } = useMemo(() => {
    if (!allProducts || allProducts.length === 0) {
      return { categories: [], filteredProducts: [] };
    }

    // Get unique categories with counts
    const categoryMap = new Map<string, number>();

    allProducts.forEach(product => {
      if (product.category) {
        const cat = product.category.toLowerCase();
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      }
    });

    const categories = Array.from(categoryMap.entries())
      .map(([id, count]) => ({
        id,
        name: formatCategoryName(id),
        href: `/shop?category=${id}`,
        count
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    return { categories, filteredProducts: allProducts };
  }, [allProducts]);

  // Frontend search function
  const performFrontendSearch = useMemo(() => {
    return (query: string): Product[] => {
      if (!query.trim() || !filteredProducts.length) return [];

      const searchTerm = query.toLowerCase().trim();
      
      return filteredProducts.filter(product => {
        // Search in product name
        if (product.name.toLowerCase().includes(searchTerm)) return true;
        
        // Search in description
        if (product.description?.toLowerCase().includes(searchTerm)) return true;
        
        // Search in category
        if (product.category?.toLowerCase().includes(searchTerm)) return true;
        
        // Search in SEO title and description
        if (product.ecommerceData?.seoTitle?.toLowerCase().includes(searchTerm)) return true;
        if (product.ecommerceData?.seoDescription?.toLowerCase().includes(searchTerm)) return true;
        
        // Search in tags
        if (product.ecommerceData?.tags?.some(tag => 
          tag.toLowerCase().includes(searchTerm)
        )) return true;
        
        return false;
      }).slice(0, 20); // Limit results for performance
    };
  }, [filteredProducts]);

  // Debounced search function with caching
  const debouncedSearch = useMemo(
    () => debounce(async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      const validation = validateSearchQuery(query);
      if (!validation.isValid) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      // Check cache first
      const cachedResults = getCachedResults(query);
      if (cachedResults) {
        setResults(cachedResults);
        setIsSearching(false);
        return;
      }

      try {
        const searchResults = performFrontendSearch(query.trim());
        setResults(searchResults);
        
        // Cache the results
        setCachedResults(query, searchResults);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [performFrontendSearch, getCachedResults, setCachedResults]
  );

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation and close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debouncedSearch(value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSearchQuery(searchQuery);
    if (!validation.isValid) {
      console.warn('Invalid search query:', validation.message);
      return;
    }

    const trimmedQuery = searchQuery.trim();
    
    // Add to search history
    addSearchTerm(trimmedQuery);
    
    onClose();
    
    // Check if it matches a known category
    const matchedCategory = matchCategory(trimmedQuery, categories);

    if (matchedCategory) {
      navigate(`/shop?category=${matchedCategory.id}`);
    } else {
      navigate(`/shop?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  // Handle view all results
  const handleViewAllResults = () => {
    onClose();
    navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`search-container block absolute top-full left-0 right-0 bg-gradient-to-r from-black/100 to-yellow-700/95 shadow-xl z-40 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search perfumes, brands, categories..."
              className="w-full pl-12 pr-24 py-3 text-sm bg-transparent text-white border border-yellow-600/20 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              autoFocus
            />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-2">
              <button
                title="Search"
                type="submit"
                className="bg-blue-600 text-white px-3 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <Search className='h-5 w-5'/>
              </button>
            </div>
          </form>

          {/* Search Results */}
          {searchQuery && (
            <SearchResults
              query={searchQuery}
              results={results}
              isSearching={isSearching}
              onProductSelect={handleProductSelect}
              onViewAllResults={handleViewAllResults}
            />
          )}

          {/* Search Suggestions */}
          <SearchSuggestions
            categories={categories}
            allLoading={allLoading}
            hasHistory={hasHistory}
            getRecentSearches={getRecentSearches}
            getPopularSearches={getPopularSearches}
            removeSearchTerm={removeSearchTerm}
            clearSearchHistory={clearSearchHistory}
            filteredProducts={filteredProducts}
            onSearchSelect={(query: string) => {
              setSearchQuery(query);
              searchInputRef.current?.focus();
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchBar;