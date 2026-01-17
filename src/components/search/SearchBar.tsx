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

  // Fetch ALL products to extract categories and enable frontend search
  const { products: allProducts, loading: allLoading, error: productsError } = useProducts({
    page: 1,
    limit: 10000, // High limit to ensure we get all products for category extraction and search
  });

  // Debug logging for product loading
  useEffect(() => {
    if (productsError) {
      console.error('SearchBar: Error loading products:', productsError);
    }
    if (allProducts) {
      console.log(`SearchBar: Loaded ${allProducts.length} products for search`);
    }
  }, [allProducts, productsError]);

  // Extract categories from ALL products and prepare for search
  const { processedCategories, filteredProducts } = useMemo(() => {
    if (!allProducts || allProducts.length === 0) {
      console.warn('SearchBar: No products available for search');
      return { processedCategories: [], filteredProducts: [] };
    }

    // Extract ALL categories from ALL products
    const categoryMap = new Map<string, number>();

    allProducts.forEach(product => {
      if (product.category) {
        const cat = product.category.toLowerCase();
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      }
    });

    console.log(`SearchBar: Processed ${allProducts.length} products, found ${categoryMap.size} unique categories`);

    // Convert categories to the expected format
    const processedCategories = Array.from(categoryMap.entries())
      .map(([id, count]) => ({
        id,
        name: formatCategoryName(id),
        href: `/shop?category=${id}`,
        count
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    return { 
      processedCategories, 
      filteredProducts: allProducts 
    };
  }, [allProducts]);

  // Frontend search function - More comprehensive and robust
  const performFrontendSearch = useMemo(() => {
    return (query: string): Product[] => {
      if (!query.trim() || !filteredProducts.length) return [];

      const searchTerm = query.toLowerCase().trim();
      const searchWords = searchTerm.split(/\s+/); // Split into individual words
      
      return filteredProducts.filter(product => {
        const searchableText = [
          product.name || '',
          product.description || '',
          product.category || '',
          product.brand || '',
          product.sku || '',
          product.ecommerceData?.seoTitle || '',
          product.ecommerceData?.seoDescription || '',
          ...(product.ecommerceData?.tags || [])
        ].join(' ').toLowerCase();

        // Check if all search words are found in the searchable text
        const allWordsMatch = searchWords.every(word => 
          searchableText.includes(word)
        );

        // Also check for exact phrase match
        const exactPhraseMatch = searchableText.includes(searchTerm);

        // Check individual fields for better relevance
        const nameMatch = product.name?.toLowerCase().includes(searchTerm);
        const categoryMatch = product.category?.toLowerCase().includes(searchTerm);
        const brandMatch = product.brand?.toLowerCase().includes(searchTerm);
        const descriptionMatch = product.description?.toLowerCase().includes(searchTerm);
        
        // Check tags
        const tagMatch = product.ecommerceData?.tags?.some(tag => 
          tag.toLowerCase().includes(searchTerm) || 
          searchWords.some(word => tag.toLowerCase().includes(word))
        );

        return allWordsMatch || exactPhraseMatch || nameMatch || categoryMatch || brandMatch || descriptionMatch || tagMatch;
      })
      .sort((a, b) => {
        // Sort by relevance - exact name matches first
        const aNameMatch = a.name?.toLowerCase().includes(searchTerm) ? 1 : 0;
        const bNameMatch = b.name?.toLowerCase().includes(searchTerm) ? 1 : 0;
        
        if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch;
        
        // Then by category matches
        const aCategoryMatch = a.category?.toLowerCase().includes(searchTerm) ? 1 : 0;
        const bCategoryMatch = b.category?.toLowerCase().includes(searchTerm) ? 1 : 0;
        
        return bCategoryMatch - aCategoryMatch;
      })
      .slice(0, 50); // Increase limit for better results
    };
  }, [filteredProducts]);

  // Debounced search function with caching and better error handling
  const debouncedSearch = useMemo(
    () => debounce(async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      const validation = validateSearchQuery(query);
      if (!validation.isValid) {
        console.warn('Invalid search query:', validation.message);
        setResults([]);
        setIsSearching(false);
        return;
      }

      // Check cache first
      const cachedResults = getCachedResults(query);
      if (cachedResults) {
        console.log(`SearchBar: Using cached results for "${query}"`);
        setResults(cachedResults);
        setIsSearching(false);
        return;
      }

      try {
        console.log(`SearchBar: Performing search for "${query}" across ${filteredProducts.length} products`);
        const searchResults = performFrontendSearch(query.trim());
        console.log(`SearchBar: Found ${searchResults.length} results for "${query}"`);
        
        setResults(searchResults);
        
        // Cache the results
        setCachedResults(query, searchResults);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200), // Reduced debounce time for faster response
    [performFrontendSearch, getCachedResults, setCachedResults, filteredProducts.length]
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

  // Handle search input change with immediate feedback
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Show loading state immediately
    setIsSearching(true);
    
    // For very short queries, search immediately without debounce
    if (value.trim().length <= 2) {
      const quickResults = performFrontendSearch(value.trim());
      setResults(quickResults.slice(0, 10)); // Limit quick results
      setIsSearching(false);
      return;
    }

    // Use debounced search for longer queries
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
    const matchedCategory = matchCategory(trimmedQuery, processedCategories);

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

          {/* Loading indicator for products */}
          {allLoading && !searchQuery && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-gray-300">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                <span className="text-sm">Loading products...</span>
              </div>
            </div>
          )}

          {/* Error state */}
          {productsError && !searchQuery && (
            <div className="mt-4 text-center">
              <p className="text-red-400 text-sm">
                Unable to load products. Please refresh the page.
              </p>
            </div>
          )}

          {/* No products available */}
          {!allLoading && !productsError && filteredProducts.length === 0 && !searchQuery && (
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                No products available for search.
              </p>
            </div>
          )}

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

          {/* Search Suggestions - only show when not searching and products are loaded */}
          {!searchQuery && !allLoading && filteredProducts.length > 0 && (
            <SearchSuggestions
              categories={processedCategories}
              allLoading={allLoading}
              hasHistory={hasHistory}
              getRecentSearches={getRecentSearches}
              getPopularSearches={getPopularSearches}
              removeSearchTerm={removeSearchTerm}
              clearSearchHistory={clearSearchHistory}
              filteredProducts={filteredProducts}
              onSearchSelect={(query: string) => {
                setSearchQuery(query);
                handleSearchChange(query); // Trigger search immediately
                searchInputRef.current?.focus();
              }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchBar;