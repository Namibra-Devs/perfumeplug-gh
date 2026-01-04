// src/components/about/ValuesSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { values, stats } from '../../assets/aboutData';

const ValuesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Why Choose PerfumePlug GH?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Discover what sets us apart in the world of fragrances
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group text-center hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg border border-yellow-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:border-yellow-500/60 transition-all duration-300">
                <value.icon className="h-10 w-10 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                {value.title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-black/40 to-yellow-700/40 backdrop-blur-lg border border-yellow-600/20 rounded-3xl p-8 md:p-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm md:text-base lg:text-lg font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;