import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import CustomSelect from '../components/ui/CustomSelect';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqsQuestions = [
    {
      question: "What are your shipping options?",
      answer: "We offer free standard shipping (3-5 days) nationwide and express shipping (1-2 days) for ₵20."
    },
    {
      question: "How can I verify product authenticity?",
      answer: "All our products come with manufacturer seals and verification codes. We guarantee 100% authenticity."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we only ship within Ghana. We're working on expanding to other West African countries."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 14 days for unopened products. Opened items can be exchanged for store credit."
    }
  ]

  const subjectSelect = [
    { value:"product-inquiry", label: "Product Inquiry" },
    { value:"order-support", label: "Order Support" },
    { value: "shipping-info", label: "Shipping Information" },
    { value: "wholesale", label: "Wholesale Inquiry" },
  ]

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      details: '+233 (0) 30 7123 4567',
      subtitle: 'Mon-Fri: 8:00 AM - 8:00 PM',
      link: 'tel:+2333071234567',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'info@perfumepluggh.com',
      subtitle: 'We reply within 24 hours',
      link: 'mailto:info@perfumepluggh.com',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'East Legon, Accra',
      subtitle: 'Greater Accra Region, Ghana',
      link: 'https://maps.google.com/?q=East+Legon,Accra,Ghana',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Monday - Sunday',
      subtitle: '8:00 AM - 8:00 PM',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitted(false);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
    <Header title='Get In Touch' descripton='We are here to help you find your perfect fragrance. Reach out to us through any channel below.'/>
    <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">

      <div className="px-6 sm:px-6 lg:px-32 py-32">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-purple-600 mb-6">Contact Information</h2>
              <p className="text-gray-300 mb-8">
                Have questions about our products or need assistance with your order? 
                We're always happy to help you find your perfect scent.
              </p>

              {/* Contact Methods */}
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={method.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-center space-x-4 p-4 rounded-lg ${method.color} bg-opacity-50`}
                  >
                    <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center`}>
                      <method.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-400">{method.title}</h3>
                      {method.link ? (
                        <a 
                          href={method.link} 
                          className="text-gray-50 hover:text-gray-300 transition-colors block"
                        >
                          {method.details}
                        </a>
                      ) : (
                        <p className="text-gray-300">{method.details}</p>
                      )}
                      <p className="text-sm text-gray-300">{method.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* WhatsApp Quick Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <a
                  href="https://wa.me/2335071234567?text=Hi%20PerfumePlug%20GH!%20I%20need%20help%20with..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors w-full"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat on WhatsApp</span>
                </a>
                <p className="text-sm text-gray-300 text-center mt-2">
                  Typically replies within minutes
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:col-span-2">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <div className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-purple-600">Send us a Message</h2>
                    {isSubmitted && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Message Sent!</span>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-yellow-500 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-yellow-500 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="+233 XX XXX XXXX"
                        />
                      </div>
                    </div>

                    <div className='grid md:grid-cols-2 gap-4'>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-yellow-500 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-yellow-500 mb-2">
                          Subject *
                        </label>
                        <CustomSelect
                          label=""
                          value={formData.subject}
                          onChange={(value) => handleSelectChange("subject", value)}
                          options={subjectSelect}
                          className='w-full px-3 py-2.5'
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-yellow-500 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || isSubmitted}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : isSubmitted ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Message Sent!
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>

              {/* Google Map */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <div className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold text-yellow-400">Our Location</h3>
                    <p className="text-gray-300">Visit our store in East Legon, Accra</p>
                  </div>
                  
                  {/* Google Maps Embed */}
                  <div className="h-80 bg-gray-200 relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.391283720987!2d-0.1740699250181307!3d5.650681933954234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9c7d5c5c5c5c%3A0x6f6f6f6f6f6f6f6f!2sEast%20Legon%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1234567890123"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="PerfumePlug Ghana Location"
                      className="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-10 pointer-events-none"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-yellow-400">PerfumePlug Ghana Store</p>
                        <p className="text-sm">East Legon, Accra, Greater Accra Region, Ghana</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium text-yellow-400">Store Hours</p>
                        <p className="text-sm text-gray-300">Mon-Fri: 8:00 AM - 8:00 PM</p>
                        <p className="text-sm text-gray-300">Sat-Sun: 9:00 AM - 6:00 PM</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-yellow-400">Parking</p>
                        <p className="text-sm text-gray-300">Free parking available</p>
                        <p className="text-sm text-gray-300">Wheelchair accessible</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="md:text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-600">Frequently Asked Questions</h2>
            <p className="text-gray-300 mt-2">Quick answers to common questions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqsQuestions.map((faq, index) => (
              <div key={index} className="bg-black/30 backdrop-blur-xl p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-purple-600 mb-2">{faq.question}</h3>
                <p className="text-gray-200 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating WhatsApp Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <a
          href="https://wa.me/2335071234567?text=Hi%20PerfumePlug%20GH!%20I%20need%20help%20with..."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center group"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute right-full mr-3 bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Chat with us
          </span>
        </a>
      </motion.div>
    </div>
    </>
  );
};

export default ContactPage;