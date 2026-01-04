// src/components/home/NewsletterSection.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, Lock, X, ArrowRight, Star } from 'lucide-react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubscribed(true);
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubscribed(false);
    }, 3000);
  };

  return (
    <section className="bg-gradient-to-r from-black/90 to-yellow-700/95 relative py-24 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-500/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-orange-500/20 rounded-full translate-x-1/3 translate-y-1/3"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          whileInView={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-black/20 backdrop-blur-lg rounded-3xl p-12 border border-yellow-600/20 shadow-2xl relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative z-10 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
              className="w-16 h-16 bg-yellow-700/30 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg"
            >
              <Mail className="h-7 w-7 text-white" />
            </motion.div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-4 h-20 md:h-14">
              Stay in the Loop
            </h2>

            {/* Description */}
            <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join our fragrance community for exclusive offers, new arrivals, and expert tips 
              delivered straight to your inbox.
            </p>

            {/* Signup Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-6 py-4 bg-transparent backdrop-blur-sm border border-yellow-600/20 rounded-2xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-500/20 border border-green-500/40 rounded-2xl p-6 mb-6"
                >
                  <div className="flex items-center justify-center gap-3 text-green-400 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-white rotate-45" />
                    </div>
                    <span className="font-semibold">Successfully Subscribed!</span>
                  </div>
                  <p className="text-white/80 text-sm">
                    Thank you for joining our community. Check your inbox for a welcome message!
                  </p>
                </motion.div>
              )}

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-yellow-400">No spam, ever</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span className="text-yellow-400">Your data is secure</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-green-500" />
                  <span className="text-yellow-400">Unsubscribe anytime</span>
                </div>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 pt-8 border-t border-yellow-700/60"
            >
              <p className="text-sm text-white mb-4">Join 10,000+ fragrance enthusiasts</p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
                <span className="text-sm text-white ml-2 font-medium">4.9/5 from 2,000+ reviews</span>
              </div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/10 rounded-full blur-xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;