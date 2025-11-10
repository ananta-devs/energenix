import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';
import logo from '../../assets/logo.svg';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-5">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                <img src={logo} alt="Energenix Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold">Energenix</span>
            </div>
            <p className="text-gray-400 mb-4">
              Where ancient wisdom meets modern science.
            </p>
            <div className="flex space-x-3">
              <button className="p-2 bg-gray-800 rounded-full hover:bg-blue-950 transition">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-800 rounded-full hover:bg-blue-950 transition">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-800 rounded-full hover:bg-blue-950 transition">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-800 rounded-full hover:bg-blue-950 transition">
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links and Customer Service in two columns on small screens */}
          <div className="grid grid-cols-2 gap-8 md:col-span-1 lg:col-span-2">
            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link to="/category/all" className="text-gray-400 hover:text-white transition">Shop</Link></li>
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
              </ul>
            </div>
          </div>

          {/* Newsletter - Fixed layout */}
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe for exclusive offers and updates</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-800"
              />
              <button className="px-4 py-2 bg-gray-800 rounded-r-lg hover:bg-blue-950 transition cursor-pointer">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; 2025 Energenix. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/cookie" className="hover:text-white transition">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}