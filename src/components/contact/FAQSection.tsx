// src/components/contact/FAQSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { faqQuestions, contactInfo } from '../../assets/contactData';

const FAQSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mt-20"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold mb-4 shadow-lg"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="text-sm uppercase tracking-wide">FAQ</span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Quick answers to common questions about our products and services
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {faqQuestions.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group bg-black/20 backdrop-blur-lg border border-yellow-600/20 p-6 lg:p-8 rounded-2xl shadow-xl hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <HelpCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                  {faq.question}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Help CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <div className="bg-gradient-to-r from-black/40 to-yellow-700/40 backdrop-blur-lg border border-yellow-600/20 rounded-2xl p-8">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our friendly customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${contactInfo.whatsappNumber}?text=${contactInfo.whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Chat on WhatsApp
            </a>
            <a
              href="mailto:info@perfumeplug-gh.com"
              className="border-2 border-yellow-600/40 hover:border-yellow-500/60 rounded-xl text-yellow-400 hover:text-white px-6 py-3 font-semibold hover:bg-yellow-600/20 transition-all duration-300 hover:scale-105"
            >
              Send Email
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FAQSection;