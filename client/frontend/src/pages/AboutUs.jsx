import React from 'react';
import { 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Target,
  Globe,
  Lock,
  Truck,
  Mail,
  Phone,
  CheckCircle
} from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Who We Are */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-ubuntu">
                About US
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  EnergeniX is an India-based spiritual wellness and energy lifestyle brand 
                  focused on supporting mindful living, balance, and positive intention.
                </p>
                <p>
                  Built on a <span className="font-semibold text-blue-900">70+ year family heritage</span> of spiritual practices, 
                  we blend traditional belief systems with modern e-commerce to make carefully 
                  curated spiritual products accessible across India.
                </p>
                <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500 mt-6">
                  <p className="italic text-gray-800">
                    "We believe spirituality is deeply personal. Our role is not to promise results, 
                    but to offer authentic, responsibly presented spiritual tools for your wellness journey."
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Mindful Living</h3>
                  <p className="text-sm text-gray-600 mt-2">Supporting balance & positive intention</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">70+ Years Heritage</h3>
                  <p className="text-sm text-gray-600 mt-2">Generations of spiritual tradition</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Curated Products</h3>
                  <p className="text-sm text-gray-600 mt-2">Authentic spiritual tools</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">PAN-India Access</h3>
                  <p className="text-sm text-gray-600 mt-2">Available across India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-ubuntu">
            Our Vision & Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Authenticity",
                desc: "Culturally respectful sourcing and traditional practices"
              },
              {
                icon: Lock,
                title: "Transparency",
                desc: "Honest communication with clear disclaimers"
              },
              {
                icon: Heart,
                title: "Ethical Presentation",
                desc: "Responsible portrayal of spiritual products"
              },
              {
                icon: Sparkles,
                title: "Respect for Faith",
                desc: "Honoring individual beliefs and traditions"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage & Experience */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-8 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 font-ubuntu">Our Spiritual Heritage</h2>
                <ul className="space-y-4">
                  {[
                    "70+ years of family-led spiritual traditions",
                    "Deep understanding of rituals & cultural belief systems",
                    "Authentic product curation based on heritage",
                    "Traditional usage guidance with modern context"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-amber-300 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-ubuntu">
                Experience & Spiritual Heritage
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  EnergeniX is inspired by generations of lived experience within family-led 
                  spiritual traditions, rituals, and cultural belief systems.
                </p>
                <p>
                  This heritage influences how we select products, describe their traditional 
                  significance, and communicate usage guidance with honesty and respect.
                </p>
                <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="font-semibold text-gray-800 mb-2">Important Belief & Responsibility</p>
                  <p className="text-gray-700">
                    We do not promise miracles or guaranteed results. Our products support 
                    intention setting, mindfulness practices, and personal spiritual routines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-ubuntu">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Intention Bracelets",
                desc: "Energy-focused accessories for positive intention setting"
              },
              {
                title: "Protection Accessories",
                desc: "Traditional items for mindfulness and spiritual protection"
              },
              {
                title: "Cleansing Tools",
                desc: "Tools for energy charging and spiritual cleansing"
              },
              {
                title: "Traditional Items",
                desc: "Culturally significant spiritual products"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment & Business Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Commitment */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 font-ubuntu">
                Our Commitment to Trust
              </h2>
              <div className="space-y-6">
                {[
                  "Clear and accurate product descriptions",
                  "Honest, non-misleading communication",
                  "Transparent business policies",
                  "Secure online transactions",
                  "Respect for customer privacy"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-gradient-to-br from-blue-950 to-blue-900 text-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 font-ubuntu">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-blue-200">Brand Name</p>
                  <p className="text-lg font-semibold">EnergeniX</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Website</p>
                  <a 
                    href="https://energenix.store" 
                    className="text-lg font-semibold text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    https://energenix.store
                  </a>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Country of Operation</p>
                  <p className="text-lg font-semibold">India</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Business Type</p>
                  <p className="text-lg font-semibold">Spiritual & Wellness E-Commerce</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Policies */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-ubuntu">
            Contact & Support
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Customer Support */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-blue-900 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Email Support</h3>
              </div>
              <a 
                href="mailto:energenix.help@gmail.com" 
                className="text-blue-700 hover:text-blue-800 font-medium"
              >
                energenix.help@gmail.com
              </a>
              <p className="text-sm text-gray-600 mt-4">
                Monday – Saturday | 10:00 AM – 6:00 PM IST
              </p>
            </div>

            {/* WhatsApp */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">WhatsApp</h3>
              </div>
              <a 
                href="https://wa.me/919476156308" 
                className="text-green-700 hover:text-green-800 font-medium"
              >
                +91 94761 56308
              </a>
              <p className="text-sm text-gray-600 mt-4">
                Quick responses during business hours
              </p>
            </div>

            {/* Policies */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Truck className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Policies</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">• PAN-India Shipping</p>
                <p className="text-sm text-gray-700">• Secure Payment Gateways</p>
                <p className="text-sm text-gray-700">• Transparent Refund Policy</p>
                <p className="text-sm text-gray-700">• Privacy Protection</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6 max-w-3xl mx-auto">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-red-600 font-bold">⚠️</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Important Disclaimer</h4>
                <p className="text-gray-700">
                  All EnergeniX products are offered for spiritual and wellness purposes only. 
                  They are not intended to diagnose, treat, cure, or guarantee any medical, 
                  financial, legal, or life outcomes. Results and experiences vary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Promise */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-ubuntu">
            Our Promise to You
          </h2>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {["Heritage", "Honesty", "Responsibility", "Respect for Belief"].map((item) => (
              <span 
                key={item} 
                className="px-6 py-3 bg-blue-100 text-blue-800 rounded-full font-semibold"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="text-lg text-gray-700 italic">
            We are here to support your journey — with authenticity, not exaggeration.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;