import React from 'react';
import Header from '../components/layout/Header';
import { SEOHead } from '../components/seo';
import { generateSEO } from '../utils/seo';
import { seoConfig } from '../config/seo';
import {
  StorySection,
  MissionVisionSection,
  ValuesSection,
  TeamSection,
  CTASection
} from '../components/about';

const AboutPage: React.FC = () => {
  const seo = generateSEO({
    title: 'About PerfumePlug Ghana - Our Story & Mission',
    description: 'Learn about PerfumePlug Ghana\'s journey to bring authentic designer perfumes and luxury fragrances to Ghana. Discover our mission, values, and commitment to quality.',
    keywords: ['about perfumeplug', 'perfume company Ghana', 'fragrance store story', 'authentic perfumes Ghana', 'luxury fragrance mission']
  });

  return (
    <>
      <SEOHead seo={seo} canonical={`${seoConfig.baseUrl}/about`} />
      <Header 
        title="About PerfumePlug Ghana" 
        descripton="Your trusted partner for authentic luxury fragrances at affordable prices. Discover the story behind Ghana's leading perfume destination."
      />
      
      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
        <StorySection />
        <MissionVisionSection />
        <ValuesSection />
        <TeamSection />
        <CTASection />
      </div>
    </>
  );
};

export default AboutPage;