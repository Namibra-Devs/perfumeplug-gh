// src/assets/contactData.ts
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export interface ContactMethod {
  icon: any;
  title: string;
  details: string;
  subtitle: string;
  link?: string;
  color: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SubjectOption {
  value: string;
  label: string;
}

export const contactMethods: ContactMethod[] = [
  {
    icon: Phone,
    title: 'Call Us',
    details: '+233 (0) 50-666-2618',
    subtitle: 'Mon-Fri: 8:00 AM - 8:00 PM',
    link: 'tel:+233506662618',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: 'info@perfumeplug-gh.com',
    subtitle: 'We reply within 24 hours',
    link: 'mailto:info@perfumeplug-gh.com',
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

export const subjectOptions: SubjectOption[] = [
  { value: "product-inquiry", label: "Product Inquiry" },
  { value: "order-support", label: "Order Support" },
  { value: "shipping-info", label: "Shipping Information" },
  { value: "wholesale", label: "Wholesale Inquiry" },
];

export const faqQuestions: FAQ[] = [
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
];

export const contactInfo = {
  whatsappNumber: "233506662618",
  whatsappMessage: "Hi%20PerfumePlug%20GH!%20I%20need%20help%20with...",
  storeLocation: {
    name: "PerfumePlug Ghana Store",
    address: "East Legon, Accra, Greater Accra Region, Ghana",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.391283720987!2d-0.1740699250181307!3d5.650681933954234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9c7d5c5c5c5c%3A0x6f6f6f6f6f6f6f6f!2sEast%20Legon%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1234567890123",
    hours: {
      weekdays: "Mon-Fri: 8:00 AM - 8:00 PM",
      weekends: "Sat-Sun: 9:00 AM - 6:00 PM"
    },
    amenities: {
      parking: "Free parking available",
      accessibility: "Wheelchair accessible"
    }
  }
};