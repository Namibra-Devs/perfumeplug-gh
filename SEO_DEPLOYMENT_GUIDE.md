# SEO Deployment Guide for PerfumePlug Ghana

This guide covers all SEO implementations and deployment requirements for optimal search engine visibility and performance.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

Create a `.env` file in your project root with the following variables:

```env
# API Configuration
VITE_API_URL=https://pos-api-wwyf.onrender.com
VITE_TENANT_DOMAIN=perfume-plug.com

# SEO & Analytics Configuration
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SITE_URL=https://your-domain.com
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_TWITTER_HANDLE=@perfumepluggh
```

### 2. Domain Configuration

Update the following files with your actual domain:

**`src/config/seo.ts`**
- Update `baseUrl` in production
- Verify social media handles
- Update business contact information

**`public/sitemap.xml`**
- Replace `https://perfume-plug.com` with your actual domain

**`public/robots.txt`**
- Update sitemap URL with your domain

### 3. Google Analytics Setup

1. Create a Google Analytics 4 property
2. Get your tracking ID (format: G-XXXXXXXXXX)
3. Add it to your `.env` file as `VITE_GA_TRACKING_ID`
4. The GoogleAnalytics component will automatically load in production

### 4. Google Search Console Setup

1. Verify your domain in Google Search Console
2. Submit your sitemap: `https://yourdomain.com/sitemap.xml`
3. Monitor indexing status and search performance

## 🔍 SEO Features Implemented

### Meta Tags & Open Graph
- ✅ Dynamic page titles and descriptions
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card support
- ✅ Canonical URLs
- ✅ Keywords optimization
- ✅ Geographic targeting (Ghana)

### Structured Data (JSON-LD)
- ✅ Organization schema
- ✅ Website schema with search functionality
- ✅ Local business schema
- ✅ Product schema for individual products
- ✅ Breadcrumb navigation schema
- ✅ E-commerce store schema

### Performance Optimizations
- ✅ Lazy loading for product images
- ✅ Optimized image formats
- ✅ Efficient bundle splitting
- ✅ Search result caching

### Technical SEO
- ✅ Responsive design
- ✅ Fast loading times
- ✅ Mobile-friendly navigation
- ✅ Proper heading hierarchy
- ✅ Alt text for images
- ✅ Clean URL structure

## 📄 Page-Specific SEO

### Homepage
- Hero section with primary keywords
- Featured products showcase
- Categories navigation
- Newsletter signup
- Trust indicators

### Product Pages
- Dynamic product titles and descriptions
- Product images with alt text
- Price and availability information
- Related products suggestions
- Breadcrumb navigation

### Category Pages (Shop)
- Category-specific titles and descriptions
- Product filtering and sorting
- Pagination handling
- Category-based keywords

### Static Pages
- About page with company information
- Contact page with business details
- Proper internal linking structure

## 🚀 Deployment Steps

### 1. Build Optimization

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Preview build locally
pnpm preview
```

### 2. Hosting Platform Setup

**For Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**For Netlify:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### 3. Post-Deployment Verification

#### SEO Testing Tools
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **PageSpeed Insights**: https://pagespeed.web.dev/

#### Manual Checks
- [ ] All pages load correctly
- [ ] Meta tags display properly in browser tabs
- [ ] Social sharing previews work correctly
- [ ] Google Analytics tracking is active
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Robots.txt is accessible at `/robots.txt`

## 📊 Monitoring & Analytics

### Google Analytics Events
The following events are automatically tracked:
- Page views
- Product views
- Add to cart actions
- Purchase completions
- Search queries

### Search Console Monitoring
Monitor these metrics weekly:
- Search impressions and clicks
- Average position for target keywords
- Core Web Vitals performance
- Mobile usability issues
- Index coverage status

### Key Performance Indicators (KPIs)
- Organic search traffic growth
- Conversion rate from organic traffic
- Average session duration
- Bounce rate improvement
- Local search visibility (Ghana)

## 🎯 Target Keywords Strategy

### Primary Keywords
- "perfume Ghana"
- "fragrances Ghana" 
- "designer perfumes Ghana"
- "buy perfumes online Ghana"

### Long-tail Keywords
- "authentic designer perfumes Ghana"
- "luxury fragrances Accra"
- "men's cologne Ghana delivery"
- "women's perfume Ghana price"

### Local SEO Keywords
- "perfume shop Accra"
- "fragrance store Ghana"
- "perfume delivery Ghana"
- "cologne Ghana online"

## 🔧 Maintenance Tasks

### Weekly
- [ ] Check Google Search Console for errors
- [ ] Monitor site speed performance
- [ ] Review analytics for traffic patterns

### Monthly
- [ ] Update product descriptions with SEO keywords
- [ ] Add new blog content (if applicable)
- [ ] Review and update meta descriptions
- [ ] Check for broken links

### Quarterly
- [ ] Audit competitor SEO strategies
- [ ] Update keyword targeting strategy
- [ ] Review and optimize Core Web Vitals
- [ ] Update structured data as needed

## 🚨 Common Issues & Solutions

### Issue: Google Analytics not tracking
**Solution**: Verify `VITE_GA_TRACKING_ID` is set correctly and site is in production mode

### Issue: Social sharing not showing correct image
**Solution**: Check Open Graph image URLs are absolute and images are accessible

### Issue: Search Console showing indexing errors
**Solution**: Verify sitemap URLs are correct and pages return 200 status codes

### Issue: Poor Core Web Vitals scores
**Solution**: Optimize images, enable lazy loading, minimize JavaScript bundles

## 📞 Support Resources

- **Google Search Console Help**: https://support.google.com/webmasters/
- **Google Analytics Help**: https://support.google.com/analytics/
- **Schema.org Documentation**: https://schema.org/docs/documents.html
- **Web.dev Performance Guide**: https://web.dev/performance/

---

**Last Updated**: January 2026
**Version**: 1.0
**Maintained by**: Development Team