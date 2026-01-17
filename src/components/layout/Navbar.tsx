import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { Navigation } from '../../constants/navLinks';
import { useProducts } from '../../hooks/useProducts';
import { formatCategoryName } from '../../utils/searchUtils';
import { SearchBar } from '../search';

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSearchBar, setOpenSearchBar] = useState(false);

    const { getTotalItems } = useCart();

    // Fetch ALL products to extract categories for mobile menu
    const { products: allProducts, loading: allProductsLoading } = useProducts({
        page: 1,
        limit: 10000, // High limit to ensure we get all products for category extraction
    });

    // Extract categories from ALL products for mobile menu
    const categories = useMemo(() => {
        if (!allProducts || allProducts.length === 0) {
            return [];
        }

        const categoryMap = new Map<string, number>();

        allProducts.forEach(product => {
            if (product.category) {
                const cat = product.category.toLowerCase();
                categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
            }
        });

        console.log(`Navbar: Processed ${allProducts.length} products, found ${categoryMap.size} unique categories:`, Array.from(categoryMap.keys()));

        return Array.from(categoryMap.entries())
            .map(([id, count]) => ({
                id,
                name: formatCategoryName(id),
                href: `/shop?category=${id}`,
                count
            }))
            .sort((a, b) => b.count - a.count); // Sort by count descending
    }, [allProducts]);

    // Toggle handlers with mutual exclusion
    const handleSearchToggle = () => {
        setOpenSearchBar(prev => !prev);
        setIsMenuOpen(false);
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
        setOpenSearchBar(false);
    };

    const closeAll = () => {
        setOpenSearchBar(false);
        setIsMenuOpen(false);
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
                                className="text-yellow-500/70 hover:text-white/20 font-normal transition-colors relative group duration-300"
                                onClick={closeAll}
                            >
                                {item.name}
                                <span className="absolute -bottom-2 left-0 w-1 h-1 rounded-full bg-white/20 transition-all duration-300 group-hover:w-full"></span>
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
                <SearchBar 
                    isOpen={openSearchBar} 
                    onClose={closeAll}
                />

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
                            <div className="py-4 pb-6">
                                <div className="flex flex-col space-y-4">
                                    {Navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="text-gray-300 text-sm hover:text-yellow-800 font-medium py-2 px-4 mx-2 hover:pl-2 duration-300 hover:bg-yellow-600/20 rounded transition-colors"
                                            onClick={closeAll}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}

                                    {/* Mobile Categories */}
                                    <div className="p-4 border-t border border-yellow-600/20">
                                        <h4 className="font-semibold text-yellow-400 mb-3">Categories</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {allProductsLoading ? (
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
                                                        className="text-sm py-1 text-gray-300 hover:pl-2 duration-300 hover:text-yellow-600 hover:bg-yellow-600/20 rounded transition-colors"
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