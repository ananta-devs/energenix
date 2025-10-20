import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-purple-200">We're here to help with any questions about our gemstones</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="px-4 py-3 border rounded-lg outline-none focus:border-purple-600"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="px-4 py-3 border rounded-lg outline-none focus:border-purple-600"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:border-purple-600"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:border-purple-600"
                />
                <select className="w-full px-4 py-3 border rounded-lg outline-none focus:border-purple-600">
                  <option>Select Subject</option>
                  <option>Product Inquiry</option>
                  <option>Order Status</option>
                  <option>Certification Questions</option>
                  <option>Other</option>
                </select>
                <textarea
                  placeholder="Your Message"
                  rows="6"
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:border-purple-600"
                ></textarea>
                <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Mail className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-gray-600">info@luxegems.com</p>
              <p className="text-gray-600">support@luxegems.com</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Phone className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500 mt-1">Mon-Fri: 9AM-6PM EST</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MapPin className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold mb-2">Address</h3>
              <p className="text-gray-600">
                123 Diamond Street<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <button className="p-3 bg-gray-100 rounded-full hover:bg-purple-100 transition">
                  <Facebook className="w-5 h-5 text-gray-700" />
                </button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-purple-100 transition">
                  <Instagram className="w-5 h-5 text-gray-700" />
                </button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-purple-100 transition">
                  <Twitter className="w-5 h-5 text-gray-700" />
                </button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-purple-100 transition">
                  <Youtube className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
