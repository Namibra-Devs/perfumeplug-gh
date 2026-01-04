// src/components/about/MissionVisionSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { missionVision } from '../../assets/aboutData';

const MissionVisionSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-black/80 to-yellow-700/70 py-16 md:py-24">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Mission & Vision
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're committed to transforming the fragrance shopping experience in Ghana
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="group bg-black/20 backdrop-blur-lg border border-yellow-600/20 p-8 lg:p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-yellow-500/40"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <missionVision.mission.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {missionVision.mission.title}
            </h3>
            <p className="text-gray-300 leading-relaxed text-base md:text-lg">
              {missionVision.mission.description}
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="group bg-black/20 backdrop-blur-lg border border-yellow-600/20 p-8 lg:p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-yellow-500/40"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <missionVision.vision.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {missionVision.vision.title}
            </h3>
            <p className="text-gray-300 leading-relaxed text-base md:text-lg">
              {missionVision.vision.description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;