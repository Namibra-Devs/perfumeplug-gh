// src/components/about/TeamSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { teamMembers } from '../../assets/aboutData';

const TeamSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-black/90 to-yellow-700/90 py-16 md:py-24">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            The passionate people behind PerfumePlug Ghana
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group text-center bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-2xl p-8 hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-gradient-to-r from-yellow-400/50 to-yellow-600/50 group-hover:border-yellow-400/80 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/female.png';
                    }}
                  />
                </div>
                
                {/* Decorative Ring */}
                <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full border-2 border-yellow-400/30 animate-pulse" />
              </div>
              
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                {member.name}
              </h3>
              
              <p className="text-yellow-500 font-medium mb-4 text-sm md:text-base">
                {member.role}
              </p>
              
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {member.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;