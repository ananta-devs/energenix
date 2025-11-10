// components/DataDisplay/CustomersData.jsx
import React, { useState, useEffect } from 'react';
import { Users, Search, Crown, Award, Star, UserCheck } from 'lucide-react';
import { dataService } from '../../utils/dataService';

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
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      const data = await dataService.getCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLoyaltyIcon = (level) => {
    switch (level) {
      case 'Gold':
        return <Crown size={16} className="text-yellow-500" />;
      case 'Silver':
        return <Award size={16} className="text-gray-400" />;
      case 'Bronze':
        return <Star size={16} className="text-orange-500" />;
      default:
        return <UserCheck size={16} className="text-blue-500" />;
    }
  };

  const getLoyaltyColor = (level) => {
    switch (level) {
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Silver':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'Bronze':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading customers...</div>;
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
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Total Spent</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Loyalty</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Join Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {customer.id}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{customer.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                  {customer.totalOrders}
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  ${customer.totalSpent.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {getLoyaltyIcon(customer.loyaltyLevel)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLoyaltyColor(customer.loyaltyLevel)}`}>
                      {customer.loyaltyLevel}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                  {new Date(customer.joinDate).toLocaleDateString()}
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