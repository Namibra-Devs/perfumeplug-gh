import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSearchBar, setOpenSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { getTotalItems } = useCart();

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const categories = [
        { name: "Men's Perfumes", href: '/shop?category=men' },
        { name: "Women's Perfumes", href: '/shop?category=women' },
        { name: 'Unisex', href: '/shop?category=unisex' },
        { name: 'Luxury Collection', href: '/shop?category=luxury' },
        { name: 'Body Sprays', href: '/shop?category=body-sprays' },
        { name: 'Gift Sets', href: '/shop?category=gift-sets' },
    ];

    // Toggle handlers with mutual exclusion
    const handleSearchToggle = () => {
        setOpenSearchBar(true);
        setIsMenuOpen(false); // Close mobile menu when opening search
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

    // Close when clicking outside (for desktop search)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (openSearchBar && !(e.target as Element).closest('.search-container')) {
                closeAll();
            }
        };

        if (openSearchBar) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openSearchBar]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            closeAll();
        }
    };

    return (
        <header className={`${isMenuOpen ? "bg-white" : 'bg-gradient-to-r from-black to-yellow-700 bg-cover bg-no-repeat top-0'} sticky top-0 z-50`}>
            <div className="mx-auto px-6 sm:px-6 lg:px-32 relative z-50">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center" onClick={closeAll}>
                        <img src="/favicon.png" alt="PP" className='w-28' />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navigation.map((item) => (
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
                    <div className={`${isMenuOpen ? "text-gray-600" : 'text-yellow-400'} flex items-center gap-2 md:gap-4`}>
                        {/* Mobile Search Button */}
                        <button
                            onClick={handleSearchToggle}
                            title='Search'
                            className="lg:hidden p-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        {/* Desktop Search Button */}
                        <button
                            onClick={handleSearchToggle}
                            title='Search'
                            className="hidden lg:flex p-2 hover:text-white bg-yellow-700/80 hover:bg-yellow-700/60 rounded-lg transition-colors"
                        >
                            <Search className="h-4 w-4" />
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
                            className={`lg:hidden p-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${isMenuOpen ? "bg-blue-50" : ""}`}
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
                            className="search-container block absolute top-full left-0 right-0 bg-white shadow-xl border-t z-40"
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search perfumes, brands, categories..."
                                        className="w-full pl-12 pr-24 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={closeAll}
                                            className="px-3 py-2 bg-blue-100 rounded-xl text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            X
                                        </button>
                                        <button
                                            title="Search"
                                            type="submit"
                                            className="bg-blue-600 text-white px-3 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            <Search className='h-5 w-5'/>
                                        </button>
                                    </div>
                                </form>

                                {/* Search Suggestions */}
                                <div className="mt-12 md:mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Popular Brands</h4>
                                        <div className="space-y-1">
                                            {['Chanel', 'Dior', 'Tom Ford', 'Creed', 'Versace', 'Gucci'].map((brand) => (
                                                <button
                                                    key={brand}
                                                    onClick={() => {
                                                        setSearchQuery(brand);
                                                        searchInputRef.current?.focus();
                                                    }}
                                                    className="block w-full text-left py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                >
                                                    {brand}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Categories</h4>
                                        <div className="space-y-1">
                                            {categories.map((category) => (
                                                <Link
                                                    key={category.name}
                                                    to={category.href}
                                                    onClick={closeAll}
                                                    className="block py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                >
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
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
                            className="lg:hidden border-t block absolute top-full left-0 right-0 bg-white"
                        >
                            <div className="py-4">
                                <div className="flex flex-col space-y-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 hover:bg-blue-50 rounded-lg transition-colors"
                                            onClick={closeAll}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}

                                    {/* Mobile Categories */}
                                    <div className="p-4 border-t">
                                        <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {categories.map((category) => (
                                                <Link
                                                    key={category.name}
                                                    to={category.href}
                                                    className="text-sm text-gray-600 hover:text-blue-600 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                                                    onClick={closeAll}
                                                >
                                                    {category.name}
                                                </Link>
                                            ))}
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