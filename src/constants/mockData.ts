import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Bleu de Chanel Eau de Parfum',
    brand: 'Chanel',
    price: 450.00,
    originalPrice: 520.00,
    images: "./1.jpg",
    description: 'A timeless masculine fragrance that embodies elegance and strength with woody aromatic notes.',
    category: 'unisex',
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
    images: "./1.jpg",
    description: 'A delicate and romantic fragrance with notes of peony and rose.',
    category: 'gift-sets',
    gender: 'men',
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
    name: 'Miss Dior Blooming Bouquet',
    brand: 'Dior',
    price: 380.00,
    originalPrice: 420.00,
    images: "./1.jpg",
    description: 'A delicate and romantic fragrance with notes of peony and rose.',
    category: 'gift-sets',
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
    id: '4',
    name: 'Miss Dior Blooming Bouquet',
    brand: 'Dior',
    price: 380.00,
    originalPrice: 420.00,
    images: "./1.jpg",
    description: 'A delicate and romantic fragrance with notes of peony and rose.',
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
    id: '5',
    name: 'Miss Dior Blooming Bouquet',
    brand: 'Dior',
    price: 380.00,
    originalPrice: 420.00,
    images: "./1.jpg",
    description: 'A delicate and romantic fragrance with notes of peony and rose.',
    category: 'men',
    gender: 'men',
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
    id: '6',
    name: 'Miss Dior Blooming Bouquet',
    brand: 'Dior',
    price: 380.00,
    originalPrice: 420.00,
    images: "./1.jpg",
    description: 'A delicate and romantic fragrance with notes of peony and rose.',
    category: 'body-sprays',
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
    id: '7',
    name: 'Miss Dior Blooming Bouquet',
    brand: 'Dior',
    price: 380.00,
    originalPrice: 420.00,
    images: "./1.jpg",
    description: 'A delicate and romantic fragrance with notes of peony and rose.',
    category: 'unisex',
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
    id: '8',
    name: 'Miss Dior Blooming Bouquet',
    brand: 'Dior',
    price: 380.00,
    originalPrice: 420.00,
    images: "./1.jpg",
    description: 'A delicate and romantic fragrance with notes of peony and rose.',
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
  // Add more products with different categories and genders...
];

export const categories = [
  { id: 'men', name: "Men's Perfumes", count: 45 },
  { id: 'women', name: "Women's Perfumes", count: 52 },
  { id: 'unisex', name: 'Unisex', count: 23 },
  { id: 'luxury', name: 'Luxury Collection', count: 18 },
  { id: 'body-sprays', name: 'Body Sprays & Deodorants', count: 31 },
  { id: 'gift-sets', name: 'Gift Sets', count: 12 },
];