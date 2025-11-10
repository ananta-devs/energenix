import React from 'react';
import { PRODUCTS, TESTIMONIALS } from '../../data';
import { Star, TrendingUp } from 'lucide-react';
import HeroSlider from './HeroSlider.jsx';
import ProductCard from '../product/ProductCard.jsx';

export default function HomePage() {

  const trendingProducts = PRODUCTS.filter(p => p.trending);

  return (
    <div>
      <HeroSlider />

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
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                We combine the natural energy of crystals with modern innovation to help you find balance, attract wealth, and live with positive energy. Every Energenix product is made to align your chakras, boost abundance and invite prosperity into your life.
              </p>
              <p className="text-gray-700 mb-4">
                We believe that when your energy is balanced and your intentions are clear, success and happiness flow naturally from the universe.
              </p>
              <p className="text-gray-700">
                Energenix - where ancient wisdom meets modern science. Energenix - where ancient wisdom meets modern science.   
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop"
                alt="Gemstone collection"
                className="rounded-xl shadow-xl"
              />
            </div>
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
    </div>
  );
}
