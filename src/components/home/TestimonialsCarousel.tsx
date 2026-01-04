// src/components/home/TestimonialsCarousel.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

const TestimonialsCarousel: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Abena Mensah",
      location: "Accra",
      rating: 5,
      comment: "The perfumes are authentic and long-lasting. Delivery was super fast!",
      avatar: "/female.png"
    },
    {
      id: 2,
      name: "Kwame Asante",
      location: "Kumasi",
      rating: 5,
      comment: "Best prices for genuine products. Customer service is excellent!",
      avatar: "/male.png"
    },
    {
      id: 3,
      name: "Esi Boateng",
      location: "Takoradi",
      rating: 5,
      comment: "I've been shopping here for months. Always authentic, always perfect!",
      avatar: "/female.png"
    },
    {
      id: 4,
      name: "Kofi Adjei",
      location: "Cape Coast",
      rating: 5,
      comment: "Amazing collection and fast delivery. Highly recommend PerfumePlug!",
      avatar: "/male.png"
    },
    {
      id: 5,
      name: "Akosua Darko",
      location: "Tema",
      rating: 5,
      comment: "Quality products at great prices. My go-to place for all fragrances!",
      avatar: "/female.png"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Get visible testimonials (current + next 2 for desktop, just current for mobile)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section className="bg-gradient-to-r from-black/90 to-yellow-700/90 py-16">
      <div className="px-4 sm:px-6 lg:px-32">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <Badge delay={0.1}>
              What Our Customers Say
            </Badge>
            <p className="text-lg text-white/70 mt-4">Join thousands of satisfied customers across Ghana</p>
          </div>
          
          {/* Carousel Container */}
          <div 
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/20 backdrop-blur-sm border border-yellow-600/20 rounded-full flex items-center justify-center text-white hover:bg-yellow-600/20 transition-all duration-300 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/20 backdrop-blur-sm border border-yellow-600/20 rounded-full flex items-center justify-center text-white hover:bg-yellow-600/20 transition-all duration-300 hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Testimonials Grid */}
            <div className="mx-12">
              <div className="grid md:grid-cols-3 gap-8">
                {getVisibleTestimonials().map((testimonial, index) => (
                  <motion.div
                    key={`${testimonial.id}-${currentIndex}-${index}`}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`border border-white/40 p-6 rounded-xl shadow-lg backdrop-blur-sm bg-black/10 ${
                      index === 0 ? 'md:scale-105 md:border-yellow-500/60' : ''
                    } ${index === 2 ? 'hidden md:block' : ''}`}
                  >
                    {/* Rating Stars */}
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + i * 0.1 }}
                        >
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-gray-200 mb-6 italic leading-relaxed">
                      "{testimonial.comment}"
                    </p>

                    {/* Customer Info */}
                    <div className="flex items-center">
                      <motion.img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 object-cover rounded-full mr-4 border-2 border-yellow-500/30"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-yellow-400">{testimonial.location}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-yellow-500 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="w-full bg-white/20 rounded-full h-1">
                <motion.div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentIndex + 1) / testimonials.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/60 mt-2">
                <span>{currentIndex + 1} of {testimonials.length}</span>
                <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;