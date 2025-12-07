// components/PrivacyPolicy.jsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed">
              At GemstoneStore, we collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-700 ml-4">
              <li>Personal identification information (Name, email address, phone number)</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely through our payment partners)</li>
              <li>Communication preferences</li>
              <li>Purchase history and browsing behavior</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">2. How We Use Your Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Order Processing</h3>
                <p className="text-gray-700">To process and fulfill your gemstone purchases</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Customer Support</h3>
                <p className="text-gray-700">To provide personalized assistance and service</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Marketing</h3>
                <p className="text-gray-700">To send updates about new gemstone collections</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Improvements</h3>
                <p className="text-gray-700">To enhance your shopping experience</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">3. Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement robust security measures to protect your personal information. 
              All transactions are encrypted using SSL technology, and we regularly monitor 
              our systems for possible vulnerabilities and attacks.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">4. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              You have the right to access, correct, or delete your personal data. 
              Contact us at privacy@gemstonestore.com to exercise these rights.
            </p>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
            <p className="text-blue-700">
              <strong>Contact Us:</strong> If you have any questions about this Privacy Policy, 
              please contact us at privacy@gemstonestore.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;