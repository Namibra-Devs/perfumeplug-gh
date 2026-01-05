// src/components/search/SearchResults.tsx
import React from 'react';
import { Product } from '../../types/product';

interface SearchResultsProps {
  query: string;
  results: Product[];
  isSearching: boolean;
  onProductSelect: (productId: string) => void;
  onViewAllResults: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  isSearching,
  onProductSelect,
  onViewAllResults
}) => {
  return (
    <div className="mt-4 bg-black/40 border border-yellow-600/20 backdrop-blur-lg rounded-xl p-3 max-h-80 overflow-y-auto">
      {isSearching && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
          <p className="text-gray-300 text-sm ml-3">Searching...</p>
        </div>
      )}

      {!isSearching && results.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">No products found for "{query}"</p>
          <p className="text-gray-500 text-xs mt-1">Try different keywords or browse categories below</p>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-yellow-400 text-sm font-medium">
              {results.length} product{results.length !== 1 ? 's' : ''} found
            </p>
            <button
              onClick={onViewAllResults}
              className="text-blue-400 hover:text-blue-300 text-xs underline"
            >
              View all results
            </button>
          </div>
          
          <ul className="space-y-2">
            {results.slice(0, 8).map((product) => (
              <li key={product._id}>
                <button
                  onClick={() => onProductSelect(product._id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-600/20 transition-all duration-200 group"
                >
                  <div className="relative">
                    <img
                      src={product.ecommerceData?.images?.[0]?.url || product.images?.[0]?.url || '/placeholder-product.svg'}
                      className="w-12 h-12 rounded-lg object-cover border border-yellow-600/20"
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                      }}
                    />
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-yellow-300 transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-yellow-400 text-sm font-semibold">
                        ₵{product.sellingPrice?.toFixed(2) || '0.00'}
                      </p>
                      {product.category && (
                        <span className="text-gray-400 text-xs px-2 py-0.5 bg-gray-700/30 rounded-full">
                          {product.category.replace('-', ' ')}
                        </span>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-gray-400 text-xs mt-1 truncate">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="text-gray-400 group-hover:text-yellow-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          
          {results.length > 8 && (
            <div className="mt-3 pt-3 border-t border-yellow-600/20">
              <button
                onClick={onViewAllResults}
                className="w-full text-center py-2 text-blue-400 hover:text-blue-300 text-sm font-medium hover:bg-blue-600/10 rounded-lg transition-colors"
              >
                View all {results.length} results →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;