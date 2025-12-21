// components/DataDisplay/InventoryData.jsx
import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, CheckCircle, XCircle, Search, TrendingDown, X } from 'lucide-react';
import { dataService } from '../utils/dataService';

const MINIMUM_STOCK_THRESHOLD = 5; // Define a threshold for low stock

const InventoryData = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showDepleteModal, setShowDepleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [depleteQuantity, setDepleteQuantity] = useState('');
  const [restockLoading, setRestockLoading] = useState(false);
  const [depleteLoading, setDepleteLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [depleteMessage, setDepleteMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      (item.product_id?.p_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (getStockStatus(item.current_stock).text || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const loadInventory = async () => {
    try {
      const data = await dataService.getInventory();
      setInventory(data);
      setFilteredInventory(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load inventory data' });
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (currentStock) => {
    if (currentStock === 0) return { text: 'Out of Stock', color: 'text-red-600', icon: <TrendingDown size={14} className='dark:text-red-500'/> };
    if (currentStock <= MINIMUM_STOCK_THRESHOLD) return { text: 'Low Stock', color: 'text-yellow-600', icon: <AlertCircle size={14} className='dark:text-white'/> };
    return { text: 'Adequate', color: 'text-green-600', icon: <CheckCircle size={14} className='dark:text-green-400'/> };
  };

  const calculateStockPercentage = (currentStock) => {
    const maxStockForPercentage = Math.max(currentStock, MINIMUM_STOCK_THRESHOLD * 2);
    return Math.min((currentStock / maxStockForPercentage) * 100, 100);
  };

  const openRestockModal = (item) => {
    setSelectedItem(item);
    setRestockQuantity('');
    setMessage({ type: '', text: '' });
    setShowRestockModal(true);
  };

  const closeRestockModal = () => {
    setShowRestockModal(false);
    setSelectedItem(null);
    setRestockQuantity('');
    setMessage({ type: '', text: '' });
  };

  const openDepleteModal = (item) => {
    setSelectedItem(item);
    setDepleteQuantity('');
    setDepleteMessage({ type: '', text: '' });
    setShowDepleteModal(true);
  };

  const closeDepleteModal = () => {
    setShowDepleteModal(false);
    setSelectedItem(null);
    setDepleteQuantity('');
    setDepleteMessage({ type: '', text: '' });
  };

  const handleRestock = async () => {
    if (!selectedItem || !restockQuantity || parseInt(restockQuantity) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid quantity' });
      return;
    }

    setRestockLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const newCurrentStock = selectedItem.current_stock + parseInt(restockQuantity);
      const newTotalStock = selectedItem.total_stock + parseInt(restockQuantity);
      const restockDate = new Date().toISOString();

      const updatedItem = await dataService.updateInventory(selectedItem._id, {
        current_stock: newCurrentStock,
        total_stock: newTotalStock,
        last_restocked: restockDate,
      });
      
      const updatedInventory = inventory.map(item =>
        item._id === updatedItem._id ? updatedItem : item
      );

      setInventory(updatedInventory);
      setMessage({ 
        type: 'success', 
        text: `Successfully restocked ${restockQuantity} units of ${selectedItem.product_id?.p_name}` 
      });

      // Auto-close modal after success
      setTimeout(() => {
        closeRestockModal();
      }, 2000);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to restock product. Please try again.' 
      });
    } finally {
      setRestockLoading(false);
    }
  };

  const handleDeplete = async () => {
    if (!selectedItem || !depleteQuantity || parseInt(depleteQuantity) <= 0) {
      setDepleteMessage({ type: 'error', text: 'Please enter a valid quantity' });
      return;
    }

    const depleteValue = parseInt(depleteQuantity);
    if (depleteValue > selectedItem.current_stock) {
      setDepleteMessage({ 
        type: 'error', 
        text: `Cannot deplete more than current stock (${selectedItem.current_stock} units available)` 
      });
      return;
    }

    setDepleteLoading(true);
    setDepleteMessage({ type: '', text: '' });

    try {
      const newCurrentStock = selectedItem.current_stock - depleteValue;
      const newSoldStock = selectedItem.sold_stock + depleteValue;
      const depleteDate = new Date().toISOString();

      const updatedItem = await dataService.updateInventory(selectedItem._id, {
        current_stock: newCurrentStock,
        sold_stock: newSoldStock,
        last_restocked: depleteDate, // You might want to rename this field or create a separate field for last_depleted
      });
      
      const updatedInventory = inventory.map(item =>
        item._id === updatedItem._id ? updatedItem : item
      );

      setInventory(updatedInventory);
      setDepleteMessage({ 
        type: 'success', 
        text: `Successfully depleted ${depleteQuantity} units of ${selectedItem.product_id?.p_name}` 
      });

      // Auto-close modal after success
      setTimeout(() => {
        closeDepleteModal();
      }, 2000);

    } catch (error) {
      setDepleteMessage({ 
        type: 'error', 
        text: 'Failed to deplete inventory. Please try again.' 
      });
    } finally {
      setDepleteLoading(false);
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

  // Calculate summary statistics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => getStockStatus(item.current_stock).text === 'Low Stock').length;
  const outOfStockItems = inventory.filter(item => getStockStatus(item.current_stock).text === 'Out of Stock').length;
  const adequateStockItems = inventory.filter(item => getStockStatus(item.current_stock).text === 'Adequate').length;

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
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:text-white dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
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
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Product Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Total Stock</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Current Stock</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Sold Stock</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Stock Level</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Last Restocked</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item.current_stock);
              const stockPercentage = calculateStockPercentage(item.current_stock);
              
              return (
                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.product_id?.p_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.product_id._id}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {item.total_stock}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {item.current_stock}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {item.sold_stock}
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
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {item.last_restocked ? new Date(item.last_restocked).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 px-4 flex flex-row gap-3">
                    <button
                      onClick={() => openRestockModal(item)}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Restock
                    </button>
                    <button
                      onClick={() => openDepleteModal(item)}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Deplete
                    </button>
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

      {/* Restock Modal */}
      {showRestockModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-1xl flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Restock Product
              </h3>
              <button
                onClick={closeRestockModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Message Display */}
              {message.text && (
                <div className={`rounded-lg p-3 ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                    : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {message.type === 'success' ? (
                      <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle size={16} className="text-red-600 dark:text-red-400" />
                    )}
                    <p className={`text-sm ${
                      message.type === 'success' 
                        ? 'text-green-800 dark:text-green-300' 
                        : 'text-red-800 dark:text-red-300'
                    }`}>
                      {message.text}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedItem.product_id?.p_name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Stock
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.current_stock} units
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stock Status
                  </label>
                  <div className="flex items-center space-x-1">
                    {getStockStatus(selectedItem.current_stock).icon}
                    <span className={`text-xs ${getStockStatus(selectedItem.current_stock).color}`}>
                      {getStockStatus(selectedItem.current_stock).text}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity to Restock *
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => {
                    setRestockQuantity(e.target.value);
                    setMessage({ type: '', text: '' }); // Clear message when user types
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:text-white dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter the number of units to add to inventory
                </p>
              </div>

              {restockQuantity && parseInt(restockQuantity) > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Restock Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-400">Current Stock:</span>
                      <span className="text-blue-900 dark:text-blue-300 font-medium">{selectedItem.current_stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-400">Restock Quantity:</span>
                      <span className="text-blue-900 dark:text-blue-300 font-medium">+{restockQuantity}</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-1">
                      <span className="text-blue-800 dark:text-blue-300 font-medium">New Stock:</span>
                      <span className="text-blue-900 dark:text-blue-200 font-bold">
                        {selectedItem.current_stock + parseInt(restockQuantity)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeRestockModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRestock}
                disabled={!restockQuantity || parseInt(restockQuantity) <= 0 || restockLoading || message.type === 'success'}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer"
              >
                {restockLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Restocking...
                  </>
                ) : (
                  <>
                    Restock Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deplete Modal */}
      {showDepleteModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-1xl flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Deplete Inventory
              </h3>
              <button
                onClick={closeDepleteModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Message Display */}
              {depleteMessage.text && (
                <div className={`rounded-lg p-3 ${
                  depleteMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                    : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {depleteMessage.type === 'success' ? (
                      <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle size={16} className="text-red-600 dark:text-red-400" />
                    )}
                    <p className={`text-sm ${
                      depleteMessage.type === 'success' 
                        ? 'text-green-800 dark:text-green-300' 
                        : 'text-red-800 dark:text-red-300'
                    }`}>
                      {depleteMessage.text}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedItem.product_id?.p_name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Stock
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.current_stock} units
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sold Stock
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.sold_stock} units
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity to Deplete *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedItem.current_stock}
                  value={depleteQuantity}
                  onChange={(e) => {
                    setDepleteQuantity(e.target.value);
                    setDepleteMessage({ type: '', text: '' }); // Clear message when user types
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:text-white dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Maximum: {selectedItem.current_stock} units
                </p>
              </div>

              {depleteQuantity && parseInt(depleteQuantity) > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                    Deplete Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-red-700 dark:text-red-400">Current Stock:</span>
                      <span className="text-red-900 dark:text-red-300 font-medium">{selectedItem.current_stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700 dark:text-red-400">Deplete Quantity:</span>
                      <span className="text-red-900 dark:text-red-300 font-medium">-{depleteQuantity}</span>
                    </div>
                    <div className="flex justify-between border-t border-red-200 dark:border-red-700 pt-1">
                      <span className="text-red-800 dark:text-red-300 font-medium">New Stock:</span>
                      <span className="text-red-900 dark:text-red-200 font-bold">
                        {selectedItem.current_stock - parseInt(depleteQuantity)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDepleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeplete}
                disabled={!depleteQuantity || parseInt(depleteQuantity) <= 0 || depleteLoading || depleteMessage.type === 'success'}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer"
              >
                {depleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    Update Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryData;