// data/constants.js
// Shipping methods and costs
export const SHIPPING_METHODS = {
  STANDARD: { 
    id: 'standard',
    name: 'Standard Shipping', 
    price: 0, 
    description: '5-7 business days',
    deliveryTime: '5-7 days'
  },
  EXPRESS: { 
    id: 'express',
    name: 'Express Shipping', 
    price: 29.99, 
    description: '2-3 business days',
    deliveryTime: '2-3 days'
  },
  OVERNIGHT: { 
    id: 'overnight',
    name: 'Overnight Shipping', 
    price: 59.99, 
    description: 'Next business day',
    deliveryTime: '1 day'
  }
};

// Product badge types
export const PRODUCT_BADGES = {
  FEATURED: { 
    type: 'featured',
    label: 'Featured', 
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600'
  },
  BESTSELLER: { 
    type: 'bestseller',
    label: 'Bestseller', 
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600'
  },
  TRENDING: { 
    type: 'trending',
    label: 'Trending', 
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600'
  }
};

// Gemstone clarity grades
export const CLARITY_GRADES = [
  'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'
];

// Gemstone color grades
export const COLOR_GRADES = [
  'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'
];

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: 'Under $1,000', min: 0, max: 1000 },
  { label: '$1,000 - $3,000', min: 1000, max: 3000 },
  { label: '$3,000 - $5,000', min: 3000, max: 5000 },
  { label: 'Over $5,000', min: 5000, max: Infinity }
];

// Sort options for products
export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' }
];

// Contact form subjects
export const CONTACT_SUBJECTS = [
  'Select Subject',
  'Product Inquiry',
  'Order Status',
  'Certification Questions',
  'Shipping Information',
  'Returns & Exchanges',
  'Other'
];

// Trust badges features
export const TRUST_FEATURES = [
  {
    icon: 'Check',
    title: 'Certified Authentic',
    description: 'All gems come with certification'
  },
  {
    icon: 'Package',
    title: 'Free Shipping',
    description: 'On orders over $1000'
  },
  {
    icon: 'Award',
    title: '30-Day Return',
    description: 'Hassle-free returns'
  },
  {
    icon: 'Shield',
    title: 'Secure Payment',
    description: 'SSL encrypted checkout'
  }
];

// Social media links
export const SOCIAL_LINKS = {
  FACEBOOK: '#',
  INSTAGRAM: '#',
  TWITTER: '#',
  YOUTUBE: '#'
};

// Company information
export const COMPANY_INFO = {
  NAME: 'LuxeGems',
  EMAIL: {
    INFO: 'info@luxegems.com',
    SUPPORT: 'support@luxegems.com'
  },
  PHONE: '+1 (555) 123-4567',
  ADDRESS: {
    STREET: '123 Diamond Street',
    CITY: 'New York',
    STATE: 'NY',
    ZIP: '10001',
    COUNTRY: 'United States'
  },
  BUSINESS_HOURS: 'Mon-Fri: 9AM-6PM EST'
};

// App configuration
export const APP_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 1000,
  MAX_PRODUCT_QUANTITY: 10,
  CART_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  OTP_TIMEOUT: 30, // 30 seconds
  ITEMS_PER_PAGE: 12
};