import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types/product';
import { Navigation } from '../../constants/navLinks';
import { useProducts } from '../../hooks/useProducts';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { matchCategory, debounce, formatCategoryName, validateSearchQuery } from '../../utils/searchUtils';

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSearchBar, setOpenSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { getTotalItems } = useCart();
    
    // Search history management
    const { 
        addSearchTerm, 
        removeSearchTerm, 
        clearSearchHistory, 
        getPopularSearches, 
        getRecentSearches,
        hasHistory 
    } = useSearchHistory();

    // Fetch all products to extract categories and enable frontend search
    const { products: allProducts, loading: allLoading } = useProducts({
        page: 1,
        limit: 500, // Reduced limit since we're doing frontend search - adjust based on your needs
    });

    // Extract unique categories from all products (removed brands since they don't exist)
    const { categories, filteredProducts } = useMemo(() => {
        if (!allProducts || allProducts.length === 0) {
            return { categories: [], filteredProducts: [] };
        }

        // Get unique categories with counts
        const categoryMap = new Map<string, number>();

        allProducts.forEach(product => {
            // Categories
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

    // Toggle handlers with mutual exclusion
    const handleSearchToggle = () => {
        setOpenSearchBar(prev => !prev);
        setIsMenuOpen(false); // Close mobile menu when toggling search
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
        setOpenSearchBar(false); // Close search when opening mobile menu
    };

    const closeAll = () => {
        setOpenSearchBar(false);
        setIsMenuOpen(false);
        setSearchQuery('');
    };

    // Focus search input when opened
    useEffect(() => {
        if (openSearchBar && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [openSearchBar]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);

    // Close search on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeAll();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

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
        
        closeAll();
        
        // Check if it matches a known category using the utility function
        const matchedCategory = matchCategory(trimmedQuery, categories);

        if (matchedCategory) {
            // Navigate to shop with category filter
            navigate(`/shop?category=${matchedCategory.id}`);
        } else {
            // Navigate to shop with search query filter
            navigate(`/shop?q=${encodeURIComponent(trimmedQuery)}`);
        }
    };

    // Frontend search function - more efficient than API calls
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

    // Debounced search function - now uses frontend search
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

            try {
                // Use frontend search instead of API call
                const searchResults = performFrontendSearch(query.trim());
                setResults(searchResults);
            } catch (error) {
                console.error("Search failed:", error);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300), // Reduced debounce time since it's frontend search
        [performFrontendSearch]
    );

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (!value.trim()) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        debouncedSearch(value);
    };


    return (
        <header className={`${isMenuOpen ? "bg-gradient-to-r from-black/100 to-yellow-700/95" : 'bg-gradient-to-r from-black to-yellow-700 bg-cover bg-no-repeat top-0'} sticky top-0 z-50`}>
            <div className="mx-auto px-6 sm:px-6 lg:px-32 relative z-50">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center" onClick={closeAll}>
                        <img src="/favicon.png" alt="PP" className='w-28' />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {Navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="text-yellow-500/70 hover:text-white/20 font-normal text-sm transition-colors relative group duration-300"
                                onClick={closeAll}
                            >
                                {item.name}
                                <span className="absolute -bottom-2 left-0 w-0 h-0.5 rounded-full bg-white/20 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons */}
                    <div className={`${isMenuOpen ? "text-yellow-400" : 'text-yellow-400'} flex items-center gap-2 md:gap-4`}>
                        {/* Mobile Search Button */}
                        <button
                            onClick={handleSearchToggle}
                            title='Search'
                            className="lg:hidden p-2 hover:text-white bg-yellow-600/30 hover:bg-yellow-600/20 rounded-lg transition-colors"
                        >
                            {openSearchBar ? (
                                <X className="h-4 w-4" />   // shows close icon when search is open
                            ) : (
                                <Search className="h-4 w-4" /> // shows search icon when closed
                            )}
                        </button>

                        {/* Desktop Search Button */}
                        <button
                            onClick={handleSearchToggle}
                            title='Search'
                            className="hidden lg:flex p-2 hover:text-white bg-yellow-700/80 hover:bg-yellow-700/60 rounded-lg transition-colors"
                        >
                            {openSearchBar ? (
                                <X className="h-4 w-4" />   // shows close icon when search is open
                            ) : (
                                <Search className="h-4 w-4" /> // shows search icon when closed
                            )}
                        </button>
                        
                        <Link
                            to="/cart"
                            className="relative p-2 hover:text-white bg-yellow-700/80 hover:bg-yellow-700/60 rounded-lg transition-colors"
                            onClick={closeAll}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/account"
                            className="p-2 hover:text-white bg-yellow-700/80 hover:bg-yellow-700/60 rounded-lg transition-colors"
                            onClick={closeAll}
                        >
                            <User className="h-4 w-4" />
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            className={`lg:hidden p-2 hover:text-white bg-yellow-700/80 hover:bg-yellow-700/60 rounded-lg transition-colors ${isMenuOpen ? "bg-blue-50" : ""}`}
                            onClick={handleMenuToggle}
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Desktop Expanded Search */}
                <AnimatePresence>
                    {openSearchBar && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="search-container block absolute top-full left-0 right-0 bg-gradient-to-r from-black/100 to-yellow-700/95 shadow-xl z-40"
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

                                {/* LIVE SEARCH RESULTS */}
                                {searchQuery && (
                                <div className="mt-4 bg-black/40 border border-yellow-600/20 backdrop-blur-lg rounded-xl p-3 max-h-80 overflow-y-auto">

                                    {isSearching && (
                                    <div className="flex items-center justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                                        <p className="text-gray-300 text-sm ml-3">Searching...</p>
                                    </div>
                                    )}

                                    {!isSearching && results.length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="text-gray-400 text-sm">No products found for "{searchQuery}"</p>
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
                                                onClick={() => {
                                                    closeAll();
                                                    navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                                                }}
                                                className="text-blue-400 hover:text-blue-300 text-xs underline"
                                            >
                                                View all results
                                            </button>
                                        </div>
                                        <ul className="space-y-2">
                                            {results.slice(0, 8).map((p) => (
                                            <li key={p._id}>
                                                <button
                                                onClick={() => {
                                                    closeAll();
                                                    navigate(`/product/${p._id}`);
                                                }}
                                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-600/20 transition-all duration-200 group"
                                                >
                                                <div className="relative">
                                                    <img
                                                        src={p.ecommerceData?.images?.[0]?.url || p.images?.[0]?.url || '/placeholder-product.svg'}
                                                        className="w-12 h-12 rounded-lg object-cover border border-yellow-600/20"
                                                        alt={p.name}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-1 text-left min-w-0">
                                                    <p className="text-white text-sm font-medium truncate group-hover:text-yellow-300 transition-colors">
                                                        {p.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-yellow-400 text-sm font-semibold">
                                                            ₵{p.sellingPrice?.toFixed(2) || '0.00'}
                                                        </p>
                                                        {p.category && (
                                                            <span className="text-gray-400 text-xs px-2 py-0.5 bg-gray-700/30 rounded-full">
                                                                {p.category.replace('-', ' ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {p.description && (
                                                        <p className="text-gray-400 text-xs mt-1 truncate">
                                                            {p.description}
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
                                                    onClick={() => {
                                                        closeAll();
                                                        navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                                                    }}
                                                    className="w-full text-center py-2 text-blue-400 hover:text-blue-300 text-sm font-medium hover:bg-blue-600/10 rounded-lg transition-colors"
                                                >
                                                    View all {results.length} results →
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    )}
                                </div>
                                )}

                                {/* Search Suggestions */}
                                <div className="mt-12 md:mt-4">
                                    <div className='grid grid-cols-1 gap-4'>
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
                                                            onClick={closeAll}
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
                                                        className="text-xs text-gray-400 hover:text-red-400 transition-colors"
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
                                                                onClick={() => {
                                                                    setSearchQuery(item.query);
                                                                    searchInputRef.current?.focus();
                                                                }}
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
                                                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all"
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
                                                                onClick={() => {
                                                                    setSearchQuery(item.query);
                                                                    searchInputRef.current?.focus();
                                                                }}
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
                                                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all"
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
                                                            onClick={() => {
                                                                setSearchQuery(term);
                                                                searchInputRef.current?.focus();
                                                            }}
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
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden border-b-4 border-yellow-400 block absolute top-full left-0 right-0  bg-gradient-to-r from-black/100 to-yellow-700/95"
                        >
                            <div className="py-4">
                                <div className="flex flex-col space-y-4">
                                    {Navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="text-gray-300 text-sm hover:text-yellow-800 font-medium py-2 px-4 hover:bg-blue-50 rounded-lg transition-colors"
                                            onClick={closeAll}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}

                                    {/* Mobile Categories */}
                                    <div className="p-4 border-t border border-yellow-600/20">
                                        <h4 className="font-semibold text-yellow-400 mb-3">Categories</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {allLoading ? (
                                                Array.from({ length: 4 }).map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="h-8 bg-yellow-900/20 animate-pulse rounded-md"
                                                    />
                                                ))
                                            ) : categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <Link
                                                        key={category.id}
                                                        to={category.href}
                                                        className="text-sm text-gray-300 hover:text-blue-600 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                                                        onClick={closeAll}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span>{category.name}</span>
                                                            <span className="text-gray-200 text-xs">({category.count})</span>
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-sm col-span-2">No categories available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};