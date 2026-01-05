#!/usr/bin/env node

/**
 * SEO Implementation Test Script
 * 
 * This script validates the SEO implementation by checking:
 * - Environment variables setup
 * - Configuration files
 * - Component imports
 * - Structured data validity
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 SEO Implementation Test\n');

// Test 1: Check environment variables example
console.log('1. Checking environment variables...');
try {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredVars = [
    'VITE_GA_TRACKING_ID',
    'VITE_SITE_URL',
    'VITE_FACEBOOK_APP_ID',
    'VITE_TWITTER_HANDLE'
  ];
  
  const missingVars = requiredVars.filter(varName => !envExample.includes(varName));
  
  if (missingVars.length === 0) {
    console.log('   ✅ All required environment variables are documented');
  } else {
    console.log('   ❌ Missing environment variables:', missingVars.join(', '));
  }
} catch (error) {
  console.log('   ❌ .env.example file not found');
}

// Test 2: Check SEO configuration
console.log('\n2. Checking SEO configuration...');
try {
  const seoConfig = fs.readFileSync('src/config/seo.ts', 'utf8');
  
  const checks = [
    { name: 'baseUrl configuration', pattern: /baseUrl.*VITE_SITE_URL/ },
    { name: 'Google Analytics ID', pattern: /googleAnalyticsId.*VITE_GA_TRACKING_ID/ },
    { name: 'Social media handles', pattern: /twitter.*VITE_TWITTER_HANDLE/ },
    { name: 'Business information', pattern: /business.*{/ },
    { name: 'Default keywords', pattern: /defaultKeywords.*\[/ }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(seoConfig)) {
      console.log(`   ✅ ${check.name} configured`);
    } else {
      console.log(`   ❌ ${check.name} missing or misconfigured`);
    }
  });
} catch (error) {
  console.log('   ❌ SEO configuration file not found');
}

// Test 3: Check component files
console.log('\n3. Checking SEO components...');
const seoComponents = [
  'src/components/seo/SEOHead.tsx',
  'src/components/seo/StructuredData.tsx',
  'src/components/analytics/GoogleAnalytics.tsx',
  'src/utils/seo.ts'
];

seoComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`   ✅ ${path.basename(component)} exists`);
  } else {
    console.log(`   ❌ ${path.basename(component)} missing`);
  }
});

// Test 4: Check public files
console.log('\n4. Checking public SEO files...');
const publicFiles = [
  'public/sitemap.xml',
  'public/robots.txt'
];

publicFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${path.basename(file)} exists`);
  } else {
    console.log(`   ❌ ${path.basename(file)} missing`);
  }
});

// Test 5: Check page implementations
console.log('\n5. Checking page SEO implementations...');
const pages = [
  { file: 'src/pages/HomePage.tsx', name: 'HomePage' },
  { file: 'src/pages/ProductPage.tsx', name: 'ProductPage' },
  { file: 'src/pages/ShopPage.tsx', name: 'ShopPage' },
  { file: 'src/pages/AboutPage.tsx', name: 'AboutPage' },
  { file: 'src/pages/ContactPage.tsx', name: 'ContactPage' }
];

pages.forEach(page => {
  try {
    const content = fs.readFileSync(page.file, 'utf8');
    if (content.includes('SEOHead') && content.includes('seo')) {
      console.log(`   ✅ ${page.name} has SEO implementation`);
    } else {
      console.log(`   ❌ ${page.name} missing SEO implementation`);
    }
  } catch (error) {
    console.log(`   ❌ ${page.name} file not found`);
  }
});

// Test 6: Check Layout integration
console.log('\n6. Checking Layout integration...');
try {
  const layout = fs.readFileSync('src/components/layout/Layout.tsx', 'utf8');
  
  if (layout.includes('GoogleAnalytics')) {
    console.log('   ✅ Google Analytics integrated in Layout');
  } else {
    console.log('   ❌ Google Analytics not integrated in Layout');
  }
  
  if (layout.includes('StructuredData')) {
    console.log('   ✅ Structured Data integrated in Layout');
  } else {
    console.log('   ❌ Structured Data not integrated in Layout');
  }
} catch (error) {
  console.log('   ❌ Layout file not found');
}

console.log('\n🎉 SEO test completed!');
console.log('\n📋 Next steps:');
console.log('   1. Set up environment variables in .env file');
console.log('   2. Update domain URLs in seoConfig');
console.log('   3. Create Google Analytics account and get tracking ID');
console.log('   4. Test with Google Rich Results Test after deployment');
console.log('   5. Submit sitemap to Google Search Console');