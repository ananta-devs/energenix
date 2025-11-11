// components/DataDisplay/InventoryData.jsx
import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, CheckCircle, XCircle, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { dataService } from '../utils/dataService';

const InventoryData = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const loadInventory = async () => {
    try {
      const data = await dataService.getInventory();
      setInventory(data);
      setFilteredInventory(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'adequate':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'low_stock':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'out_of_stock':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'adequate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStockStatus = (currentStock, minimumStock) => {
    const percentage = (currentStock / minimumStock) * 100;
    if (currentStock === 0) return { text: 'Out of Stock', color: 'text-red-600', icon: <TrendingDown size={14} /> };
    if (currentStock <= minimumStock) return { text: 'Low Stock', color: 'text-yellow-600', icon: <AlertCircle size={14} /> };
    if (percentage <= 150) return { text: 'Adequate', color: 'text-blue-600', icon: <CheckCircle size={14} /> };
    return { text: 'Well Stocked', color: 'text-green-600', icon: <TrendingUp size={14} /> };
  };

  const calculateStockPercentage = (currentStock, minimumStock) => {
    return Math.min((currentStock / minimumStock) * 100, 100);
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

  // Calculate summary statistics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.status === 'low_stock').length;
  const outOfStockItems = inventory.filter(item => item.status === 'out_of_stock').length;
  const adequateStockItems = inventory.filter(item => item.status === 'adequate').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Inventory Tracking ({inventory.length} items)
        </h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
            </div>
            <Package className="text-gray-400" size={24} />
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Adequate Stock</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{adequateStockItems}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{lowStockItems}</p>
            </div>
            <AlertCircle className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Out of Stock</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{outOfStockItems}</p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Product</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Current Stock</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Minimum Stock</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Reorder Level</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Stock Level</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Last Restocked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item.currentStock, item.minimumStock);
              const stockPercentage = calculateStockPercentage(item.currentStock, item.minimumStock);
              
              return (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.productName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {item.productId}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-semibold ${
                        item.currentStock === 0 ? 'text-red-600' : 
                        item.currentStock <= item.minimumStock ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {item.currentStock}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {item.minimumStock}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {item.reorderLevel}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          stockPercentage <= 25 ? 'bg-red-500' :
                          stockPercentage <= 50 ? 'bg-yellow-500' :
                          stockPercentage <= 75 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${stockPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      {stockStatus.icon}
                      <span className={`text-xs ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : 'Never'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No inventory items found</p>
        </div>
      )}
    </div>
  );
};

export default InventoryData;