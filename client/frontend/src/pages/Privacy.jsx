// pages/PrivacyPolicy.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {

  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="mb-6 ml-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back to Homepage</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy – EnergeniX</h1>
          <p className="text-gray-600 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <section className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
            <p className="text-blue-700">
              At EnergeniX ("we", "us", "our"), we respect your privacy and are committed to 
              protecting your personal information. This Privacy Policy explains how we collect, 
              use, store, share, and safeguard your data when you access our website or purchase 
              our products.
            </p>
            <p className="text-blue-700 mt-2">
              By using our website, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed">
              We may collect the following personal information:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-700 ml-4">
              <li>Name, mobile number, email address</li>
              <li>Shipping and billing address</li>
              <li>Order details and transaction history</li>
              <li>Customer support communications</li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4 rounded">
              <p className="text-yellow-800">
                <strong>Note:</strong> Payment-related information is processed securely through Razorpay.
                ⚠️ We do not store your debit card, credit card, or UPI details.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">2. Use of Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Order Processing</h3>
                <p className="text-gray-700">Order processing and fulfillment</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Payment Processing</h3>
                <p className="text-gray-700">Secure payment processing</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Shipping & Delivery</h3>
                <p className="text-gray-700">Shipping and delivery via Shipmozo</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Customer Support</h3>
                <p className="text-gray-700">Customer support and communication</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">3. Consent & Withdrawal</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By providing your personal information, you consent to the collection, use, storage, 
              and processing of your data in accordance with this Privacy Policy.
            </p>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
              <p className="text-orange-800">
                <strong>Withdrawal of Consent:</strong> You may withdraw your consent at any time by contacting us. 
                Please note that withdrawal of consent may limit our ability to process orders, 
                deliver products, or provide customer support.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">4. Third-Party Disclosure</h2>
            <p className="text-gray-700 leading-relaxed">
              We may share your personal data with trusted third parties strictly for business operations, including:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-700 ml-4">
              <li>Razorpay (payment processing)</li>
              <li>Shipmozo (shipping and logistics)</li>
              <li>Courier partners and legal authorities (where required by law)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              All third parties are obligated to maintain appropriate data protection standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We take reasonable steps to protect your information, including encrypted data transmission, 
              restricted access to personal data, and periodic security reviews.
            </p>
            <div className="bg-gray-100 p-4 mt-4 rounded">
              <p className="text-gray-700">
                <strong>Disclaimer:</strong> While we strive to protect your data, no system is completely secure, 
                and absolute security cannot be guaranteed.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">6. Grievance Redressal Mechanism</h2>
            <p className="text-gray-700 leading-relaxed">
              In accordance with the Information Technology Act, 2000 and applicable rules, EnergeniX has 
              appointed a Grievance Officer to address concerns related to personal data and privacy.
            </p>
            <div className="bg-green-50 border-l-4 border-green-500 p-6 mt-4 rounded">
              <h3 className="font-semibold text-green-700 mb-2">Grievance Officer: Dipanwita Hazra</h3>
              <p className="text-gray-700">📧 Email: energenix.official@gmail.com</p>
              <p className="text-gray-700">📞 Phone / WhatsApp: +91 94761 56308</p>
              <p className="text-gray-700">🕒 Support Hours: Monday – Saturday | 10:00 AM – 6:00 PM</p>
              <p className="text-gray-700 mt-2">
                All grievances will be acknowledged and resolved within 30 days from the date of receipt.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">7. Prohibited User Conduct</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree not to upload, share, or transmit any content that violates applicable laws, 
              is defamatory, obscene, abusive, or offensive, or infringes intellectual property rights.
            </p>
            <p className="text-gray-700 mt-2">
              Violation may result in suspension or termination of access to our services.
            </p>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
            <p className="text-blue-700">
              <strong>Contact Us:</strong> For any questions, concerns, or requests regarding this Privacy Policy, please contact:<br/><br/>
              EnergeniX<br/>
              📧 Email: energenix.official@gmail.com<br/>
              📞 Phone / WhatsApp: +91 94761 56308<br/>
              🕒 Mon–Sat | 10:00 AM – 6:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;