import React from 'react';

const DashboardFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-6 text-sm">
          <a href="#" className="text-gray-600 hover:text-gray-900 underline">
            Refund policy
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 underline">
            Shipping
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 underline">
            Privacy policy
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 underline">
            Terms of service
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 underline">
            Contact information
          </a>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;