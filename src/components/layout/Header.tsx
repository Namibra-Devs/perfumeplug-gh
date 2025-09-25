import { Phone } from "lucide-react";
import React from "react";
import { Navbar } from "./Navbar";
import { motion } from "framer-motion";

type HeaderProps = {
  title: string;
  descripton: string;
}
const Header: React.FC<HeaderProps> = ({title="", descripton=""}) => {

  return (
    <header className="bg-pageHeader bg-cover bg-no-repeat top-0 ">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2 px-6 sm:px-6 lg:px-32">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>+233 12 345 6789</span>
            </div>
            <span>•</span>
            <span>Free shipping on orders over ₵200</span>
          </div>
          <div className="hidden md:block">
            <span>Mon-Fri: 8:00 AM - 8:00 PM</span>
          </div>
        </div>
      </div>   
      <Navbar/>

      <div className="flex flex-col items-center text-center gap-4 py-12">
        <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl font-bold text-white"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto"
          >
            {descripton}
          </motion.p>
      </div>
    </header>
  );
};

export default Header;