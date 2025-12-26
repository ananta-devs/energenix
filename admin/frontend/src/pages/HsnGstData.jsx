// components/DataDisplay/HsnGstData.jsx
import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, X, Edit, Trash2, AlertTriangle, Hash, Percent } from 'lucide-react';
import { dataService } from '../utils/dataService';

const HsnGstData = () => {
  const [hsnGstItems, setHsnGstItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    hsn_number: '',
    gst_percentage: ''
  });
  const [loadingAction, setLoadingAction] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadHsnGstItems();
  }, []);

  useEffect(() => {
    const filtered = hsnGstItems.filter(item =>
      item.hsn_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, hsnGstItems]);

  const loadHsnGstItems = async () => {
    try {
      const data = await dataService.getHsnGstItems();
      setHsnGstItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Error loading HSN/GST items:', error);
      setMessage({ type: 'error', text: 'Failed to load HSN/GST data' });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      hsn_number: '',
      gst_percentage: ''
    });
    setMessage({ type: '', text: '' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      hsn_number: item.hsn_number,
      gst_percentage: item.gst_percentage
    });
    setMessage({ type: '', text: '' });
    setShowModal(true);
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      hsn_number: '',
      gst_percentage: ''
    });
    setMessage({ type: '', text: '' });
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
    setDeleteLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    if (!formData.hsn_number.trim()) {
      setMessage({ type: 'error', text: 'HSN number is required' });
      return false;
    }
    
    // Validate HSN format (4-8 digits)
    const hsnRegex = /^\d{4,8}$/;
    if (!hsnRegex.test(formData.hsn_number.trim())) {
      setMessage({ type: 'error', text: 'HSN number must be 4-8 digits' });
      return false;
    }
    
    if (!formData.gst_percentage || parseFloat(formData.gst_percentage) <= 0) {
      setMessage({ type: 'error', text: 'GST percentage must be greater than 0' });
      return false;
    }
    
    if (parseFloat(formData.gst_percentage) > 100) {
      setMessage({ type: 'error', text: 'GST percentage cannot exceed 100%' });
      return false;
    }

    // Check for duplicate HSN number (except when editing the same item)
    const isDuplicate = hsnGstItems.some(item => {
      if (editingItem && item._id === editingItem._id) return false;
      return item.hsn_number === formData.hsn_number.trim();
    });
    
    if (isDuplicate) {
      setMessage({ type: 'error', text: 'HSN number already exists' });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoadingAction(true);
    setMessage({ type: '', text: '' });

    try {
      const itemData = {
        ...formData,
        hsn_number: formData.hsn_number.trim(),
        gst_percentage: parseFloat(formData.gst_percentage)
      };

      if (editingItem) {
        const updatedItem = await dataService.updateHsnGstItem(editingItem._id, itemData);
        setHsnGstItems(hsnGstItems.map(item =>
          item._id === updatedItem._id ? updatedItem : item
        ));
        setMessage({
          type: 'success',
          text: `Successfully updated HSN ${updatedItem.hsn_number}`
        });
      } else {
        const newItem = await dataService.createHsnGstItem(itemData);
        setHsnGstItems([...hsnGstItems, newItem]);
        setMessage({
          type: 'success',
          text: `Successfully added HSN ${newItem.hsn_number}`
        });
      }

      setTimeout(() => {
        closeModal();
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setMessage({
        type: 'error',
        text: `Failed to ${editingItem ? 'update' : 'add'} HSN/GST item. ${errorMessage}`
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setDeleteLoading(true);

    try {
      await dataService.deleteHsnGstItem(itemToDelete._id);
      setHsnGstItems(hsnGstItems.filter(item => item._id !== itemToDelete._id));
      setMessage({
        type: 'success',
        text: `Successfully deleted HSN ${itemToDelete.hsn_number}`
      });
      
      closeDeleteModal();
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setMessage({
        type: 'error',
        text: `Failed to delete HSN/GST item. ${errorMessage}`
      });
      closeDeleteModal();
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
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          HSN/GST ({hsnGstItems.length} items)
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search HSN numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:text-white dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add HSN/GST
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 rounded-lg p-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' 
            : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <FileText size={16} className="text-green-600 dark:text-green-400" />
            ) : (
              <X size={16} className="text-red-600 dark:text-red-400" />
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

      {/* HSN/GST Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">HSN Number</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">GST Percentage</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredItems.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-gray-400" />
                        <p className="font-mono font-semibold text-gray-900 dark:text-white">{item.hsn_number}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white">{item.gst_percentage}%</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {hsnGstItems.length === 0 ? 'No HSN/GST items found. Add your first item!' : 'No items match your search'}
          </p>
        </div>
      )}

      {/* Add/Edit HSN/GST Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingItem ? 'Edit HSN/GST' : 'Add New HSN/GST'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Message Display */}
                {message.text && (
                  <div className={`rounded-lg p-3 ${
                    message.type === 'success' 
                      ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                      : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      {message.type === 'success' ? (
                        <FileText size={16} className="text-green-600 dark:text-green-400" />
                      ) : (
                        <X size={16} className="text-red-600 dark:text-red-400" />
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

                {/* HSN Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    HSN Number *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="hsn_number"
                      value={formData.hsn_number}
                      onChange={handleInputChange}
                      maxLength="8"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:text-white dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="Enter 4-8 digit HSN code"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter a 4-8 digit HSN code (numbers only)
                  </p>
                </div>

                {/* GST Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GST Percentage *
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      name="gst_percentage"
                      value={formData.gst_percentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:text-white dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00 - 100.00"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter GST percentage (0-100)
                  </p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 z-10 p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loadingAction || message.type === 'success'}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {loadingAction ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editingItem ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Deletion
              </h3>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                disabled={deleteLoading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="text-red-600 dark:text-red-400 shrink-0" size={24} />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Are you sure you want to delete this HSN/GST item?
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Item Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">HSN Number:</span>
                    <span className="font-mono text-gray-900 dark:text-white font-medium">{itemToDelete.hsn_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">GST Percentage:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{itemToDelete.gst_percentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Item
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

export default HsnGstData;