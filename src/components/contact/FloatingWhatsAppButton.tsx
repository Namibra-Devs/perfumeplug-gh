// src/components/contact/FloatingWhatsAppButton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { contactInfo } from '../../assets/contactData';

const FloatingWhatsAppButton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-24 right-6 z-50"
    >
      <a
        href={`https://wa.me/${contactInfo.whatsappNumber}?text=${contactInfo.whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
        <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
          Chat with us
        </span>
      </a>
    </motion.div>
  );
};

export default FloatingWhatsAppButton;