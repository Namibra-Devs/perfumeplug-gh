# PerfumePlug - E-commerce Frontend

A modern, responsive e-commerce frontend application built with React, TypeScript, and Vite for selling perfumes and fragrances online.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse and search through perfume collections
- **Advanced Search**: Real-time frontend search with category filtering
- **Product Details**: Comprehensive product pages with image galleries
- **Shopping Cart**: Add, remove, and manage cart items with persistent storage
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Category Navigation**: Browse products by categories (Men's, Women's, Unisex, Luxury, etc.)

### User Experience
- **Dynamic Search**: Instant search results with product previews
- **Image Zoom**: Product image zoom functionality on hover
- **Loading States**: Skeleton loaders and smooth transitions
- **Error Handling**: Graceful error handling with fallback UI
- **Accessibility**: ARIA labels and keyboard navigation support

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Modern React**: Hooks, Context API, and functional components
- **Performance Optimized**: Debounced search, memoized computations
- **SEO Ready**: Meta tags and structured data support
- **Production Ready**: Optimized build process and error boundaries

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 7.2.2** - Fast build tool and dev server

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 12.23.24** - Smooth animations and transitions
- **Lucide React 0.544.0** - Beautiful SVG icons
- **Headless UI 2.2.8** - Unstyled, accessible UI components

### Routing & Navigation
- **React Router DOM 7.9.1** - Client-side routing

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS & Autoprefixer** - CSS processing
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (Navbar, Header, Footer)
│   ├── product/         # Product-related components
│   └── ui/              # Generic UI components
├── constants/           # Application constants and configuration
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries and API configuration
├── pages/               # Page components
├── services/            # API service functions
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── main.tsx            # Application entry point
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd perfumeplug-gh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Configure your API endpoints and other environment variables in `.env`

4. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🏗️ Architecture & Design Patterns

### Component Architecture
- **Functional Components**: All components use React hooks
- **Custom Hooks**: Reusable logic extracted into custom hooks
- **Context API**: Global state management for cart and user data
- **Compound Components**: Complex UI components broken into smaller parts

### State Management
- **React Context**: Global state for cart, wishlist, and user authentication
- **Local State**: Component-specific state using useState and useReducer
- **Persistent Storage**: Cart and wishlist data persisted in localStorage

### Performance Optimizations
- **Memoization**: useMemo and useCallback for expensive computations
- **Debounced Search**: Prevents excessive API calls during search
- **Lazy Loading**: Code splitting for better initial load times
- **Image Optimization**: Proper image loading with fallbacks

## 🔧 Key Components

### Navbar Component
- Dynamic category extraction from products
- Real-time frontend search functionality
- Responsive mobile menu
- Cart item counter
- Search suggestions and autocomplete

### Product Components
- **ProductCard**: Reusable product display component
- **ProductPage**: Detailed product view with image gallery
- **ProductSkeleton**: Loading state component

### Shopping Cart
- Add/remove items functionality
- Quantity management
- Persistent storage
- Real-time total calculations

### Search System
- Frontend-based search for better performance
- Multi-field search (name, description, category, tags)
- Category matching and suggestions
- Debounced input for optimal UX

## 🎨 Styling Guidelines

### Design System
- **Color Palette**: Black/yellow gradient theme with accent colors
- **Typography**: Consistent font sizes and weights
- **Spacing**: Tailwind's spacing scale for consistency
- **Responsive Design**: Mobile-first approach

### Component Styling
- **Utility Classes**: Tailwind CSS for rapid development
- **Consistent Patterns**: Reusable styling patterns across components
- **Dark Theme**: Optimized for dark backgrounds with proper contrast
- **Animations**: Smooth transitions using Framer Motion

## 🔌 API Integration

### Service Layer
- **Product Service**: Fetch products, search, and filtering
- **Category Service**: Dynamic category management
- **Error Handling**: Centralized error handling with user-friendly messages

### Data Flow
1. API calls through service functions
2. Data transformation for frontend consumption
3. State updates through hooks
4. UI re-rendering with new data

## 🧪 Development Best Practices

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Consistent code formatting and best practices
- **Component Composition**: Reusable and maintainable components
- **Error Boundaries**: Graceful error handling

### Performance
- **Bundle Optimization**: Tree shaking and code splitting
- **Image Optimization**: Proper image formats and lazy loading
- **Caching**: Efficient data caching strategies
- **Minimal Re-renders**: Optimized component updates

### Accessibility
- **ARIA Labels**: Proper accessibility attributes
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Semantic HTML structure
- **Color Contrast**: WCAG compliant color schemes

## 🚀 Deployment

### Build Process
```bash
npm run build
```
This creates an optimized production build in the `dist/` directory.

### Environment Configuration
- Development: `.env.development`
- Production: `.env.production`
- Configure API endpoints, CDN URLs, and feature flags

### Deployment Platforms
- **Vercel**: Recommended for React applications
- **Netlify**: Alternative with good React support
- **AWS S3 + CloudFront**: For enterprise deployments

## 🔮 Future Enhancements

### Planned Features
- **User Authentication**: Login/register functionality
- **Order Management**: Order history and tracking
- **Payment Integration**: Stripe/PayPal integration
- **Product Reviews**: User review and rating system
- **Advanced Filtering**: Price range, brand, and availability filters

### Technical Improvements
- **PWA Support**: Service workers and offline functionality
- **Internationalization**: Multi-language support
- **Advanced Analytics**: User behavior tracking
- **Performance Monitoring**: Real-time performance metrics

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use meaningful component and variable names
- Write comprehensive comments for complex logic
- Ensure responsive design for all new components
- Add proper error handling and loading states

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For technical support or questions about this project, please contact the development team.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
