import React, { useState } from 'react';

// Custom Modal Component
const PolicyModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center z-50 justify-center p-4">
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

// Individual Content Components for EnergeniX
const ShippingPolicyContent = () => (
  <div className="space-y-6 text-gray-700">
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
      <p className="text-blue-700">
        At EnergeniX, we are committed to delivering your orders safely, securely, 
        and within the shortest possible time while maintaining premium packaging standards.
      </p>
    </div>

    <div className="space-y-4">
      <div className="border-l-4 border-purple-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">Order Processing & Dispatch</h3>
        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
          <li>All online prepaid orders are processed and dispatched within 1–2 working days after order confirmation</li>
          <li>Orders are shipped Monday to Saturday, excluding Sundays and public holidays</li>
          <li>Payments are securely processed through Razorpay</li>
        </ul>
      </div>

      <div className="border-l-4 border-green-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">Delivery Timeline</h3>
        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
          <li><strong>Non-customized products:</strong> 5–7 working days from dispatch</li>
          <li><strong>Customized products:</strong> 5–9 working days from dispatch</li>
          <li>Delivery timelines may vary based on location and courier</li>
        </ul>
      </div>

      <div className="border-l-4 border-orange-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">Shipping Partner & Charges</h3>
        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
          <li>Shipments handled through Shipmozo with reputed courier services</li>
          <li>Free shipping across India on all prepaid orders</li>
          <li>All prices inclusive of applicable GST</li>
        </ul>
      </div>

      <div className="border-l-4 border-red-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">Damaged or Tampered Packages</h3>
        <p className="text-sm mb-2">If you receive a package that appears tampered with or damaged:</p>
        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
          <li>Do not accept the delivery</li>
          <li>Contact us immediately with your Order ID</li>
          <li>We will arrange a replacement at no additional cost</li>
        </ul>
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg mt-4">
      <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
      <p className="text-sm text-gray-700">📧 Email: energenix.official@gmail.com</p>
      <p className="text-sm text-gray-700">📞 Phone / WhatsApp: +91 94761 56308</p>
      <p className="text-sm text-gray-700">🕒 Support Hours: Mon–Sat | 10:00 AM – 6:00 PM</p>
      <p className="text-sm text-gray-700">📦 Shipping Partner: Shipmozo</p>
      <p className="text-sm text-gray-700">💳 Payment Gateway: Razorpay</p>
    </div>
  </div>
);

