import React, { useState, createContext, useContext, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Menu, X, Search, Bell, User, ChevronDown, Home, Package, ShoppingCart, Users, Archive, TrendingUp, Megaphone, Settings, LogOut, Plus, Edit2, Trash2, Download, Filter, Moon, Sun, Eye, AlertTriangle } from 'lucide-react';

// Theme Context
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

// App State Context
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// Mock Data
const mockData = {
  overview: {
    totalGemstones: 1247,
    orders: 342,
    revenue: 2840000,
    customers: 856,
    activeAds: 12
  },
  products: [
    { id: 1, name: 'Blue Sapphire', carat: 2.5, color: 'Deep Blue', clarity: 'VVS1', price: 125000, stock: 15, category: 'Sapphire', image: '💎' },
    { id: 2, name: 'Ruby Princess', carat: 3.2, color: 'Pigeon Blood Red', clarity: 'IF', price: 185000, stock: 8, category: 'Ruby', image: '💎' },
    { id: 3, name: 'Emerald Crown', carat: 4.1, color: 'Colombian Green', clarity: 'VS1', price: 210000, stock: 5, category: 'Emerald', image: '💎' },
    { id: 4, name: 'Pink Diamond', carat: 1.8, color: 'Fancy Pink', clarity: 'FL', price: 450000, stock: 2, category: 'Diamond', image: '💎' },
    { id: 5, name: 'Yellow Topaz', carat: 5.0, color: 'Imperial Yellow', clarity: 'VS2', price: 35000, stock: 25, category: 'Topaz', image: '💎' },
  ],
  orders: [
    { id: 1001, customer: 'Rahul Sharma', product: 'Blue Sapphire', amount: 125000, status: 'Delivered', date: '2025-10-15' },
    { id: 1002, customer: 'Priya Patel', product: 'Ruby Princess', amount: 185000, status: 'Shipped', date: '2025-10-18' },
    { id: 1003, customer: 'Amit Kumar', product: 'Emerald Crown', amount: 210000, status: 'Pending', date: '2025-10-19' },
    { id: 1004, customer: 'Sneha Gupta', product: 'Pink Diamond', amount: 450000, status: 'Pending', date: '2025-10-20' },
    { id: 1005, customer: 'Vikram Singh', product: 'Yellow Topaz', amount: 35000, status: 'Cancelled', date: '2025-10-17' },
  ],
  customers: [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', orders: 5, spent: 580000, loyalty: 'Gold' },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '+91 98765 43211', orders: 3, spent: 325000, loyalty: 'Silver' },
    { id: 3, name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 98765 43212', orders: 2, spent: 210000, loyalty: 'Bronze' },
    { id: 4, name: 'Sneha Gupta', email: 'sneha@example.com', phone: '+91 98765 43213', orders: 8, spent: 1250000, loyalty: 'Platinum' },
    { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43214', orders: 1, spent: 35000, loyalty: 'Bronze' },
  ],
  salesTrend: [
    { month: 'Apr', sales: 420000, orders: 45 },
    { month: 'May', sales: 580000, orders: 62 },
    { month: 'Jun', sales: 720000, orders: 78 },
    { month: 'Jul', sales: 650000, orders: 71 },
    { month: 'Aug', sales: 890000, orders: 95 },
    { month: 'Sep', sales: 1020000, orders: 108 },
    { month: 'Oct', sales: 850000, orders: 89 },
  ],
  topGemstones: [
    { name: 'Ruby', sold: 145 },
    { name: 'Sapphire', sold: 132 },
    { name: 'Emerald', sold: 98 },
    { name: 'Diamond', sold: 87 },
    { name: 'Topaz', sold: 76 },
  ],
  revenueByCategory: [
    { name: 'Ruby', value: 980000 },
    { name: 'Sapphire', value: 750000 },
    { name: 'Emerald', value: 620000 },
    { name: 'Diamond', value: 1200000 },
    { name: 'Topaz', value: 290000 },
  ]
};

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
    } text-white animate-slide-in`}>
      {message}
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => {
  const { overview, salesTrend } = mockData;
  const { theme } = useTheme();
  
  const stats = [
    { label: 'Total Gemstones', value: overview.totalGemstones, icon: Package, color: 'bg-blue-500' },
    { label: 'Orders', value: overview.orders, icon: ShoppingCart, color: 'bg-emerald-500' },
    { label: 'Revenue', value: `₹${(overview.revenue / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Customers', value: overview.customers, icon: Users, color: 'bg-pink-500' },
    { label: 'Active Ads', value: overview.activeAds, icon: Megaphone, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="sales" stroke="#10b981" fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Gemstones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.topGemstones}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="sold" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Products Management Component
const ProductsManagement = () => {
  const [products, setProducts] = useState(mockData.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useApp();

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    showToast('Product deleted successfully');
  };

  const exportCSV = () => {
    const csv = [
      ['ID', 'Name', 'Carat', 'Color', 'Clarity', 'Price', 'Stock', 'Category'],
      ...products.map(p => [p.id, p.name, p.carat, p.color, p.clarity, p.price, p.stock, p.category])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    showToast('Products exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products Management</h1>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Download size={18} />
            Export CSV
          </button>
          <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-4">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Product</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Carat</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Color</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Clarity</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Price</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Stock</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.image}</span>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{product.carat}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{product.color}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{product.clarity}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">₹{product.price.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Orders Management Component
const OrdersManagement = () => {
  const [orders] = useState(mockData.orders);
  const [filterStatus, setFilterStatus] = useState('All');
  const { showToast } = useApp();

  const filteredOrders = filterStatus === 'All' ? orders : orders.filter(o => o.status === filterStatus);

  const getStatusColor = (status) => {
    const colors = {
      'Delivered': 'bg-green-100 text-green-700',
      'Shipped': 'bg-blue-100 text-blue-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const exportCSV = () => {
    const csv = [
      ['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'],
      ...orders.map(o => [o.id, o.customer, o.product, o.amount, o.status, o.date])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    showToast('Orders exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Order ID</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Product</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">#{order.id}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{order.customer}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{order.product}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">₹{order.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{order.date}</td>
                  <td className="py-3 px-4">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Customers Management Component
const CustomersManagement = () => {
  const [customers] = useState(mockData.customers);
  const { showToast } = useApp();

  const getLoyaltyColor = (loyalty) => {
    const colors = {
      'Platinum': 'bg-purple-100 text-purple-700',
      'Gold': 'bg-yellow-100 text-yellow-700',
      'Silver': 'bg-gray-100 text-gray-700',
      'Bronze': 'bg-orange-100 text-orange-700'
    };
    return colors[loyalty] || 'bg-gray-100 text-gray-700';
  };

  const exportCSV = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Loyalty'],
      ...customers.map(c => [c.id, c.name, c.email, c.phone, c.orders, c.spent, c.loyalty])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    showToast('Customers exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers Management</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Contact</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Orders</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Total Spent</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Loyalty</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{customer.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{customer.orders}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">₹{customer.spent.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLoyaltyColor(customer.loyalty)}`}>
                      {customer.loyalty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reports Analytics Component
const ReportsAnalytics = () => {
  const { theme } = useTheme();
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Monthly Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData.salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockData.revenueByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {mockData.revenueByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Orders vs Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData.salesTrend}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="orders" stroke="#10b981" fillOpacity={1} fill="url(#colorOrders)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Inventory Tracking Component
const InventoryTracking = () => {
  const [products] = useState(mockData.products);
  const lowStockItems = products.filter(p => p.stock < 10);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Tracking</h1>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle size={20} />
            <span className="font-semibold">Low Stock Alert: {lowStockItems.length} items need restocking</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
              </div>
              <span className="text-3xl">{product.image}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Stock:</span>
                <span className={`font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                  {product.stock} units
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min((product.stock / 30) * 100, 100)}%` }}
                />
              </div>
              {product.stock < 10 && (
                <div className="text-xs text-red-500 dark:text-red-400">Restock recommended</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Settings Component
const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@gemstone.com',
    phone: '+91 98765 43210',
    notifications: true,
    emailAlerts: true
  });

  const handleSave = () => {
    showToast('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
              <button
                onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Email Alerts</span>
              <button
                onClick={() => setFormData({ ...formData, emailAlerts: !formData.emailAlerts })}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.emailAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
        Save Changes
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedTheme = 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Archive },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardOverview />;
      case 'products': return <ProductsManagement />;
      case 'orders': return <OrdersManagement />;
      case 'customers': return <CustomersManagement />;
      case 'inventory': return <InventoryTracking />;
      case 'reports': return <ReportsAnalytics />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AppContext.Provider value={{ showToast }}>
        <div className={theme === 'dark' ? 'dark' : ''}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64 bg-gradient-to-b from-emerald-600 to-blue-600 dark:from-emerald-800 dark:to-blue-800`}>
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-white/20">
                  <h1 className="text-2xl font-bold text-white">💎 GemAdmin</h1>
                  <p className="text-emerald-100 text-sm">Gemstone Dashboard</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        currentPage === item.id
                          ? 'bg-white/20 text-white'
                          : 'text-emerald-100 hover:bg-white/10'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="p-4 border-t border-white/20">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-emerald-100 hover:bg-white/10 rounded-lg transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all ${sidebarOpen ? 'lg:ml-64' : ''}`}>
              {/* Top Navbar */}
              <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between px-4 py-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>

                  <div className="flex items-center gap-2 flex-1 max-w-md mx-4">
                    <Search size={20} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleTheme}
                      className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                      <Bell size={20} />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <User size={20} />
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              </header>

              {/* Page Content */}
              <main className="p-6">
                {renderPage()}
              </main>
            </div>

            {/* Toast Notification */}
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}

            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </div>
        </div>
      </AppContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;