import React from 'react';
import Header from '../components/layout/Header';
import {
  StorySection,
  MissionVisionSection,
  ValuesSection,
  TeamSection,
  CTASection
} from '../components/about';

const AboutPage: React.FC = () => {
  return (
    <>
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