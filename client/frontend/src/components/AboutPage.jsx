import React from 'react';
import { Award, Sparkles, Check } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About LuxeGems</h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Connecting gem enthusiasts with the world's finest precious stones since 2010
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded by gemology experts with over 30 years of combined experience, LuxeGems has become a trusted name in the world of precious gemstones. Our passion for rare and beautiful stones drives everything we do.
              </p>
              <p className="text-gray-700 mb-4">
                We travel the world to source the finest gems directly from mines and trusted suppliers, ensuring authenticity, ethical sourcing, and exceptional quality in every piece we offer.
              </p>
              <p className="text-gray-700">
                Each gemstone in our collection is carefully inspected, certified, and comes with complete documentation of its origin and characteristics.
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

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Award className="w-16 h-16 mx-auto text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Authenticity</h3>
              <p className="text-gray-600">
                Every gemstone is certified authentic with complete documentation and grading reports from recognized gemological laboratories.
              </p>
            </div>
            <div className="text-center">
              <Sparkles className="w-16 h-16 mx-auto text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Quality</h3>
              <p className="text-gray-600">
                We hand-select only the finest specimens, focusing on exceptional color, clarity, and cut in every piece we offer.
              </p>
            </div>
            <div className="text-center">
              <Check className="w-16 h-16 mx-auto text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Ethics</h3>
              <p className="text-gray-600">
                Committed to ethical sourcing and conflict-free gems, supporting sustainable mining practices and fair trade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Expert Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Dr. Sarah Johnson', role: 'Chief Gemologist', avatar: 'SJ' },
              { name: 'Michael Chen', role: 'Senior Buyer', avatar: 'MC' },
              { name: 'Emily Rodriguez', role: 'Quality Director', avatar: 'ER' }
            ].map((member, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