const RefundPolicyContent = () => (
  <div className="space-y-6 text-gray-700">
    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4 rounded">
      <p className="text-purple-700">
        This Refund, Cancellation & Replacement Policy ("Policy") forms an integral part of 
        the Terms and Conditions of EnergeniX. By placing an order, you agree to be bound by this Policy.
      </p>
    </div>

    <div className="space-y-4">
      <div className="border-l-4 border-yellow-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">1. Nature of Products</h3>
        <p className="text-sm">
          EnergeniX deals in authentic spiritual and religious products rooted in Hindu culture 
          and tradition. Due to the sacred, personal, and sensitive nature of these products, 
          all sales are considered final.
        </p>
      </div>

      <div className="border-l-4 border-green-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">2. Order Cancellation</h3>
        <p className="text-sm mb-2"><strong>2.1 Customer-Initiated Cancellation:</strong></p>
        <p className="text-sm ml-4">• Orders may be cancelled within 1 hour of successful order placement</p>
        <p className="text-sm ml-4">• Requests after 1 hour not accepted under any circumstances</p>
        
        <p className="text-sm mt-3 mb-2"><strong>2.2 Cancellation Charges:</strong></p>
        <p className="text-sm ml-4">• No charges for cancellations within 1-hour window</p>
        <p className="text-sm ml-4">• Full refund if EnergeniX cancels the order</p>
      </div>

      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <h3 className="font-semibold text-red-700 mb-2">3. Refund & Replacement Eligibility</h3>
        <p className="text-red-700 mb-2">
          EnergeniX follows a replacement-only policy. Refunds are not provided except where legally mandated.
        </p>
        
        <p className="text-sm mb-2"><strong>3.1 Eligible Grounds for Replacement:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
          <li>Product received in damaged condition</li>
          <li>Manufacturing defect</li>
          <li>Incorrect product delivered</li>
        </ul>

        <p className="text-sm mt-3 mb-2"><strong>3.2 Mandatory Proof:</strong></p>
        <p className="text-sm ml-4">• Notify within 1 day of receiving the product</p>
        <p className="text-sm ml-4">• Clear unboxing video and photographic evidence required</p>
      </div>

      <div className="border-l-4 border-gray-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">4. Non-Eligible Cases</h3>
        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
          <li>Size-related issues</li>
          <li>Dissatisfaction with quality, appearance, or personal expectations</li>
          <li>Change of mind or personal preference</li>
          <li>Products damaged, altered, or washed by the customer</li>
          <li>Products not returned in original packaging</li>
        </ul>
      </div>

      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">5. Replacement Process (Size Exchange Only)</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
          <li>Initiate request within 1 day of delivery</li>
          <li>Return unused product in original packaging</li>
          <li>Product undergoes inspection and verification</li>
          <li>₹200 non-refundable replacement handling fee payable</li>
          <li>Replacement dispatched after fee receipt</li>
        </ol>
      </div>
    </div>

    <div className="bg-yellow-50 p-4 rounded-lg mt-4">
      <p className="text-yellow-700 text-sm">
        <strong>Important:</strong> By placing an order with EnergeniX, you acknowledge that you have read, 
        understood, and agreed to this Refund, Cancellation & Replacement Policy.
      </p>
    </div>
  </div>
);

const PrivacyPolicyContent = () => (
  <div className="space-y-6 text-gray-700">
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
      <p className="text-blue-700">
        At EnergeniX, we respect your privacy and are committed to protecting your personal information. 
        This Privacy Policy explains how we collect, use, store, share, and safeguard your data.
      </p>
    </div>

    <div className="space-y-4">
      <div className="border-l-4 border-purple-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">1. Information We Collect</h3>
        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
          <li>Name, mobile number, email address</li>
          <li>Shipping and billing address</li>
          <li>Order details and transaction history</li>
          <li>Customer support communications</li>
        </ul>
        <div className="bg-yellow-50 p-3 mt-2 rounded">
          <p className="text-yellow-700 text-xs">
            ⚠️ Payment information processed through Razorpay. We do not store debit card, 
            credit card, or UPI details.
          </p>
        </div>
      </div>

      <div className="border-l-4 border-green-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">2. Use of Personal Information</h3>
        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
          <li>Order processing and fulfillment</li>
          <li>Payment processing</li>
          <li>Shipping and delivery via Shipmozo</li>
          <li>Customer support and communication</li>
          <li>Legal, regulatory, and security compliance</li>
        </ul>
      </div>

      <div className="border-l-4 border-red-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">3. Third-Party Disclosure</h3>
        <p className="text-sm mb-2">We may share data with trusted third parties including:</p>
        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
          <li>Razorpay (payment processing)</li>
          <li>Shipmozo (shipping and logistics)</li>
          <li>Courier partners and legal authorities (where required by law)</li>
        </ul>
      </div>

      <div className="border-l-4 border-orange-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">4. Grievance Redressal</h3>
        <p className="text-sm mb-1"><strong>Grievance Officer:</strong> Dipanwita Hazra</p>
        <p className="text-sm">📧 Email: energenix.official@gmail.com</p>
        <p className="text-sm">📞 Phone / WhatsApp: +91 94761 56308</p>
        <p className="text-sm">🕒 Support Hours: Monday – Saturday | 10:00 AM – 6:00 PM</p>
        <p className="text-xs text-gray-600 mt-2">
          All grievances will be acknowledged and resolved within 30 days from receipt.
        </p>
      </div>
    </div>
  </div>
);

