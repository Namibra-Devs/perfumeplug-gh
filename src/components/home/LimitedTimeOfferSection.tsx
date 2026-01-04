// src/components/home/LimitedTimeOfferSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

const LimitedTimeOfferSection: React.FC = () => {
  const countDown = [
    { value: '02', label: 'Days' },
    { value: '12', label: 'Hours' },
    { value: '45', label: 'Minutes' },
    { value: '30', label: 'Seconds' }
  ];

  return (
    <section className="bg-gradient-to-r from-black/90 to-yellow-700/95 px-4 sm:px-6 lg:px-32 py-16">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-yellow-700 to-slate-900 text-white"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full translate-x-1/3 translate-y-1/3 blur-xl"></div>

        <div className="grid lg:grid-cols-2 gap-0 relative z-10">
          {/* Left Content Column */}
          <div className="p-6 lg:p-16 flex flex-col justify-center">
            {/* Modern Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-3 max-w-fit bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-4 py-2 rounded-xl font-semibold mb-8 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-xs uppercase tracking-wide">Limited Time Offer</span>
              </div>
              <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse"></div>
            </motion.div>

            {/* Main Heading */}
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Summer{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                Sale
              </span>
              <br />
              Up to 50% Off
            </h3>

            {/* Description */}
            <p className="md:text-lg text-slate-300 mb-8 leading-relaxed md:max-w-lg">
              Don't miss out on our biggest sale of the season. Limited stock available at incredible prices!
            </p>

            {/* Enhanced Countdown Timer */}
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {countDown.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 min-w-20 group-hover:bg-white/15 transition-all duration-300">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{item.value}</div>
                    <div className="text-sm text-slate-300 font-medium">{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                to="/shop?filter=discount"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-semibold px-10 py-3 rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span>Shop The Sale</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>

          {/* Right Visual Column */}
          <div className="relative flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20">
            {/* Main Product Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative z-20"
            >
              <img
                src="/limited-time.png"
                alt="Limited Time Offer"
                className="w-full max-w-md rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            {/* Floating Discount Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
              className="absolute top-8 right-8 z-30"
            >
              <div className="relative">
                <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex flex-col items-center justify-center shadow-2xl rotate-12 transform hover:rotate-0 transition-transform duration-500">
                  <div className="text-slate-900 font-bold text-center leading-tight">
                    <div className="text-xl md:text-2xl">50%</div>
                    <div className="text-xs uppercase">OFF</div>
                  </div>
                </div>
                {/* Sparkle Effect */}
                <div className="absolute top-0 md:-top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
                </div>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute bottom-8 left-8 w-16 h-16 bg-amber-400/20 rounded-2xl blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full blur-lg"></div>
          </div>
        </div>

        {/* Bottom Gradient Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"></div>
      </motion.div>
    </section>
  );
};

export default LimitedTimeOfferSection;