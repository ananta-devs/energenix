// components/DataDisplay/CouponData.jsx
import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, X, Edit, Trash2, AlertTriangle, Calendar, Percent, Hash, Tag, Users, Copy, Check } from 'lucide-react';
import { dataService } from '../utils/dataService';

const CouponData = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    minimum_purchase: '',
    usage_limit: '',
    per_user_limit: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
    description: '',
    visibility: 'public'
  });
  const [loadingAction, setLoadingAction] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  useEffect(() => {
    const filtered = coupons.filter(coupon =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoupons(filtered);
  }, [searchTerm, coupons]);

  const loadCoupons = async () => {
    try {
      const data = await dataService.getCoupons();
      setCoupons(data);
      setFilteredCoupons(data);
    } catch (error) {
      console.error('Error loading coupons:', error);
      setMessage({ type: 'error', text: 'Failed to load coupons data' });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: generateCouponCode(),
      discount_type: 'percentage',
      discount_value: '',
      minimum_purchase: '',
      usage_limit: '',
      per_user_limit: '',
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      is_active: true,
      description: '',
      visibility: 'public',
    });
    setMessage({ type: '', text: '' });
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      minimum_purchase: coupon.minimum_purchase || '',
      usage_limit: coupon.usage_limit || '',
      per_user_limit: coupon.per_user_limit || '',
      valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : '',
      valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : '',
      is_active: coupon.is_active,
      description: coupon.description || '',
      visibility: coupon.visibility || 'public',
    });
    setMessage({ type: '', text: '' });
    setShowModal(true);
  };

  const openDeleteModal = (coupon) => {
    setCouponToDelete(coupon);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      minimum_purchase: '',
      usage_limit: '',
      per_user_limit: '',
      valid_from: '',
      valid_until: '',
      is_active: true,
      description: '',
      visibility: 'public'
    });
    setMessage({ type: '', text: '' });
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCouponToDelete(null);
    setDeleteLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      setMessage({ type: 'error', text: 'Coupon code is required' });
      return false;
    }
    if (!formData.discount_value || parseFloat(formData.discount_value) <= 0) {
      setMessage({ type: 'error', text: 'Discount value must be greater than 0' });
      return false;
    }
    if (formData.discount_type === 'percentage' && parseFloat(formData.discount_value) > 100) {
      setMessage({ type: 'error', text: 'Percentage discount cannot exceed 100%' });
      return false;
    }
    if (formData.valid_from && formData.valid_until) {
      const fromDate = new Date(formData.valid_from);
      const untilDate = new Date(formData.valid_until);
      if (untilDate <= fromDate) {
        setMessage({ type: 'error', text: 'Valid until date must be after valid from date' });
        return false;
      }
    }
    if (!formData.valid_from) {
      setMessage({ type: 'error', text: 'Valid from date is required' });
      return false;
    }
    if (!formData.valid_until) {
      setMessage({ type: 'error', text: 'Valid until date is required' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoadingAction(true);
    setMessage({ type: '', text: '' });

    try {
      const couponData = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        minimum_purchase: formData.minimum_purchase ? parseFloat(formData.minimum_purchase) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        per_user_limit: formData.per_user_limit ? parseInt(formData.per_user_limit) : null
      };

      if (editingCoupon) {
        const updatedCoupon = await dataService.updateCoupon(editingCoupon._id, couponData);
        setCoupons(coupons.map(item =>
          item._id === updatedCoupon._id ? updatedCoupon : item
        ));
        setMessage({
          type: 'success',
          text: `Successfully updated coupon ${updatedCoupon.code}`
        });
      } else {
        const newCoupon = await dataService.createCoupon(couponData);
        setCoupons([...coupons, newCoupon]);
        setMessage({
          type: 'success',
          text: `Successfully added coupon ${newCoupon.code}`
        });
      }

      setTimeout(() => {
        closeModal();
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setMessage({
        type: 'error',
        text: `Failed to ${editingCoupon ? 'update' : 'add'} coupon. ${errorMessage}`
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;

    setDeleteLoading(true);

    try {
      await dataService.deleteCoupon(couponToDelete._id);
      setCoupons(coupons.filter(item => item._id !== couponToDelete._id));
      setMessage({
        type: 'success',
        text: `Successfully deleted coupon ${couponToDelete.code}`
      });
      
      closeDeleteModal();
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setMessage({
        type: 'error',
        text: `Failed to delete coupon. ${errorMessage}`
      });
      closeDeleteModal();
    }
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const validUntil = new Date(coupon.valid_until);
    const validFrom = new Date(coupon.valid_from);

    if (!coupon.is_active) {
      return { text: 'Inactive', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    }
    if (now < validFrom) {
      return { text: 'Scheduled', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' };
    }
    if (now > validUntil) {
      return { text: 'Expired', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
    }
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return { text: 'Limit Reached', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' };
    }
    return { text: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          Coupons ({coupons.length} items)
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add Coupon
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

      {/* Coupons Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Code</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Discount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Usage</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Validity</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Visibility</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCoupons.map((coupon) => {
              const status = getStatusBadge(coupon);
              return (
                <tr key={coupon._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-mono font-semibold text-gray-900 dark:text-white">{coupon.code}</p>
                          <button
                            onClick={() => copyToClipboard(coupon.code)}
                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                            title="Copy code"
                          >
                            {copiedCode === coupon.code ? (
                              <Check size={14} className="text-green-500" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{coupon.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {coupon.discount_type === 'percentage' ? (
                          <>
                            {coupon.discount_value}
                            <Percent size={14} className="inline mr-1" />
                          </>
                        ) : (
                          <>₹{coupon.discount_value}</>
                        )}
                      </p>
                      {coupon.minimum_purchase && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Min. purchase: ₹{coupon.minimum_purchase}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Users size={12} className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {coupon.usage_count || 0} / {coupon.usage_limit || '∞'}
                        </span>
                      </div>
                      {coupon.per_user_limit && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {coupon.per_user_limit} per user
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatDate(coupon.valid_until)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        From {formatDate(coupon.valid_from)}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                      {coupon.visibility}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      {status.text}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(coupon)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredCoupons.length === 0 && (
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {coupons.length === 0 ? 'No coupons found. Add your first coupon!' : 'No coupons match your search'}
          </p>
        </div>
      )}

      {/* Add/Edit Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
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

                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Coupon Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="COUPON-CODE"
                    />
                    {!editingCoupon && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, code: generateCouponCode() }))}
                        className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors cursor-pointer"
                      >
                        Generate
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    placeholder="Enter coupon description..."
                  />
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visibility
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={formData.visibility === 'public'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Public</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={formData.visibility === 'private'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Private</span>
                    </label>
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  {/* Discount Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Discount Type *
                    </label>
                    <select
                      name="discount_type"
                      value={formData.discount_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Discount Value *
                    </label>
                    <div className="relative">
                      {formData.discount_type === 'percentage' ? (
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      ) : (
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                      )}
                      <input
                        type="number"
                        name="discount_value"
                        value={formData.discount_value}
                        onChange={handleInputChange}
                        min="0"
                        max={formData.discount_type === 'percentage' ? '100' : undefined}
                        step={formData.discount_type === 'percentage' ? '0.01' : '0.01'}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={formData.discount_type === 'percentage' ? '0-100' : '0.00'}
                      />
                    </div>
                  </div>
                </div>

                {/* Minimum Purchase */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Purchase (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      name="minimum_purchase"
                      value={formData.minimum_purchase}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Usage Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Usage Limit (Optional)
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        name="usage_limit"
                        value={formData.usage_limit}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="∞"
                      />
                    </div>
                  </div>

                  {/* Per User Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Per User Limit (Optional)
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        name="per_user_limit"
                        value={formData.per_user_limit}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="∞"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Valid From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valid From *
                    </label>
                    <input
                      type="date"
                      name="valid_from"
                      value={formData.valid_from}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Valid Until */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valid Until *
                    </label>
                    <input
                      type="date"
                      name="valid_until"
                      value={formData.valid_until}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
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
                      {editingCoupon ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && couponToDelete && (
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
                    Are you sure you want to delete this coupon?
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Coupon Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-900 dark:text-white font-medium">{couponToDelete.code}</span>
                      <button
                        onClick={() => copyToClipboard(couponToDelete.code)}
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {copiedCode === couponToDelete.code ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {couponToDelete.discount_type === 'percentage' ? `${couponToDelete.discount_value}%` : `$${couponToDelete.discount_value}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={getStatusBadge(couponToDelete).color + ' px-2 py-0.5 rounded-full text-xs'}>
                      {getStatusBadge(couponToDelete).text}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Used:</span>
                    <span className="text-gray-900 dark:text-white">
                      {couponToDelete.usage_count || 0} times
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Valid Until:</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(couponToDelete.valid_until)}
                    </span>
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
                    Delete Coupon
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

export default CouponData;