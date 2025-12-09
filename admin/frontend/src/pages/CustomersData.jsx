import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search } from 'lucide-react';

const CustomersData = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      (customer.fullName && customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Customers Data ({customers.length} customers)
        </h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Customer</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Contact</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Total Orders</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Join Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCustomers.map((customer) => (
              <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{customer.fullName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {customer._id}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{customer.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                  {customer.total_orders}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No customers found</p>
        </div>
      )}
    </div>
  );
};

export default CustomersData;