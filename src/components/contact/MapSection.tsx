// src/components/contact/MapSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { contactInfo } from '../../assets/contactData';

const MapSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="lg:col-span-2 mt-8"
    >
      <div className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-yellow-600/20">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
            Our Location
          </h3>
          <p className="text-gray-300">
            Visit our store in East Legon, Accra for personalized fragrance consultation
          </p>
        </div>
        
        {/* Google Maps Embed */}
        <div className="relative h-80 md:h-96 bg-gray-200">
          <iframe
            src={contactInfo.storeLocation.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="PerfumePlug Ghana Location"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
        
        <div className="p-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-white text-lg mb-1">
                {contactInfo.storeLocation.name}
              </p>
              <p className="text-gray-300">
                {contactInfo.storeLocation.address}
              </p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm font-semibold text-yellow-400 mb-2">Store Hours</p>
              <div className="space-y-1">
                <p className="text-sm text-gray-300">{contactInfo.storeLocation.hours.weekdays}</p>
                <p className="text-sm text-gray-300">{contactInfo.storeLocation.hours.weekends}</p>
              </div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm font-semibold text-yellow-400 mb-2">Amenities</p>
              <div className="space-y-1">
                <p className="text-sm text-gray-300">{contactInfo.storeLocation.amenities.parking}</p>
                <p className="text-sm text-gray-300">{contactInfo.storeLocation.amenities.accessibility}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MapSection;