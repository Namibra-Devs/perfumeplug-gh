// src/components/search/SearchSuggestions.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Product } from '../../types/product';
import { SearchHistoryItem } from '../../hooks/useSearchHistory';

interface CategoryMatch {
  id: string;
  name: string;
  href: string;
  count?: number;
}

interface SearchSuggestionsProps {
  categories: CategoryMatch[];
  allLoading: boolean;
  hasHistory: boolean;
  getRecentSearches: (limit: number) => SearchHistoryItem[];
  getPopularSearches: (limit: number) => SearchHistoryItem[];
  removeSearchTerm: (id: string) => void;
  clearSearchHistory: () => void;
  filteredProducts: Product[];
  onSearchSelect: (query: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  categories,
  allLoading,
  hasHistory,
  getRecentSearches,
  getPopularSearches,
  removeSearchTerm,
  clearSearchHistory,
  filteredProducts,
  onSearchSelect
}) => {
  return (
    <div className="mt-12 md:mt-4">
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Categories */}
        <div>
          <h4 className="font-semibold text-yellow-400 mb-2">Categories</h4>
          <div className="space-y-1">
            {allLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-6 bg-yellow-900/20 animate-pulse rounded-md"
                />
              ))
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={category.href}
                  className="block text-sm py-1 text-gray-300 hover:pl-2 duration-300 hover:text-yellow-600 hover:bg-yellow-600/20 rounded transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <span className="text-gray-200 text-xs">({category.count})</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No categories available</p>
            )}
          </div>
        </div>
        
        {/* Search History */}
        {hasHistory && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-yellow-400">Recent Searches</h4>
              <button
                onClick={clearSearchHistory}
                className="text-xs text-gray-200 hover:text-red-400 transition-colors"
                title="Clear all search history"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-1">
              {getRecentSearches(6).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between group hover:bg-yellow-600/20 rounded transition-colors"
                >
                  <button
                    onClick={() => onSearchSelect(item.query)}
                    className="flex-1 text-left text-sm py-1 pl-2 text-gray-300 hover:text-yellow-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.query}</span>
                      {item.count > 1 && (
                        <span className="text-xs text-gray-500 bg-gray-700/50 px-1.5 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => removeSearchTerm(item.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-all"
                    title="Remove from history"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches from History */}
        {hasHistory && getPopularSearches(4).length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-yellow-400 mb-2">Popular Searches</h4>
            <div className="space-y-1">
              {getPopularSearches(4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between group hover:bg-yellow-600/20 rounded transition-colors"
                >
                  <button
                    onClick={() => onSearchSelect(item.query)}
                    className="flex-1 text-left text-sm py-1 pl-2 text-gray-300 hover:text-yellow-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.query}</span>
                      <span className="text-xs text-blue-400 bg-blue-600/20 px-1.5 py-0.5 rounded-full">
                        {item.count} searches
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => removeSearchTerm(item.id)}
                    className="p-1 text-gray-200 hover:text-red-400 transition-all"
                    title="Remove from history"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Default Search Suggestions (when no history) */}
        {!hasHistory && !allLoading && filteredProducts.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-yellow-400 mb-2">Try Searching For</h4>
            <div className="space-y-1">
              {['perfume', 'fragrance', 'cologne', 'scent', 'luxury', 'gift'].map((term) => (
                <button
                  key={term}
                  onClick={() => onSearchSelect(term)}
                  className="block text-sm w-full text-left py-1 text-gray-300 hover:pl-2 duration-300 ease-out hover:text-yellow-600 hover:bg-yellow-600/20 rounded transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;