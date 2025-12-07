import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api'; // Import api

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    if (user) {
      const nameParts = user.fullName.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        message: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/contact', formData); // Use api.post

      if (response.status === 200) { // Axios uses status
        if (user) {
          const nameParts = user.fullName.split(' ');
          setFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
            message: '',
          });
        } else {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: '',
          });
        }
      }
    } catch (error) {
      console.error('Error submitting contact form:', error.response?.data?.message || error.message);
    }
  };

  const isUserLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isUserLoggedIn}
                      className={`px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950 focus:ring-opacity-20 transition-colors duration-200 ${isUserLoggedIn ? 'bg-gray-100' : ''}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isUserLoggedIn}
                      className={`px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950 focus:ring-opacity-20 transition-colors duration-200 ${isUserLoggedIn ? 'bg-gray-100' : ''}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isUserLoggedIn}
                      className={`px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950 focus:ring-opacity-20 transition-colors duration-200 ${isUserLoggedIn ? 'bg-gray-100' : ''}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isUserLoggedIn}
                      className={`px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950 focus:ring-opacity-20 transition-colors duration-200 ${isUserLoggedIn ? 'bg-gray-100' : ''}`}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950 focus:ring-opacity-20 resize-none transition-colors duration-200"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 lg:space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-blue-800 flex-shrink-0" />
                <h3 className="font-bold text-lg">Email</h3>
              </div>
              <div className="ml-9 space-y-2">
                <p className="text-gray-600 break-words">info@luxegems.com</p>
                <p className="text-gray-600 break-words">support@luxegems.com</p>
              </div>

              <div className="flex items-center gap-3 mb-4 mt-6">
                <Phone className="w-6 h-6 text-blue-800 flex-shrink-0" />
                <h3 className="font-bold text-lg">Phone</h3>
              </div>
              <div className="ml-9">
                <p className="text-gray-600">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500 mt-1">Mon-Fri: 9AM-6PM EST</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-800 flex-shrink-0" />
                <h3 className="font-bold text-lg">Address</h3>
              </div>
              <div className="ml-9">
                <p className="text-gray-600">
                  123 Diamond Street<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}