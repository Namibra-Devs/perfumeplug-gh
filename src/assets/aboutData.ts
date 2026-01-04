// src/assets/aboutData.ts
import { Shield, Truck, Star, Users, Award, Heart } from 'lucide-react';

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

export interface Value {
  icon: any;
  title: string;
  description: string;
}

export interface Stat {
  number: string;
  label: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Annah Asante',
    role: 'Founder & CEO',
    image: '/team/female-avatar.jpg',
    description: 'Passionate about bringing luxury fragrances to Ghana at accessible prices.'
  },
  {
    name: 'Abena Mensah',
    role: 'Head of Operations',
    image: '/team/female-avatar.jpg',
    description: 'Ensuring seamless customer experience and efficient delivery across Ghana.'
  },
  {
    name: 'Stephanie Boateng',
    role: 'Fragrance Expert',
    image: '/team/female-avatar.jpg',
    description: 'Certified perfume specialist with 10+ years in the fragrance industry.'
  }
];

export const values: Value[] = [
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

export const stats: Stat[] = [
  { number: '10,000+', label: 'Happy Customers' },
  { number: '50+', label: 'Premium Brands' },
  { number: '98%', label: 'Satisfaction Rate' },
  { number: '24/7', label: 'Customer Support' }
];

export const storyContent = {
  title: 'Our Story',
  paragraphs: [
    `PerfumePlug Ghana was born from a simple yet powerful vision: to make luxury fragrances 
    accessible to everyone in Ghana without compromising on authenticity or quality. Founded in 2020, 
    our journey began when our founder, Kwame Asante, noticed the growing demand for genuine 
    perfumes at reasonable prices.`,
    
    `What started as a small boutique operation has grown into Ghana's most trusted online 
    perfume destination. We've built relationships with top international brands and developed 
    a robust supply chain that ensures every product reaches you in perfect condition.`,
    
    `Today, we serve thousands of customers across Ghana, helping them discover their 
    signature scents and express their unique personalities through the art of fragrance.`
  ],
  image: '/2.jpg',
  establishedYear: '2020'
};

export const missionVision = {
  mission: {
    icon: Heart,
    title: 'Our Mission',
    description: `To provide authentic, high-quality perfumes at affordable prices, making luxury 
    fragrances accessible to every Ghanaian. We're dedicated to ensuring that everyone 
    can experience the confidence and joy that comes from wearing their perfect scent.`
  },
  vision: {
    icon: Award,
    title: 'Our Vision',
    description: `To become Ghana's most trusted fragrance destination, known for exceptional quality, 
    unparalleled customer service, and a curated collection that celebrates both 
    international luxury and African elegance in scent craftsmanship.`
  }
};