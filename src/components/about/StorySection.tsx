// src/components/about/StorySection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { storyContent } from '../../assets/aboutData';
import { ShoppingBag } from 'lucide-react';

const StorySection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="px-4 sm:px-4 lg:px-32 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold mb-4 shadow-lg"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wide">{storyContent.title}</span>
            </motion.div>

            <div className="space-y-6 text-base md:text-[17px] text-gray-300 leading-relaxed">
              {storyContent.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={storyContent.image}
                alt="Perfume Collection"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-xl backdrop-blur-sm"
            >
              <div className="text-3xl md:text-4xl font-bold">{storyContent.establishedYear}</div>
              <div className="text-sm md:text-base opacity-90">Year Established</div>
            </motion.div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-500/20 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-500/20 rounded-full blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;