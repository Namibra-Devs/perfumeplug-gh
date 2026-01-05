import React from 'react';
import Header from '../components/layout/Header';
import { SEOHead } from '../components/seo';
import { generateSEO } from '../utils/seo';
import { seoConfig } from '../config/seo';
import {
  ContactInfoSection,
  ContactFormSection,
  MapSection,
  FAQSection,
  FloatingWhatsAppButton
} from '../components/contact';

const ContactPage: React.FC = () => {
  const seo = generateSEO({
    title: 'Contact PerfumePlug Ghana - Get In Touch',
    description: 'Contact PerfumePlug Ghana for inquiries about perfumes, orders, or customer support. Call +233 50-666-2618 or visit our store. We\'re here to help with all your fragrance needs.',
    keywords: ['contact perfumeplug', 'perfume store contact Ghana', 'fragrance customer service', 'perfume shop phone number', 'perfume store location Ghana']
  });

  return (
    <>
      <SEOHead seo={seo} canonical={`${seoConfig.baseUrl}/contact`} />
      <Header 
        title='Get In Touch' 
        descripton='We are here to help you find your perfect fragrance. Reach out to us through any channel below.'
      />
      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
        <div className="px-6 sm:px-6 lg:px-32 py-32">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <ContactInfoSection />

            {/* Contact Form & Map */}
            <div className="lg:col-span-2">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <ContactFormSection />

                {/* Google Map */}
                <MapSection />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <FAQSection />
        </div>

        {/* Floating WhatsApp Button */}
        <FloatingWhatsAppButton />
      </div>
    </>
  );
};

export default ContactPage;