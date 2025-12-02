// components/DataDisplay/CollectionData.jsx
import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, X, Edit, Trash2, AlertTriangle, ImageIcon, Upload } from 'lucide-react';
import { dataService } from '../utils/dataService';

const CollectionData = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({
    hsn_number: '',
    product_category: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    const filtered = collections.filter(collection =>
      collection.hsn_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.product_category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCollections(filtered);
  }, [searchTerm, collections]);

  const loadCollections = async () => {
    try {
      const data = await dataService.getCollections();
      setCollections(data);
      setFilteredCollections(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load collections data' });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCollection(null);
    setFormData({
      hsn_number: '',
      product_category: '',
      image: null
    });
    setImagePreview(null);
    setMessage({ type: '', text: '' });
    setShowModal(true);
  };

  const openEditModal = (collection) => {
    setEditingCollection(collection);
    setFormData({
      hsn_number: collection.hsn_number,
      product_category: collection.product_category,
      image: null
    });
    // Set existing image as preview if available
    if (collection.image_url) {
      setImagePreview(collection.image_url);
    } else {
      setImagePreview(null);
    }
    setMessage({ type: '', text: '' });
    setShowModal(true);
  };

  const openDeleteModal = (collection) => {
    setCollectionToDelete(collection);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCollection(null);
    setFormData({
      hsn_number: '',
      product_category: '',
      image: null
    });
    setImagePreview(null);
    setMessage({ type: '', text: '' });
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCollectionToDelete(null);
    setDeleteLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please upload a valid image file (JPEG, PNG, GIF, WebP)' });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear message if any
      setMessage({ type: '', text: '' });
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    // If editing and there was an existing image, mark it for removal
    if (editingCollection && editingCollection.image_url) {
      setFormData(prev => ({
        ...prev,
        removeImage: true
      }));
    }
  };

  const validateForm = () => {
    if (!formData.hsn_number.trim()) {
      setMessage({ type: 'error', text: 'HSN number is required' });
      return false;
    }
    if (!formData.product_category.trim()) {
      setMessage({ type: 'error', text: 'Product category is required' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoadingAction(true);
    setMessage({ type: '', text: '' });

    try {
      // Create FormData object to handle file upload
      const submitFormData = new FormData();
      submitFormData.append('hsn_number', formData.hsn_number);
      submitFormData.append('product_category', formData.product_category);
      
      if (formData.image) {
        submitFormData.append('image', formData.image);
      }
      
      // Add flag to remove existing image if needed
      if (formData.removeImage) {
        submitFormData.append('removeImage', 'true');
      }

      if (editingCollection) {
        // Update existing collection
        const updatedCollection = await dataService.updateCollection(editingCollection._id, submitFormData);
        setCollections(collections.map(item =>
          item._id === updatedCollection._id ? updatedCollection : item
        ));
        setMessage({
          type: 'success',
          text: `Successfully updated ${updatedCollection.product_category}`
        });
      } else {
        // Create new collection
        const newCollection = await dataService.createCollection(submitFormData);
        setCollections([...collections, newCollection]);
        setMessage({
          type: 'success',
          text: `Successfully added ${newCollection.product_category}`
        });
      }

      // Auto-close modal after success
      setTimeout(() => {
        closeModal();
      }, 2000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: `Failed to ${editingCollection ? 'update' : 'add'} collection. Please try again.`
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    if (!collectionToDelete) return;

    setDeleteLoading(true);

    try {
      await dataService.deleteCollection(collectionToDelete._id);
      setCollections(collections.filter(item => item._id !== collectionToDelete._id));
      setMessage({
        type: 'success',
        text: `Successfully deleted ${collectionToDelete.product_category}`
      });
      
      closeDeleteModal();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete collection. Please try again.'
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
          Product Collections ({collections.length} items)
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add Collection
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

      {/* Collections Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Product Category</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">HSN Number</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Created Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Updated Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCollections.map((collection) => (
              <tr key={collection._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4 flex">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    {collection.image_url ? (
                      <img 
                        src={collection.image_url} 
                        alt={collection.product_category}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<ImageIcon size={20} className="text-gray-400"/>';
                        }}
                      />
                    ) : (
                      <ImageIcon size={20} className="text-gray-400"/>
                    )}
                  </div>
                  <p className="ml-3 mt-3 text-sm text-gray-900 dark:text-white">{collection.product_category}</p>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{collection.hsn_number}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {collection.createdAt ? new Date(collection.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {collection.updatedAt ? new Date(collection.updatedAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(collection)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(collection)}
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

      {filteredCollections.length === 0 && (
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {collections.length === 0 ? 'No collections found. Add your first collection!' : 'No collections match your search'}
          </p>
        </div>
      )}

      {/* Add/Edit Collection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-1xl flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
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

              {/* Image Upload and Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Collection Image
                </label>
                <div className="space-y-4">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-32 h-32 mx-auto">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  {/* Image Upload Input */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          PNG, JPG, GIF, WebP (Max. 5MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  HSN Number *
                </label>
                <input
                  type="text"
                  name="hsn_number"
                  value={formData.hsn_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter HSN number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Category *
                </label>
                <input
                  type="text"
                  name="product_category"
                  value={formData.product_category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product category"
                />
              </div>
            </div>

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
                    {editingCollection ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    {editingCollection ? 'Update Collection' : 'Add Collection'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && collectionToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-1xl flex items-center justify-center p-4 z-50">
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
                    Are you sure you want to delete this collection?
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Collection Details
                </h4>
                {collectionToDelete.image_url && (
                  <div className="mb-4">
                    <img 
                      src={collectionToDelete.image_url} 
                      alt={collectionToDelete.product_category}
                      className="w-24 h-24 object-cover rounded-lg mx-auto"
                    />
                  </div>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">HSN Number:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{collectionToDelete.hsn_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Product Category:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{collectionToDelete.product_category}</span>
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
                    Delete Collection
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

export default CollectionData;