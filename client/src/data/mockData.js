// data/mockData.js
import { Sparkles, Award } from 'lucide-react';
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