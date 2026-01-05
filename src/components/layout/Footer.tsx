import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/90 text-white">
      <div className="px-6 sm:px-6 lg:px-32 pt-20 pb-6">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 lg:gap-3">
          {/* Company Info */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link to="/" className="flex items-center mb-4 md:mb-2">
                <img src="/favicon.png" alt="PP" className='w-28' />
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your trusted source for authentic and affordable perfumes in Ghana. 
              Experience luxury with our curated collection of premium fragrances.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1 md:pl-14">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <ArrowRight className="h-3 w-3 mr-2" /> Shop All
              </Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <ArrowRight className="h-3 w-3 mr-2" /> About Us
              </Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <ArrowRight className="h-3 w-3 mr-2" /> Contact
              </Link></li>
              <li><Link to="/account" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <ArrowRight className="h-3 w-3 mr-2" /> My Account
              </Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop?category=men" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <ArrowRight className="h-3 w-3 mr-2" /> Men's Perfumes
              </Link></li>
              <li><Link to="/shop?category=women" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <ArrowRight className="h-3 w-3 mr-2" /> Women's Perfumes
              </Link></li>
              <li><Link to="/shop?category=unisex" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <ArrowRight className="h-3 w-3 mr-2" /> Unisex
              </Link></li>
              <li><Link to="/shop?category=luxury" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <ArrowRight className="h-3 w-3 mr-2" /> Luxury Collection
              </Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-gray-400">+233 50-666-2618</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-gray-400">info@perfumeplug.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">Legon, Accra, Ghana</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Hours: Mon-Fri: 8:00 AM - 8:00 PM</p>
              <p className="text-xs text-gray-400">Sat-Sun: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        {/* <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
              <p className="text-gray-400 text-sm">Subscribe to our newsletter for the latest updates and offers</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-auto md:flex-1 px-4 py-3 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col lg:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 PerfumePlug Ghana. All rights reserved.
          </p>
          <div className="flex gap-4 md:gap-6 mt-4 lg:mt-0 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">Terms of Service</Link>
            <Link to="/shipping" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;