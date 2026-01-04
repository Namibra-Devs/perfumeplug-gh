// src/components/contact/ContactFormSection.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import { subjectOptions } from '../../assets/contactData';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactFormSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="lg:col-span-2"
    >
      <div className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Send us a Message
            </h2>
            <p className="text-gray-300">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-lg"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Message Sent!</span>
            </motion.div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-yellow-400 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm text-white text-sm placeholder:text-gray-400 border border-yellow-600/30 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-yellow-400 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm text-white text-sm placeholder:text-gray-400 border border-yellow-600/30 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                placeholder="+233 XX XXX XXXX"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-yellow-400 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm text-white text-sm placeholder:text-gray-400 border border-yellow-600/30 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-yellow-400 mb-2">
                Subject *
              </label>
              <CustomSelect
                label=""
                value={formData.subject}
                onChange={(value) => handleSelectChange("subject", value)}
                options={subjectOptions}
                className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm border border-yellow-600/30 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-yellow-400 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm text-white text-sm placeholder:text-gray-400 border border-yellow-600/30 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none transition-all duration-300"
              placeholder="Tell us how we can help you..."
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting || isSubmitted}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Sending Message...
              </>
            ) : isSubmitted ? (
              <>
                <CheckCircle className="h-5 w-5 mr-3" />
                Message Sent Successfully!
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-3" />
                Send Message
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactFormSection;