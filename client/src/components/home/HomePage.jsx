import React from "react";
import { TESTIMONIALS } from "../../data";
import { TrendingUp, Star } from "lucide-react";
import HeroSlider from "./HeroSlider.jsx";
import ProductCard from "../product/ProductCard.jsx";
import { useProducts } from "../../context/ProductContext.jsx";

export default function HomePage() {
  const { products, loading, error } = useProducts();

  const trendingProducts = products.filter((p) => p.trending);
  const randomTrending = trendingProducts
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  if (loading)
    return <div className="py-20 text-center">Loading trending products...</div>;
  if (error)
    return <div className="py-20 text-center">Error: {error.message}</div>;

  return (
    <div className="w-full">

      {/* HERO — FULL WIDTH, NO PADDING */}
      <HeroSlider />

      {/* EVERYTHING BELOW — INSIDE CONTAINER */}
      <div className="mx-auto w-full max-w-screen-xl px-4 space-y-20">

        {/* TRENDING */}
        <section>
          <div className="text-center mb-12">
            <TrendingUp className="w-12 h-12 mx-auto text-amber-500 mb-4" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <p className="text-gray-600">Popular choices this season</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {randomTrending.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>

        {/* STORY */}
        <section>
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
                Energenix - where ancient wisdom meets modern science.
              </p>
            </div>

            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop"
              className="rounded-xl shadow-xl"
            />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-gray-50 py-16 -mx-4 px-4 md:-mx-0 md:px-0 rounded-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
            <p className="text-gray-600">Trusted by thousands</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{t.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 font-semibold text-purple-600">
                    {t.avatar}
                  </div>
                  <span className="font-semibold">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
