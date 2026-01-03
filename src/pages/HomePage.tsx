import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, ArrowRight, Mail, Shield, Lock, X} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Badge } from '../components/ui/Badge';
import ProductGrid from '../components/product/ProductGrid';

const HomePage: React.FC = () => {
  // Static collections based on actual product properties
  // const shopCollections = [
  //   { 
  //     slug: "men", 
  //     name: "Men's Collection", 
  //     image: '/categories/men.jpg', 
  //     colorClass: "bg-blue-500",
  //     gradientClass: "from-blue-500/20",
  //     barClass: "from-blue-500 via-blue-400 to-blue-500",
  //     description: "Masculine fragrances for the modern man"
  //   },
  //   { 
  //     slug: "women", 
  //     name: "Women's Collection", 
  //     image: '/categories/women.jpg', 
  //     colorClass: "bg-pink-500",
  //     gradientClass: "from-pink-500/20",
  //     barClass: "from-pink-500 via-pink-400 to-pink-500",
  //     description: "Elegant scents for sophisticated women"
  //   },
  //   { 
  //     slug: "unisex", 
  //     name: "Unisex Collection", 
  //     image: '/categories/unisex.jpg', 
  //     colorClass: "bg-purple-500",
  //     gradientClass: "from-purple-500/20",
  //     barClass: "from-purple-500 via-purple-400 to-purple-500",
  //     description: "Versatile fragrances for everyone"
  //   },
  //   { 
  //     slug: "luxury", 
  //     name: "Luxury Collection", 
  //     image: '/categories/luxury.jpg', 
  //     colorClass: "bg-yellow-500",
  //     gradientClass: "from-yellow-500/20",
  //     barClass: "from-yellow-500 via-amber-400 to-yellow-500",
  //     description: "Premium and exclusive fragrances"
  //   },
  //   { 
  //     slug: "body-sprays", 
  //     name: "Body Sprays", 
  //     image: '/categories/unisex.jpg', // Using available image
  //     colorClass: "bg-green-500",
  //     gradientClass: "from-green-500/20",
  //     barClass: "from-green-500 via-green-400 to-green-500",
  //     description: "Fresh and light daily fragrances"
  //   },
  //   { 
  //     slug: "gift-sets", 
  //     name: "Gift Sets", 
  //     image: '/categories/gift-set.jpg', // Using available image
  //     colorClass: "bg-red-500",
  //     gradientClass: "from-red-500/20",
  //     barClass: "from-red-500 via-red-400 to-red-500",
  //     description: "Perfect gift combinations for loved ones"
  //   }
  // ];

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

  const countDown = [
    { value: '02', label: 'Days' },
    { value: '12', label: 'Hours' },
    { value: '45', label: 'Minutes' },
    { value: '30', label: 'Seconds' }
  ];

  return (
    <div className="">
      <Navbar/>

      {/* 2. Shop by Collection */}
      {/* <section className="bg-gradient-to-r from-black to-yellow-700 mx-auto pt-10 pb-20 px-4 sm:px-6 lg:px-32 relative overflow-hidden">
        <div className="glow"></div>
        <div className="mist"></div>
        <div className="mist2"></div>
        <div className="mist3"></div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:items-center mb-8">
            <div>
              <Badge delay={0.1}>
                Shop by Collection
              </Badge>
              <p className="text-white/70 mt-2">Discover our curated collections tailored for every preference</p>
            </div>
            <Link to="/shop" className="text-white hover:text-yellow-300 font-medium flex items-center transition-colors">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopCollections.map((collection, index) => (
              <motion.div
                key={collection.slug}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group overflow-hidden border border-yellow-800/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Link to={`/shop?category=${collection.slug}`}>
                  <div className="relative">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-64 object-cover inset-0 bg-black/40 rounded-2xl transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Try fallback images in order
                        if (target.src.includes('/categories/')) {
                          target.src = '/placeholder-product.svg';
                        }
                      }}
                      onLoad={() => {
                        // Image loaded successfully - could add analytics here if needed
                      }}
                    />
                    
                   
                    <div className={`absolute inset-0 bg-gradient-to-b ${collection.gradientClass} to-black/60 rounded-2xl`}></div>
                    
                  
                    <div className="absolute font-semibold top-4 left-4 w-12 h-12 bg-white/20 text-white backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 transition-all duration-300 group-hover:bg-white/30">
                      <span className="text-lg">{collection.name[0]}</span>
                    </div>
                    
                 
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 transition-transform duration-300 group-hover:scale-105">
                        {collection.name}
                      </h3>
                      <p className="text-white/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {collection.description}
                      </p>
                    </div>
                   
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                      className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0"
                    >
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-colors">
                        <span className='text-sm font-medium'>Explore Collection</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"/>
                      </div>
                    </motion.div>
                  </div>
                </Link>

             
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110 border border-white/30">
                  <div className={`w-3 h-3 ${collection.colorClass} rounded-full transition-all duration-300 group-hover:scale-125`}></div>
                </div>


                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${collection.barClass} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section> */}

      {/* 3. Featured Products Carousel */}
      <section className="bg-gradient-to-r from-black/95 to-yellow-700/95 py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-32">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:items-center mb-8">
              <div>
                <Badge delay={0.1}>
                  Featured Products
                </Badge>
                <p className="text-white/70 mt-2">Curated selection of our most popular fragrances</p>
              </div>
              <Link to="/shop" className="text-white hover:text-white/50 font-medium flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <ProductGrid/>

            {/* {pagination && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => fetchProducts(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchProducts(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )} */}
          </motion.div>
        </div>
      </section>

      {/* 4. Modern Limited-time Offers Section */}
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
              <p className=" md:text-lg text-slate-300 mb-8 leading-relaxed md:max-w-lg">
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
                  <ArrowRight  className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
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

      {/* 5. Customer Testimonials/Reviews */}
      <section className="bg-gradient-to-r from-black/90 to-yellow-700/90 py-16">
        <div className="px-4 sm:px-6 lg:px-32">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className=" md:text-center mb-12">
              <Badge delay={0.1}>
                  What Our Customers Say
              </Badge>
              <p className="text-lg text-white/70 mt-4">Join thousands of satisfied customers across Ghana</p>
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
                  className="border border-white/40 p-6 rounded-xl shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-200 mb-6 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 object-cover rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-200">{testimonial.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Modern Newsletter Signup */}
      <section className="bg-gradient-to-r from-black/90 to-yellow-700/95 relative py-24 overflow-hidden">
        {/* Background with Gradient */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black to-yellow-700"></div> */}
        
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
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-4 h-14">
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
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-6 py-4 bg-transparent backdrop-blur-sm border border-yellow-600/20 rounded-2xl text-white/60 text-sm placeholder-slate-400 focus:outline-none focus:border-yellow-800 focus:ring-0 focus:ring-yellow-500/20 transition-all duration-300"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 min-w-[160px]"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className='text-yellow-400'>No spam, ever</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span className='text-yellow-400'>Your data is secure</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-green-500" />
                    <span className='text-yellow-400'>Unsubscribe anytime</span>
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
    </div>
  );
};

export default HomePage;