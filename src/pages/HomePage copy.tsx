import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { products } from '../constants/mockData';
import { Navbar } from '../components/layout/Navbar';

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProducts = products.filter(product => product.featured).slice(0, 8);

  // Hero Slider Data
  const heroSlides = [
    {
      id: 1,
      title: "Latest Arrivals",
      subtitle: "Discover our newest fragrance collection",
      description: "Fresh from the world's top perfume houses",
      image: "/hero-slides/slider1.jpg",
      buttonText: "Shop New Arrivals",
      link: "/shop?filter=new",
      bgColor: "black"
    },
    {
      id: 2,
      title: "Summer Discounts",
      subtitle: "Up to 50% Off Selected Items",
      description: "Refresh your collection with our seasonal sale",
      image: "/hero-slides/slider2.jpg",
      buttonText: "View Discounts",
      link: "/shop?filter=discount",
      bgColor: "black"
    },
    {
      id: 3,
      title: "Best Sellers",
      subtitle: "Customer Favorites",
      description: "The most loved fragrances of the season",
      image: "/hero-slides/slider3.jpg",
      buttonText: "Shop Best Sellers",
      link: "/shop?filter=bestsellers",
      bgColor: "black"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Testimonials
  const testimonials = [
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
    }
  ];

  return (
    <div className="space-y-16">
      {/* 1. Hero Banner Slider */}
      <section className="bg-pageHeader bg-cover bg-no-repeat relative h-screen max-h-[800px] overflow-hidden">
        <Navbar/>
        <AnimatePresence mode="wait">
            {heroSlides.map((slide, index) => (
            index === currentSlide && (
                <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
                >
                
                <div className="absolute inset-0">
                    <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    />
                    {/* Lighter overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-black to-transparent`}></div>
                </div>
                
         
                <div className="relative h-full mx-auto px-6 sm:px-6 lg:px-32 flex items-center">
                    <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:text-left z-10"
                    >
                        <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
                        {slide.title}
                        </h1>
                        <p className="text-2xl mb-4 text-white/90">{slide.subtitle}</p>
                        <p className="text-lg mb-8 text-white/80">{slide.description}</p>
                        <Link
                        to={slide.link}
                        className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center text-sm shadow-lg hover:shadow-xl"
                        >
                        {slide.buttonText} <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </motion.div>
                    
                    {/* Right side content space */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="hidden lg:block"
                    >
                        {/* Optional: Add a product image or additional content here */}
                        <h1 className='text-yellow-500 text-6xl font-semibold '>Welcome to Perfume Plug </h1>
                        <h1 className='text-white text-4xl font-light'>Your signature bottled</h1>
                    </motion.div>
                    </div>
                </div>
                </motion.div>
            )
            ))}
        </AnimatePresence>


        <button
            title='Previous'
            onClick={prevSlide}
            className="hidden lg:block absolute left-4 top-1/3 md:top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full hover:bg-white/30 transition-colors z-20"
        >
            <ChevronLeft className="h-6 w-6 text-white" />
        </button>

        <button
            title='Next'
            onClick={nextSlide}
            className="hidden lg:block absolute right-4 top-1/3 md:top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full hover:bg-white/30 transition-colors z-20"
        >
            <ChevronRight className="h-6 w-6 text-white" />
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroSlides.map((_, index) => (
            <button
                title='Paginations'
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-1.5 rounded-md transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-7' : 'bg-white/50'
                }`}
            />
            ))}
        </div>
      </section>

      {/* 2. Quick Links to Categories */}
      <section className="mx-auto py-10 px-6 sm:px-6 lg:px-32">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:items-center mb-8">
            <h2 className="text-3xl font-bold text-center ">Shop by Category</h2>
            <p className="text-gray-600 mt-2">Shop right-away based on our most popular categories</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ name: "Men's Perfumes", image: '/categories/men.jpg', link: "/shop?category=men", color: "blue-600" },
              { name: "Women's Perfumes", image: '/categories/women.jpg', link: "/shop?category=women", color: "yellow-500" },
              { name: "Unisex Collection", image: '/categories/unisex.jpg', link: "/shop?category=unisex", color: "red-400" 
              }].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="relative group overflow-hidden rounded-2xl shadow-lg"
              >
                <Link to={category.link}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover border-2 border-white rounded-2xl group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-b from-${category.color} opacity-70`}></div>
                  <div className="absolute font-semibold top-4 left-4 w-14 h-14 bg-white/20 text-white backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    {category.name[0]}
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white text-center">{category.name}</h3>
                  </div>
                </Link>
                {/* Hover Indicator */}
                <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full  bg-white flex items-center justify-center transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 opacity-0 translate-x-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. Featured Products Carousel */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto px-6 sm:px-6 lg:px-32">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">Featured Products</h2>
                <p className="text-gray-600 mt-2">Curated selection of our most popular fragrances</p>
              </div>
              <Link to="/shop" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Limited-time Offers Section */}
      <section className="px-6 sm:px-6 lg:px-32">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className=" overflow-hidden bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl text-white"
        >
          <div className="grid lg:grid-cols-2 gap-8 ">
            <div className='p-8'>
              <div className="flex items-center gap-2 mb-4 p-2 border-2 border-white bg-yellow-400 text-red-600 rounded-lg max-w-fit">
                <Clock className="h-5 w-5" />
                <span className="text-lg font-medium">Limited Time Offer</span>
              </div>
              <h3 className="text-5xl font-semibold mb-4">Summer Sale-Up to 50% Off</h3>
              <p className="text-lg md:text-xl mb-6">Don't miss out on our biggest sale of the season. Offer ends soon!</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">02</div>
                  <div className="text-sm">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-sm">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">45</div>
                  <div className="text-sm">Minutes</div>
                </div>
              </div>       
            </div>
            
            <div className="relative flex flex-col items-center justify-center gap-4 w-full h-full p-8">
              <img
                src="/limited-time.png"
                alt="Limited Time Offer"
                className="rounded-r-xl rounded-l-0 shadow-2xl absolute inset-0 w-full h-full"
              />
              <div className='z-10 flex flex-col gap-4'>
                <div className="mx-auto  bg-yellow-400 text-red-600 p-3 text-center h-24 w-24 flex flex-col items-center justify-center rounded-full font-bold text-lg">
                  <h1 className='leading-tight'>50% OFF</h1>
                </div>
                <Link
                  to="/shop?filter=discount"
                  className="mx-auto bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. Customer Testimonials/Reviews */}
      <section className="bg-white py-16">
        <div className="px-6 sm:px-6 lg:px-32">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className=" md:text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="text-lg text-gray-600">Join thousands of satisfied customers across Ghana</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 p-6 rounded-xl shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 object-cover rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Newsletter Signup */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Subscribe to our newsletter for the latest arrivals, exclusive offers, and fragrance tips
            </p>
            <div className="w-full md:max-w-md mx-auto flex flex-wrap gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button className="w-full md:w-auto bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors md:whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">
              No spam, unsubscribe at any time
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;