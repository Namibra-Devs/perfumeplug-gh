// src/components/contact/ContactInfoSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { contactMethods, contactInfo } from '../../assets/contactData';

const ContactInfoSection: React.FC = () => {
  return (
    <div className="lg:col-span-1">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Contact Information
        </h2>
        <p className="text-gray-300 mb-8 text-base md:text-lg leading-relaxed">
          Have questions about our products or need assistance with your order? 
          We're always happy to help you find your perfect scent.
        </p>

        {/* Contact Methods */}
        <div className="space-y-6">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-xl p-5 hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="h-7 w-7 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-yellow-300 transition-colors duration-300">
                    {method.title}
                  </h3>
                  {method.link ? (
                    <a 
                      href={method.link} 
                      className="text-gray-300 hover:text-yellow-400 transition-colors block font-medium"
                      target={method.link.startsWith('http') ? '_blank' : undefined}
                      rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {method.details}
                    </a>
                  ) : (
                    <p className="text-gray-300 font-medium">{method.details}</p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">{method.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp Quick Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <a
            href={`https://wa.me/${contactInfo.whatsappNumber}?text=${contactInfo.whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 w-full hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Chat on WhatsApp</span>
          </a>
          <p className="text-sm text-gray-400 text-center mt-3">
            Typically replies within minutes
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactInfoSection;