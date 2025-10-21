import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Facebook, Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">LuxeGems</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted source for authentic, ethically-sourced precious gemstones.
            </p>
            <div className="flex space-x-3">
              <button className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition">
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/category/all" className="text-gray-400 hover:text-white transition">Shop</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Shipping Information</a></li>
              <li><a href="#" className="hover:text-white transition">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition">Certification</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe for exclusive offers and updates</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 outline-none focus:border-purple-600"
              />
              <button className="px-4 py-2 bg-purple-600 rounded-r-lg hover:bg-purple-700 transition cursor-pointer">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; 2025 LuxeGems. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
