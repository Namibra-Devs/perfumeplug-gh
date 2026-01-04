import React from 'react';
import Header from '../components/layout/Header';
import {
  ContactInfoSection,
  ContactFormSection,
  MapSection,
  FAQSection,
  FloatingWhatsAppButton
} from '../components/contact';

const ContactPage: React.FC = () => {
  return (
    <>
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