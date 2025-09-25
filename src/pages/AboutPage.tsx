import Header from '../components/layout/Header';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Star, Users, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Kwame Asante',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Passionate about bringing luxury fragrances to Ghana at accessible prices.'
    },
    {
      name: 'Abena Mensah',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Ensuring seamless customer experience and efficient delivery across Ghana.'
    },
    {
      name: 'Kofi Boateng',
      role: 'Fragrance Expert',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Certified perfume specialist with 10+ years in the fragrance industry.'
    }
  ];

  // Values data
  const values = [
    {
      icon: Shield,
      title: 'Authenticity Guaranteed',
      description: 'Every product comes with verification and manufacturer seals'
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      description: 'Fast and reliable shipping across all regions of Ghana'
    },
    {
      icon: Star,
      title: 'Expert Curation',
      description: 'Handpicked selection of the finest international fragrances'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Dedicated support team ready to assist you 24/7'
    }
  ];

  // Stats data
  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50+', label: 'Premium Brands' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
     <>
      <Header title='About PerfumePlug Ghana' descripton='Your trusted partner for authentic luxury fragrances at affordable prices. Discover the story behind Ghanas leading perfume destination..'/>
      <div className="min-h-screen bg-white">
        {/* Our Story Section */}
        <section className="py-32">
          <div className="px-6 sm:px-6 lg:px-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-lg text-gray-600">
                  <p>
                    PerfumePlug Ghana was born from a simple yet powerful vision: to make luxury fragrances 
                    accessible to everyone in Ghana without compromising on authenticity or quality. Founded in 2020, 
                    our journey began when our founder, Kwame Asante, noticed the growing demand for genuine 
                    perfumes at reasonable prices.
                  </p>
                  <p>
                    What started as a small boutique operation has grown into Ghana's most trusted online 
                    perfume destination. We've built relationships with top international brands and developed 
                    a robust supply chain that ensures every product reaches you in perfect condition.
                  </p>
                  <p>
                    Today, we serve thousands of customers across Ghana, helping them discover their 
                    signature scents and express their unique personalities through the art of fragrance.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-[500px] w-auto"
              >
                <img
                  src="/2.jpg"
                  alt="Perfume Collection"
                  className="rounded-2xl shadow-2xl h-full w-full object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                  <div className="text-3xl font-bold">2020</div>
                  <div className="text-sm">Year Established</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-gray-50 py-32">
          <div className="px-6 sm:px-6 lg:px-32">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                We're committed to transforming the fragrance shopping experience in Ghana
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To provide authentic, high-quality perfumes at affordable prices, making luxury 
                  fragrances accessible to every Ghanaian. We're dedicated to ensuring that everyone 
                  can experience the confidence and joy that comes from wearing their perfect scent.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To become Ghana's most trusted fragrance destination, known for exceptional quality, 
                  unparalleled customer service, and a curated collection that celebrates both 
                  international luxury and African elegance in scent craftsmanship.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-32">
          <div className="px-6 sm:px-6 lg:px-32">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose PerfumePlug GH?</h2>
              <p className="text-lg md:text-xl text-gray-600">Discover what sets us apart in the world of fragrances</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-gray-50 py-32">
          <div className="px-6 sm:px-6 lg:px-32">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600">The passionate people behind PerfumePlug Ghana</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="px-6 sm:px-6 lg:px-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Signature Scent?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of satisfied customers who trust us for their fragrance needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Shop Collection
                </Link>
                <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;