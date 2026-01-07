import { Phone } from "lucide-react";
import React from "react";
import { Navbar } from "./Navbar";
import { motion } from "framer-motion";

type HeaderProps = {
  title: string;
  descripton: string | undefined;
}
const Header: React.FC<HeaderProps> = ({title="", descripton=""}) => {

  return (
    <header className="bg-gradient-to-r from-black to-yellow-700 bg-cover bg-no-repeat top-0 ">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2 px-2 sm:px-6 lg:px-32">
        <div className="mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span className="text-xs">+233 50-666-2618</span>
            </div>
            <span className="text-xs">Free shipping on orders over ₵200</span>
          </div>
          <div className="hidden md:block">
            <span className="text-xs">Shop hours: Mon-Fri: 8:00 AM - 8:00 PM</span>
          </div>
        </div>
      </div>
         
      <Navbar/>

      <div className="flex flex-col md:items-center md:text-center gap-4 py-12 px-6 max-w-4xl mx-auto">
        <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl lg:text-4xl font-bold text-capitalize text-white"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8}}
            className="text-sm md:text-lg md:text-center text-blue-100"
          >
            {descripton}
          </motion.p>
      </div>
    </header>
  );
};

export default Header;