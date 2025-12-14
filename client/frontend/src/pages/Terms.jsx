// components/TermsOfService.jsx
import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
          <p className="text-gray-600 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using GemstoneStore, you accept and agree to be bound by 
              the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">2. Gemstone Purchases</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">Product Descriptions</h3>
                <p className="text-gray-700 mt-1">
                  We strive to accurately describe all gemstones. However, natural variations 
                  in color, clarity, and size may occur. All gemstones are photographed 
                  under professional lighting to best represent their true appearance.
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-gray-800">Pricing</h3>
                <p className="text-gray-700 mt-1">
                  All prices are subject to change without notice. We reserve the right 
                  to discontinue any product at any time.
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-800">Returns & Exchanges</h3>
                <p className="text-gray-700 mt-1">
                  Returns are accepted within 30 days of purchase. Gemstones must be 
                  returned in their original condition with all certificates and packaging.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              When you create an account with us, you must provide accurate and complete 
              information. You are responsible for maintaining the confidentiality of 
              your account and password.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content included on this site, such as text, graphics, logos, images, 
              and software, is the property of GemstoneStore and protected by 
              international copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              GemstoneStore shall not be liable for any indirect, incidental, special, 
              consequential or punitive damages resulting from your use of or inability 
              to use the service.
            </p>
          </section>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-8">
            <p className="text-yellow-700">
              <strong>Important:</strong> By using our website, you acknowledge that you 
              have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;