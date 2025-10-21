import React, { useState } from 'react';
import { 
  User, ShoppingBag, MapPin, CreditCard, Gift, 
  Star, Bell, Heart, LogOut, Package, HelpCircle,
  Edit2, Menu, X
} from 'lucide-react';

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar, currentPage, setCurrentPage }) => {
  const menuItems = [
    { 
      section: 'MY ORDERS', 
      icon: ShoppingBag, 
      page: 'orders',
      single: true
    },
    { 
      section: 'ACCOUNT SETTINGS',
      items: [
        { name: 'Profile Information', icon: User, page: 'profile' },
        { name: 'Manage Addresses', icon: MapPin, page: 'addresses' },
        { name: 'PAN Card Information', icon: CreditCard, page: 'pan' }
      ]
    },
    { 
      section: 'PAYMENTS',
      items: [
        { name: 'Gift Cards', icon: Gift, page: 'gift-cards', badge: '₹255' },
        { name: 'Saved UPI', icon: CreditCard, page: 'upi' },
        { name: 'Saved Cards', icon: CreditCard, page: 'cards' }
      ]
    },
    { 
      section: 'MY STUFF',
      items: [
        { name: 'My Coupons', icon: Gift, page: 'coupons' },
        { name: 'My Reviews & Ratings', icon: Star, page: 'reviews' },
        { name: 'All Notifications', icon: Bell, page: 'notifications' },
        { name: 'My Wishlist', icon: Heart, page: 'wishlist' }
      ]
    }
  ];

  const isActive = (page) => currentPage === page;

  const handleNavigation = (page) => {
    setCurrentPage(page);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-white shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                AK
              </div>
              <div>
                <p className="text-sm text-gray-500">Hello,</p>
                <p className="font-semibold text-gray-800">Amit Kumar</p>
              </div>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="py-4">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-4">
              {section.single ? (
                <button
                  onClick={() => handleNavigation(section.page)}
                  className={`flex items-center w-full px-6 py-3 transition-colors ${
                    isActive(section.page)
                      ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="w-5 h-5 mr-3" />
                  <span className="text-sm">{section.section}</span>
                </button>
              ) : (
                <>
                  <h3 className="px-6 py-2 text-xs font-semibold text-gray-500 tracking-wider">
                    {section.section}
                  </h3>
                  {section.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => handleNavigation(item.page)}
                      className={`flex items-center justify-between w-full px-6 py-3 transition-colors ${
                        isActive(item.page)
                          ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-xs font-semibold text-green-600">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Logout & Footer */}
        <div className="border-t border-gray-200 mt-4">
          <button className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
          
          <div className="px-6 py-4">
            <h4 className="text-xs font-semibold text-gray-500 mb-3">Frequently Visited:</h4>
            <button 
              onClick={() => handleNavigation('track')}
              className="flex items-center text-sm text-gray-700 hover:text-blue-600 mb-2"
            >
              <Package className="w-4 h-4 mr-2" />
              Track Order
            </button>
            <button 
              onClick={() => handleNavigation('help')}
              className="flex items-center text-sm text-gray-700 hover:text-blue-600"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help Center
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// Profile Page
const ProfilePage = () => {
  const [editing, setEditing] = useState({ personal: false, email: false, mobile: false });
  
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
          <button 
            onClick={() => setEditing({...editing, personal: !editing.personal})}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <input 
              type="text" 
              defaultValue="Amit" 
              disabled={!editing.personal}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="First Name"
            />
          </div>
          <div>
            <input 
              type="text" 
              defaultValue="Kumar" 
              disabled={!editing.personal}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">Your Gender</p>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input type="radio" name="gender" defaultChecked className="mr-2" disabled={!editing.personal} />
              <span className="text-sm">Male</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="gender" className="mr-2" disabled={!editing.personal} />
              <span className="text-sm">Female</span>
            </label>
          </div>
        </div>

        {editing.personal && (
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Save
          </button>
        )}
      </div>

      {/* Email Address */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Email Address</h2>
          <button 
            onClick={() => setEditing({...editing, email: !editing.email})}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        <input 
          type="email" 
          defaultValue="amit.kumar@example.com" 
          disabled={!editing.email}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
        />
        {editing.email && (
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Save
          </button>
        )}
      </div>

      {/* Mobile Number */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Mobile Number</h2>
          <button 
            onClick={() => setEditing({...editing, mobile: !editing.mobile})}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        <input 
          type="tel" 
          defaultValue="+91 9876543210" 
          disabled={!editing.mobile}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
        />
        {editing.mobile && (
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Save
          </button>
        )}
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">FAQs</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-800 mb-1">What happens when I update my email address or mobile number?</p>
            <p className="text-sm text-gray-600">Your login email id and mobile number will be changed. You'll receive all account related communications on your updated information.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">When will my account be updated with the new email or mobile number?</p>
            <p className="text-sm text-gray-600">It happens immediately after verification.</p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm mb-3">
          Deactivate Account
        </button>
        <br />
        <button className="text-red-600 hover:text-red-700 font-semibold text-sm">
          Delete Account
        </button>
      </div>
    </div>
  );
};

// Orders Page
const OrdersPage = () => {
  const orders = [
    {
      id: 'OD1234567890',
      date: '15 Oct 2025',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      name: 'Wireless Headphones - Premium Sound Quality',
      price: '₹2,499',
      status: 'Delivered',
      statusColor: 'green'
    },
    {
      id: 'OD9876543210',
      date: '18 Oct 2025',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      name: 'Smart Watch - Fitness Tracker',
      price: '₹4,999',
      status: 'In Transit',
      statusColor: 'blue'
    },
    {
      id: 'OD5555666677',
      date: '20 Oct 2025',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
      name: 'Designer Sunglasses - UV Protection',
      price: '₹1,799',
      status: 'Processing',
      statusColor: 'yellow'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={order.image} 
                alt={order.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">{order.name}</h3>
                <p className="text-lg font-bold text-gray-900 mb-2">{order.price}</p>
                <p className="text-sm text-gray-600 mb-1">Order ID: {order.id}</p>
                <p className="text-sm text-gray-600 mb-3">Order Date: {order.date}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                  ${order.statusColor === 'green' ? 'bg-green-100 text-green-700' : ''}
                  ${order.statusColor === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                  ${order.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' : ''}
                `}>
                  {order.status}
                </span>
              </div>
              <div className="flex flex-col justify-center space-y-2">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold">
                  Track Order
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-semibold">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Wishlist Page
const WishlistPage = () => {
  const wishlistItems = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop',
      name: 'Smart Watch Series 7',
      price: '₹5,999',
      originalPrice: '₹8,999',
      discount: '33% off'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
      name: 'Premium Sunglasses',
      price: '₹1,999',
      originalPrice: '₹3,499',
      discount: '43% off'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop',
      name: 'Running Shoes',
      price: '₹3,499',
      originalPrice: '₹5,999',
      discount: '42% off'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop',
      name: 'Laptop Backpack',
      price: '₹1,299',
      originalPrice: '₹2,499',
      discount: '48% off'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Wishlist ({wishlistItems.length} items)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-64 object-cover"
              />
              <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-gray-900">{item.price}</span>
                <span className="text-sm text-gray-500 line-through">{item.originalPrice}</span>
                <span className="text-sm text-green-600 font-semibold">{item.discount}</span>
              </div>
              <button className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors font-semibold text-sm">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Addresses Page
const AddressesPage = () => {
  const addresses = [
    {
      id: 1,
      name: 'Amit Kumar',
      type: 'Home',
      address: '123, MG Road, Bangalore, Karnataka',
      pincode: '560001',
      phone: '+91 9876543210',
      isDefault: true
    },
    {
      id: 2,
      name: 'Amit Kumar',
      type: 'Work',
      address: '456, Tech Park, Electronic City, Bangalore',
      pincode: '560100',
      phone: '+91 9876543210',
      isDefault: false
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Addresses</h1>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold">
          + Add New Address
        </button>
      </div>
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-800">{addr.name}</h3>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                    {addr.type}
                  </span>
                  {addr.isDefault && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-semibold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-1">{addr.address}</p>
                <p className="text-gray-600 mb-1">Pincode: {addr.pincode}</p>
                <p className="text-gray-600">Phone: {addr.phone}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-700 font-semibold text-sm">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Default/Placeholder Page
const PlaceholderPage = ({ title }) => (
  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
    <div className="max-w-md mx-auto">
      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">This section is under development.</p>
    </div>
  </div>
);

// Main App Component
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('profile');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderPage = () => {
    switch(currentPage) {
      case 'profile':
        return <ProfilePage />;
      case 'orders':
        return <OrdersPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'addresses':
        return <AddressesPage />;
      case 'pan':
        return <PlaceholderPage title="PAN Card Information" />;
      case 'gift-cards':
        return <PlaceholderPage title="Gift Cards" />;
      case 'upi':
        return <PlaceholderPage title="Saved UPI" />;
      case 'cards':
        return <PlaceholderPage title="Saved Cards" />;
      case 'coupons':
        return <PlaceholderPage title="My Coupons" />;
      case 'reviews':
        return <PlaceholderPage title="My Reviews & Ratings" />;
      case 'notifications':
        return <PlaceholderPage title="All Notifications" />;
      case 'track':
        return <PlaceholderPage title="Track Order" />;
      case 'help':
        return <PlaceholderPage title="Help Center" />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0 z-30">
        <button onClick={toggleSidebar}>
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-semibold">My Account</h1>
        <div className="w-6" />
      </header>

      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 lg:ml-0 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;