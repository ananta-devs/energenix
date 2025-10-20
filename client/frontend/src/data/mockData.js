// data/mockData.js
import { Sparkles, Award } from 'lucide-react';

export const PRODUCTS = [
  {
    id: 1,
    title: "Blue Sapphire - Premium",
    category: "sapphire",
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&auto=format&fit=crop"
    ],
    price: 2499,
    originalPrice: 3200,
    rating: 4.8,
    reviews: 124,
    stock: 15,
    specs: {
      carat: "2.5",
      color: "Royal Blue",
      clarity: "VVS1",
      cut: "Oval",
      origin: "Kashmir"
    },
    description: "Exquisite blue sapphire with exceptional clarity and deep royal blue color.",
    featured: true,
    trending: true
  },
  {
    id: 2,
    title: "Emerald - Colombian",
    category: "emerald",
    images: [
      "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&auto=format&fit=crop"
    ],
    price: 3299,
    originalPrice: 4100,
    rating: 4.9,
    reviews: 98,
    stock: 8,
    specs: {
      carat: "3.0",
      color: "Vivid Green",
      clarity: "VS1",
      cut: "Emerald",
      origin: "Colombia"
    },
    description: "Stunning Colombian emerald with vivid green hue and excellent transparency.",
    featured: true,
    bestseller: true
  },
  {
    id: 3,
    title: "Ruby - Burmese",
    category: "ruby",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop"
    ],
    price: 4199,
    rating: 4.7,
    reviews: 76,
    stock: 5,
    specs: {
      carat: "2.8",
      color: "Pigeon Blood Red",
      clarity: "VVS2",
      cut: "Cushion",
      origin: "Myanmar"
    },
    description: "Rare Burmese ruby with the coveted pigeon blood red color.",
    bestseller: true
  },
  {
    id: 4,
    title: "Diamond - Round Brilliant",
    category: "diamond",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop"
    ],
    price: 5999,
    rating: 5.0,
    reviews: 203,
    stock: 12,
    specs: {
      carat: "1.5",
      color: "D",
      clarity: "IF",
      cut: "Excellent",
      origin: "Canada"
    },
    description: "Flawless round brilliant diamond with perfect cut and color.",
    featured: true
  },
  {
    id: 5,
    title: "Aquamarine - Santa Maria",
    category: "aquamarine",
    images: [
      "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&auto=format&fit=crop"
    ],
    price: 1299,
    rating: 4.6,
    reviews: 54,
    stock: 20,
    specs: {
      carat: "4.2",
      color: "Deep Blue",
      clarity: "VS2",
      cut: "Emerald",
      origin: "Brazil"
    },
    description: "Beautiful Santa Maria aquamarine with deep blue color.",
    trending: true
  },
  {
    id: 6,
    title: "Pink Tourmaline",
    category: "tourmaline",
    images: [
      "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop"
    ],
    price: 899,
    rating: 4.5,
    reviews: 42,
    stock: 18,
    specs: {
      carat: "3.5",
      color: "Hot Pink",
      clarity: "VS1",
      cut: "Oval",
      origin: "Afghanistan"
    },
    description: "Vibrant pink tourmaline with excellent saturation.",
    trending: true
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Gems', icon: Sparkles },
  { id: 'diamond', name: 'Diamonds', icon: Award },
  { id: 'sapphire', name: 'Sapphires', icon: Sparkles },
  { id: 'emerald', name: 'Emeralds', icon: Sparkles },
  { id: 'ruby', name: 'Rubies', icon: Sparkles },
  { id: 'aquamarine', name: 'Aquamarine', icon: Sparkles },
  { id: 'tourmaline', name: 'Tourmaline', icon: Sparkles }
];

export const HERO_SLIDES = [
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&auto=format&fit=crop',
    title: 'Discover Rare Gemstones',
    subtitle: 'Handpicked collection of the world\'s finest gems',
    cta: 'Shop Collection',
    ctaLink: '/category/all'
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=1920&auto=format&fit=crop',
    title: 'Premium Blue Sapphires',
    subtitle: 'Ethically sourced, certified authentic',
    cta: 'View Sapphires',
    ctaLink: '/category/sapphire'
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1920&auto=format&fit=crop',
    title: 'Investment Grade Diamonds',
    subtitle: 'Certified conflict-free diamonds',
    cta: 'Explore Diamonds',
    ctaLink: '/category/diamond'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Mitchell",
    rating: 5,
    text: "Absolutely stunning sapphire! The quality exceeded my expectations. Fast shipping and beautiful packaging.",
    avatar: "SM"
  },
  {
    id: 2,
    name: "James Chen",
    rating: 5,
    text: "Professional service and authentic gemstones. The certification and documentation were impeccable.",
    avatar: "JC"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    rating: 5,
    text: "My engagement ring emerald is breathtaking. The team helped me choose the perfect stone.",
    avatar: "ER"
  }
];