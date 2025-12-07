// components/CookiePolicy.jsx
import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Cookie Policy</h1>
          <p className="text-gray-600 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">What Are Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device 
              when you visit our website. They help us provide you with a better experience 
              and understand how you use our gemstone store.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">How We Use Cookies</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="py-3 px-4 border-b text-left font-semibold text-purple-700">Cookie Type</th>
                    <th className="py-3 px-4 border-b text-left font-semibold text-purple-700">Purpose</th>
                    <th className="py-3 px-4 border-b text-left font-semibold text-purple-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b font-medium">Essential Cookies</td>
                    <td className="py-3 px-4 border-b">Enable basic functions like page navigation</td>
                    <td className="py-3 px-4 border-b">Session</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b font-medium">Preference Cookies</td>
                    <td className="py-3 px-4 border-b">Remember your settings and preferences</td>
                    <td className="py-3 px-4 border-b">1 Year</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b font-medium">Analytical Cookies</td>
                    <td className="py-3 px-4 border-b">Help us understand how visitors interact</td>
                    <td className="py-3 px-4 border-b">2 Years</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b font-medium">Marketing Cookies</td>
                    <td className="py-3 px-4 border-b">Track visitors across websites</td>
                    <td className="py-3 px-4 border-b">90 Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">Managing Cookies</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Browser Settings</h3>
              <p className="text-gray-700 mb-4">
                Most web browsers allow you to control cookies through their settings preferences. 
                However, limiting cookies may affect your experience on our website.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Chrome</h4>
                  <p>Settings → Privacy and security → Cookies and other site data</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Firefox</h4>
                  <p>Options → Privacy & Security → Cookies and Site Data</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Safari</h4>
                  <p>Preferences → Privacy → Cookies and website data</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Edge</h4>
                  <p>Settings → Cookies and site permissions → Cookies and site data</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">Your Choices</h2>
            <p className="text-gray-700 leading-relaxed">
              When you first visit our gemstone store, you will be presented with a cookie 
              banner where you can choose which types of cookies you accept. You can update 
              your preferences at any time by clicking the "Cookie Settings" link in the footer.
            </p>
          </section>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 mt-8">
            <p className="text-green-700">
              <strong>Need Help?</strong> If you have any questions about our use of cookies, 
              please contact us at privacy@gemstonestore.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;