const TermsOfServiceContent = () => (
  <div className="space-y-6 text-gray-700">
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded">
      <p className="text-red-700 font-medium">
        Please read these terms carefully before using our service.
      </p>
    </div>

    <div className="space-y-4">
      <div className="border-l-4 border-purple-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
        <p className="text-sm">
          We strive to accurately describe all spiritual products. However, natural variations 
          may occur in handcrafted items. All products are photographed under professional 
          lighting to best represent their true appearance.
        </p>
      </div>

      <div className="border-l-4 border-green-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">Pricing & Availability</h3>
        <p className="text-sm">
          All prices are subject to change without notice. We reserve the right to discontinue 
          any product at any time. All prices are inclusive of GST.
        </p>
      </div>

      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">User Accounts</h3>
        <p className="text-sm">
          When you create an account with us, you must provide accurate and complete information. 
          You are responsible for maintaining the confidentiality of your account and password.
        </p>
      </div>

      <div className="border-l-4 border-orange-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">Intellectual Property</h3>
        <p className="text-sm">
          All content included on this site, such as text, graphics, logos, images, and product 
          descriptions, is the property of EnergeniX and protected by applicable copyright laws.
        </p>
      </div>

      <div className="border-l-4 border-red-500 pl-4">
        <h3 className="font-semibold text-gray-900 mb-2">Limitation of Liability</h3>
        <p className="text-sm">
          EnergeniX shall not be liable for any indirect, incidental, special, consequential or 
          punitive damages resulting from your use of or inability to use the service.
        </p>
      </div>
    </div>

    <div className="bg-yellow-50 p-4 rounded-lg mt-4">
      <p className="text-yellow-700 text-sm">
        <strong>Governing Law:</strong> These terms shall be governed by and construed in 
        accordance with the laws of India.
      </p>
    </div>
  </div>
);

const ContactInformationContent = () => (
  <div className="space-y-6 text-gray-700">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Customer Support</h3>
          <p className="text-blue-700">energenix.help@gmail.com</p>
          <p className="text-blue-700">+91 94761 56308</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Official Contact</h3>
          <p className="text-green-700">energenix.official@gmail.com</p>
          <p className="text-green-700">+91 94761 56308</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">Business Hours</h3>
          <p className="text-sm text-purple-700">Monday - Saturday: 10:00 AM - 6:00 PM IST</p>
          <p className="text-sm text-purple-700">Sunday: Closed</p>
          <p className="text-xs text-purple-600 mt-2">*Excluding public holidays</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-semibold text-orange-900 mb-2">Services & Partners</h3>
          <p className="text-sm text-orange-700">Shipping Partner: Shipmozo</p>
          <p className="text-sm text-orange-700">Payment Gateway: Razorpay</p>
        </div>
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold text-gray-900 mb-2">Grievance Officer</h4>
      <p className="text-sm text-gray-700">Name: Dipanwita Hazra</p>
      <p className="text-sm text-gray-700">Email: energenix.official@gmail.com</p>
      <p className="text-sm text-gray-700">Phone: +91 94761 56308</p>
      <p className="text-xs text-gray-600 mt-2">
        Grievances resolved within 30 days as per IT Rules compliance.
      </p>
    </div>

    <p className="text-center text-sm text-gray-500">
      We typically respond to all inquiries within 48 hours during business days.
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
    shipping: {
      title: "Shipping Policy",
      component: <ShippingPolicyContent />
    },
    refund: {
      title: "Refund, Cancellation & Replacement Policy",
      component: <RefundPolicyContent />
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
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <p 
              className="text-gray-600 hover:text-gray-900 underline cursor-pointer transition-colors"
              onClick={() => openModal('shipping')}
            >
              Shipping policy
            </p>
            <p 
              className="text-gray-600 hover:text-gray-900 underline cursor-pointer transition-colors"
              onClick={() => openModal('refund')}
            >
              Refund & cancellation
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