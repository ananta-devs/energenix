import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, CATEGORIES, TESTIMONIALS } from '../../data';
import { Award, Mail, Star, ArrowRight, TrendingUp } from 'lucide-react';
import HeroSlider from './HeroSlider.jsx';
import ProductCard from '../product/ProductCard.jsx';

export default function HomePage() {

  const trendingProducts = PRODUCTS.filter(p => p.trending);
  const bestsellerProducts = PRODUCTS.filter(p => p.bestseller);

  return (
    <div>
      <HeroSlider />

      {/* Categories */}
      <section className=" ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600">Explore our curated collection of precious gemstones</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition group"
              >
                <cat.icon className="w-12 h-12 mx-auto mb-3 text-purple-600 group-hover:scale-110 transition" />
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="items-center justify-between mb-8">
            <div className="text-center mb-12">
              <TrendingUp className="w-12 h-12 mx-auto text-amber-500 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Trending Now</h2>
              <p className="text-gray-600">Popular choices this season</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-4 flex justify-center items-center">
            <Link
              to="/category/all"
              className="text-purple-600 font-semibold hover:underline flex items-center text-xl"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Award className="w-12 h-12 mx-auto text-amber-500 mb-4" />
            <h2 className="text-3xl font-bold mb-2">Bestsellers</h2>
            <p className="text-gray-600">Customer favorites and top-rated gems</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestsellerProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-gray-600">Trusted by thousands of gem enthusiasts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-600 mr-3">
                    {testimonial.avatar}
                  </div>
                  <span className="font-semibold">{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="mb-8">Get exclusive access to new collections and special offers</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full text-gray-900 outline-none bg-white"
              />
              <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
