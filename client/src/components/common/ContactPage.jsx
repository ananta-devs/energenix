import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

export default function ContactPage() {
  const { user, showToast } = useAuth();
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
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/contact', formData, {
        headers: {
          'x-auth-token': token,
        },
      });
      console.log(res.data);
      showToast('Message sent successfully!', 'success');
      setFormData({
        ...formData,
        message: '',
      });
    } catch (err) {
      console.error(err);
      showToast('Failed to send message. Please try again later.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!!user}
                    className="px-4 py-3 border rounded-lg outline-none focus:border-blue-950"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!!user}
                    className="px-4 py-3 border rounded-lg outline-none focus:border-blue-950"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!user}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:border-blue-950"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!!user}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:border-blue-950"
                  />
                </div>
                
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:border-blue-950 resize-none"
                ></textarea>
                <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:text-amber-300 transition cursor-pointer">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-8 h-8 text-blue-800 mb-3" />
                <h3 className="font-bold mb-2">Email</h3>
              </div>
              <div className="ml-5">
                <p className="text-gray-600">info@luxegems.com</p>
                <p className="mb-3  text-gray-600">support@luxegems.com</p>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-8 h-8 text-blue-800 mb-3" />
                <h3 className="font-bold mb-2">Phone</h3>
              </div>
              <div className="ml-5">
                <p className="text-gray-600">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500 mt-1">Mon-Fri: 9AM-6PM EST</p>
              </div>

            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-8 h-8 text-blue-800 mb-3" />
                <h3 className="font-bold mb-2">Address</h3>
              </div>

              <p className="ml-5 text-gray-600">
                123 Diamond Street<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
