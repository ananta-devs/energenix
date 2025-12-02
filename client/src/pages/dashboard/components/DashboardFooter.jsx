import React, { useState } from 'react';

// Custom Modal Component
const PolicyModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Individual Content Components for better customization
const RefundPolicyContent = () => (
  <div className="space-y-4 text-gray-700">
    <p className="font-semibold text-lg text-gray-900">30-Day Money Back Guarantee</p>
    <p>We stand behind our products and offer a full 30-day refund policy for all purchases.</p>
    
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
      <p className="text-sm text-yellow-700">
        <strong>Note:</strong> Refunds are processed within 5-7 business days after we receive the returned items.
      </p>
    </div>

    <ul className="list-disc list-inside space-y-2 ml-4">
      <li>Items must be in original condition with tags attached</li>
      <li>Shipping costs are non-refundable</li>
      <li>Digital products may have different refund conditions</li>
      <li>Sale items are final and cannot be refunded</li>
    </ul>

    <p className="text-sm text-gray-600 mt-6">
      For refund requests, please contact our support team with your order number and reason for return.
    </p>
  </div>
);

const ShippingContent = () => (
  <div className="space-y-6 text-gray-700">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Standard Shipping</h3>
        <p className="text-sm">3-5 business days</p>
        <p className="text-lg font-bold text-blue-700">Free on orders over $50</p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">Express Shipping</h3>
        <p className="text-sm">1-2 business days</p>
        <p className="text-lg font-bold text-green-700">$9.99</p>
      </div>
    </div>

    <div className="border-t pt-4">
      <h4 className="font-semibold text-gray-900 mb-3">International Shipping</h4>
      <ul className="space-y-2 text-sm">
        <li>• Canada: 7-10 business days - $14.99</li>
        <li>• Europe: 10-14 business days - $19.99</li>
        <li>• Asia: 12-16 business days - $24.99</li>
      </ul>
    </div>

    <p className="text-xs text-gray-500">
      * Delivery times may vary during holiday seasons and peak periods.
    </p>
  </div>
);

const PrivacyPolicyContent = () => (
  <div className="space-y-4 text-gray-700">
    <p className="font-semibold text-gray-900">Your Privacy Matters</p>
    
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-2">Information We Collect</h4>
      <ul className="list-disc list-inside space-y-1 text-sm ml-4">
        <li>Personal identification information</li>
        <li>Payment and billing details</li>
        <li>Browser and device information</li>
        <li>Usage data and preferences</li>
      </ul>
    </div>

    <div className="bg-green-50 p-4 rounded-lg">
      <h4 className="font-medium text-green-900 mb-2">How We Use Your Data</h4>
      <p className="text-sm text-green-800">
        We use your information solely to process orders, improve our services, 
        and provide you with a personalized shopping experience. We never sell 
        your data to third parties.
      </p>
    </div>

    <p className="text-sm text-gray-600">
      For more details about our privacy practices or to exercise your data rights, 
      please review our full privacy policy or contact our data protection officer.
    </p>
  </div>
);

const TermsOfServiceContent = () => (
  <div className="space-y-4 text-gray-700">
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <p className="text-red-700 font-medium">
        Please read these terms carefully before using our service.
      </p>
    </div>

    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900">Account Responsibilities</h4>
      <p className="text-sm">
        You are responsible for maintaining the confidentiality of your account 
        and password and for restricting access to your computer.
      </p>
    </div>

    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900">Product Information</h4>
      <p className="text-sm">
        We strive to display accurate product information, but we do not warrant 
        that product descriptions or other content is accurate, complete, or error-free.
      </p>
    </div>

    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900">Limitation of Liability</h4>
      <p className="text-sm">
        Our company shall not be liable for any indirect, incidental, special, 
        consequential or punitive damages resulting from your use of our services.
      </p>
    </div>

    <p className="text-xs text-gray-500 mt-6">
      Last updated: January 2024
    </p>
  </div>
);

const ContactInformationContent = () => (
  <div className="space-y-6 text-gray-700">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Customer Support</h3>
          <p className="text-blue-700">support@yourcompany.com</p>
          <p className="text-blue-700">+1 (555) 123-4567</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Sales Inquiries</h3>
          <p className="text-green-700">sales@yourcompany.com</p>
          <p className="text-green-700">+1 (555) 123-4568</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">Business Hours</h3>
          <p className="text-sm text-purple-700">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
          <p className="text-sm text-purple-700">Saturday: 10:00 AM - 4:00 PM EST</p>
          <p className="text-sm text-purple-700">Sunday: Closed</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-semibold text-orange-900 mb-2">Headquarters</h3>
          <p className="text-sm text-orange-700">
            123 Business Avenue<br />
            Suite 100<br />
            New York, NY 10001<br />
            United States
          </p>
        </div>
      </div>
    </div>

    <p className="text-center text-sm text-gray-500">
      We typically respond to all inquiries within 24 hours during business days.
    </p>
  </div>
);

const DashboardFooter = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const modalConfig = {
    refund: {
      title: "Refund Policy",
      component: <RefundPolicyContent />
    },
    shipping: {
      title: "Shipping Information", 
      component: <ShippingContent />
    },
    privacy: {
      title: "Privacy Policy",
      component: <PrivacyPolicyContent />
    },
    terms: {
      title: "Terms of Service",
      component: <TermsOfServiceContent />
    },
    contact: {
      title: "Contact Information",
      component: <ContactInformationContent />
    }
  };

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <p 
              className="text-gray-600 hover:text-gray-900 underline cursor-pointer transition-colors"
              onClick={() => openModal('refund')}
            >
              Refund policy
            </p>
            <p 
              className="text-gray-600 hover:text-gray-900 underline cursor-pointer transition-colors"
              onClick={() => openModal('shipping')}
            >
              Shipping
            </p>
            <p 
              className="text-gray-600 hover:text-gray-900 underline cursor-pointer transition-colors"
              onClick={() => openModal('privacy')}
            >
              Privacy policy
            </p>
            <p 
              className="text-gray-600 hover:text-gray-900 underline cursor-pointer transition-colors"
              onClick={() => openModal('terms')}
            >
              Terms of service
            </p>
            <p 
              className="text-gray-600 hover:text-gray-900 underline cursor-pointer transition-colors"
              onClick={() => openModal('contact')}
            >
              Contact information
            </p>
          </div>
        </div>
      </footer>

      <PolicyModal
        isOpen={activeModal !== null}
        onClose={closeModal}
        title={activeModal ? modalConfig[activeModal].title : ''}
      >
        {activeModal && modalConfig[activeModal].component}
      </PolicyModal>
    </>
  );
};

export default DashboardFooter;