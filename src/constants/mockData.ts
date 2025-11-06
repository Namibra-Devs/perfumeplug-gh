import { Product } from '../types';

const productImages = [
  '/1.jpg',
  '/2.jpg',
  '/1.jpg'
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Youthful Body Splash',
    brand: 'Chanel',
    price: 450.00,
    originalPrice: 520.00,
    images: productImages,
    description: 'A timeless masculine fragrance that embodies elegance and strength with woody aromatic notes.',
    category: 'luxury',
    gender: 'men',
    size: '100ml',
    inStock: true,
    rating: 4.8,
    reviewCount: 127,
    fragranceNotes: {
      top: ['Ginger', 'Mint', 'Pink Pepper'],
      middle: ['Nutmeg', 'Jasmine', 'ISO E Super'],
      base: ['Sandalwood', 'Vetiver', 'Frankincense']
    },
    featured: true
  },
  {
    id: '2',
    name: 'Miss Dior Blooming Bouquet',
    brand: 'Dior',
    price: 380.00,
    originalPrice: 420.00,
    images: productImages,
    description: 'A delicate and romantic fragrance with notes of peony and rose, perfect for daytime wear.',
    category: 'luxury',
    gender: 'women',
    size: '50ml',
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
    fragranceNotes: {
      top: ['Peony', 'Rose'],
      middle: ['Apricot', 'Peach'],
      base: ['White Musk', 'Cedar']
    },
    featured: true
  },
  {
    id: '3',
    name: 'Sauvage Eau de Toilette',
    brand: 'Dior',
    price: 420.00,
    originalPrice: 480.00,
    images: productImages,
    description: 'A fresh, spicy fragrance with bold character and magnetic appeal.',
    category: 'men',
    gender: 'men',
    size: '100ml',
    inStock: true,
    rating: 4.7,
    reviewCount: 203,
    fragranceNotes: {
      top: ['Calabrian Bergamot'],
      middle: ['Sichuan Pepper'],
      base: ['Ambroxan', 'Vanilla']
    },
    featured: false
  },
  {
    id: '4',
    name: 'Black Opium Eau de Parfum',
    brand: 'Yves Saint Laurent',
    price: 390.00,
    originalPrice: 450.00,
    images: productImages,
    description: 'An addictive gourmand fragrance with coffee and vanilla accents.',
    category: 'luxury',
    gender: 'women',
    size: '90ml',
    inStock: true,
    rating: 4.5,
    reviewCount: 156,
    fragranceNotes: {
      top: ['Pear', 'Pink Pepper'],
      middle: ['Coffee', 'Orange Blossom'],
      base: ['Vanilla', 'Cedarwood']
    },
    featured: true
  },
  {
    id: '5',
    name: 'Acqua di Gio Pour Homme',
    brand: 'Giorgio Armani',
    price: 350.00,
    originalPrice: 400.00,
    images: productImages,
    description: 'A fresh aquatic fragrance inspired by the sea and sun of Pantelleria.',
    category: 'men',
    gender: 'men',
    size: '125ml',
    inStock: true,
    rating: 4.4,
    reviewCount: 98,
    fragranceNotes: {
      top: ['Bergamot', 'Neroli'],
      middle: ['Sea Notes', 'Jasmine'],
      base: ['Patchouli', 'Amber']
    },
    featured: false
  },
  {
    id: '6',
    name: 'Light Blue Eau Intense',
    brand: 'Dolce & Gabbana',
    price: 320.00,
    originalPrice: 370.00,
    images: productImages,
    description: 'A vibrant Mediterranean fragrance with citrus and floral notes.',
    category: 'unisex',
    gender: 'unisex',
    size: '100ml',
    inStock: true,
    rating: 4.3,
    reviewCount: 134,
    fragranceNotes: {
      top: ['Lemon', 'Grapefruit'],
      middle: ['Jasmine', 'Bellflower'],
      base: ['Amberwood', 'Musk']
    },
    featured: false
  },
  {
    id: '7',
    name: 'Good Girl Eau de Parfum',
    brand: 'Carolina Herrera',
    price: 410.00,
    originalPrice: 470.00,
    images: productImages,
    description: 'A sensual, provocative fragrance with contrasting notes of coffee and flowers.',
    category: 'luxury',
    gender: 'women',
    size: '80ml',
    inStock: true,
    rating: 4.6,
    reviewCount: 87,
    fragranceNotes: {
      top: ['Almond', 'Coffee'],
      middle: ['Jasmine', 'Tuberose'],
      base: ['Tonka Bean', 'Cacao']
    },
    featured: true
  },
  {
    id: '8',
    name: 'One Million Eau de Toilette',
    brand: 'Paco Rabanne',
    price: 290.00,
    originalPrice: 340.00,
    images: productImages,
    description: 'A bold, spicy fragrance with leather and amber notes for confident men.',
    category: 'men',
    gender: 'men',
    size: '100ml',
    inStock: true,
    rating: 4.2,
    reviewCount: 176,
    fragranceNotes: {
      top: ['Blood Orange', 'Mint'],
      middle: ['Cinnamon', 'Spice Notes'],
      base: ['Leather', 'Amber']
    },
    featured: false
  },
  {
    id: '9',
    name: 'La Vie Est Belle Eau',
    brand: 'Lancôme',
    price: 430.00,
    originalPrice: 490.00,
    images: productImages,
    description: 'A joyful fragrance celebrating happiness with gourmand iris notes.',
    category: 'luxury',
    gender: 'women',
    size: '75ml',
    inStock: true,
    rating: 4.7,
    reviewCount: 112,
    fragranceNotes: {
      top: ['Pear', 'Blackcurrant'],
      middle: ['Iris', 'Jasmine'],
      base: ['Praline', 'Vanilla']
    },
    featured: true
  },
  {
    id: '10',
    name: 'Boss Bottled Eau de',
    brand: 'Hugo Boss',
    price: 280.00,
    originalPrice: 330.00,
    images: productImages,
    description: 'A classic masculine fragrance with apple and cinnamon notes.',
    category: 'men',
    gender: 'men',
    size: '100ml',
    inStock: true,
    rating: 4.1,
    reviewCount: 94,
    fragranceNotes: {
      top: ['Apple', 'Bergamot'],
      middle: ['Cinnamon', 'Geranium'],
      base: ['Sandalwood', 'Vetiver']
    },
    featured: false
  },
  {
    id: '11',
    name: 'Chance Eau Tendre Eau de',
    brand: 'Chanel',
    price: 470.00,
    originalPrice: 530.00,
    images: productImages,
    description: 'A soft, floral fragrance capturing the unexpectedness of chance.',
    category: 'luxury',
    gender: 'women',
    size: '100ml',
    inStock: true,
    rating: 4.8,
    reviewCount: 145,
    fragranceNotes: {
      top: ['Quince', 'Grapefruit'],
      middle: ['Jasmine', 'Hyacinth'],
      base: ['White Musk', 'Iris']
    },
    featured: true
  },
  {
    id: '12',
    name: 'Invictus Eau de Toilette',
    brand: 'Paco Rabanne',
    price: 310.00,
    originalPrice: 360.00,
    images: productImages,
    description: 'A victorious fragrance with marine and woody notes for champions.',
    category: 'men',
    gender: 'men',
    size: '100ml',
    inStock: true,
    rating: 4.3,
    reviewCount: 121,
    fragranceNotes: {
      top: ['Grapefruit', 'Marine Notes'],
      middle: ['Bay Leaf', 'Jasmine'],
      base: ['Patchouli', 'Oakmoss']
    },
    featured: false
  },
  {
    id: '13',
    name: 'J\'adore Eau de Parfum',
    brand: 'Dior',
    price: 440.00,
    originalPrice: 500.00,
    images: productImages,
    description: 'A golden floral bouquet celebrating the beauty of women.',
    category: 'luxury',
    gender: 'women',
    size: '100ml',
    inStock: true,
    rating: 4.9,
    reviewCount: 198,
    fragranceNotes: {
      top: ['Pear', 'Melon'],
      middle: ['Jasmine', 'Orchid'],
      base: ['Vanilla', 'Amber']
    },
    featured: true
  },
  {
    id: '14',
    name: 'Body Spray Fresh',
    brand: 'Nivea',
    price: 45.00,
    originalPrice: 60.00,
    images: productImages,
    description: 'Refreshing body spray for daily use with long-lasting freshness.',
    category: 'body-sprays',
    gender: 'unisex',
    size: '150ml',
    inStock: true,
    rating: 4.0,
    reviewCount: 67,
    fragranceNotes: {
      top: ['Citrus', 'Mint'],
      middle: ['Lavender', 'Herbal Notes'],
      base: ['Musk', 'Woody Notes']
    },
    featured: false
  },
  {
    id: '15',
    name: 'Luxury Gift Set',
    brand: 'Chanel',
    price: 680.00,
    originalPrice: 800.00,
    images: productImages,
    description: 'Premium gift set including perfume, body lotion, and travel spray.',
    category: 'gift-sets',
    gender: 'women',
    size: 'Set',
    inStock: true,
    rating: 4.7,
    reviewCount: 56,
    fragranceNotes: {
      top: ['Various Notes'],
      middle: ['Gourmand Accords'],
      base: ['Woody Undertones']
    },
    featured: true
  },
  {
    id: '16',
    name: 'Sport Deodorant Spray',
    brand: 'Adidas',
    price: 35.00,
    originalPrice: 45.00,
    images: productImages,
    description: 'High-performance deodorant for active lifestyles with 48h protection.',
    category: 'body-sprays',
    gender: 'men',
    size: '150ml',
    inStock: true,
    rating: 4.2,
    reviewCount: 89,
    fragranceNotes: {
      top: ['Fresh Notes'],
      middle: ['Sporty Accords'],
      base: ['Clean Musk']
    },
    featured: false
  }
];

export const categories = [
  { id: 'men', name: "Men's Perfumes", count: products.filter(p => p.gender === 'men' && p.category !== 'body-sprays' && p.category !== 'gift-sets').length },
  { id: 'women', name: "Women's Perfumes", count: products.filter(p => p.gender === 'women' && p.category !== 'body-sprays' && p.category !== 'gift-sets').length },
  { id: 'unisex', name: 'Unisex', count: products.filter(p => p.gender === 'unisex' && p.category !== 'body-sprays' && p.category !== 'gift-sets').length },
  { id: 'luxury', name: 'Luxury Collection', count: products.filter(p => p.category === 'luxury').length },
  { id: 'body-sprays', name: 'Body Sprays & Deodorants', count: products.filter(p => p.category === 'body-sprays').length },
  { id: 'gift-sets', name: 'Gift Sets', count: products.filter(p => p.category === 'gift-sets').length },
];