// components/DataDisplay/ProductsData.jsx
import React, { useState, useEffect } from "react";
import {
    Package,
    Search,
    Plus,
    Eye,
    Trash2,
    Edit,
    X,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
    Upload,
    Ruler,
    Weight,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { dataService } from "../utils/dataService";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const PACK_TYPES = [
    { id: "pack-1", label: "Pack of 1", defaultEnabled: true },
    { id: "pack-2", label: "Pack of 2", defaultEnabled: false },
    { id: "pack-4", label: "Pack of 4", defaultEnabled: false },
];

const ProductsData = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formErrors, setFormErrors] = useState({});
    const [expandedPackType, setExpandedPackType] = useState("pack-1");

    // Form state
    const [formData, setFormData] = useState({
        p_name: "",
        p_subtitle: "",
        sku: "",
        image_urls: [],
        p_category: "",
        p_price: "",
        discount_price: "",
        description: "",
        trending: false,
        bestseller: false,
        pack_types: {
            "Pack of 1": {
                dimensions: { height: "", width: "", length: "", weight: "" },
                enabled: true
            },
            "Pack of 2": {
                dimensions: { height: "", width: "", length: "", weight: "" },
                enabled: false
            },
            "Pack of 4": {
                dimensions: { height: "", width: "", length: "", weight: "" },
                enabled: false
            }
        }
    });

    // Message states for each modal
    const [addModalMessage, setAddModalMessage] = useState({
        type: "",
        text: "",
    });
    const [viewModalMessage, setViewModalMessage] = useState({
        type: "",
        text: "",
    });
    const [deleteModalMessage, setDeleteModalMessage] = useState({
        type: "",
        text: "",
    });
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        loadProducts();
        loadCollections();
    }, []);

    const loadCollections = async () => {
        try {
            const data = await dataService.getCollections();
            setCollections(data);
        } catch (error) {
            console.error("Error loading collections:", error);
        }
    };

    useEffect(() => {
        const filtered = products.filter(
            (product) =>
                (product.p_name || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (product.p_category?.c_name || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const loadProducts = async () => {
        try {
            const data = await dataService.getProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Validation functions
    const validateForm = () => {
        const errors = {};
        
        if (!formData.p_name?.trim()) {
            errors.p_name = "Product name is required";
        }
        
        if (!formData.p_category) {
            errors.p_category = "Category is required";
        }
        
        if (!formData.p_price || parseFloat(formData.p_price) <= 0) {
            errors.p_price = "Valid price is required";
        }
        
        if (formData.discount_price && parseFloat(formData.discount_price) >= parseFloat(formData.p_price)) {
            errors.discount_price = "Discount price must be less than regular price";
        }

        if (formData.image_urls.length === 0) {
            errors.image_urls = "At least one image is required";
        }

        // Validate at least one pack type is enabled
        const enabledPackTypes = Object.values(formData.pack_types).filter(pack => pack.enabled);
        if (enabledPackTypes.length === 0) {
            errors.pack_types = "At least one pack type must be enabled";
        }

        // Validate dimensions for enabled pack types
        Object.entries(formData.pack_types).forEach(([packType, packData]) => {
            if (packData.enabled) {
                if (!packData.dimensions.height || parseFloat(packData.dimensions.height) <= 0) {
                    errors[`${packType}_height`] = `Height is required for ${packType}`;
                }
                if (!packData.dimensions.width || parseFloat(packData.dimensions.width) <= 0) {
                    errors[`${packType}_width`] = `Width is required for ${packType}`;
                }
                if (!packData.dimensions.length || parseFloat(packData.dimensions.length) <= 0) {
                    errors[`${packType}_length`] = `Length is required for ${packType}`;
                }
                if (!packData.dimensions.weight || parseFloat(packData.dimensions.weight) <= 0) {
                    errors[`${packType}_weight`] = `Weight is required for ${packType}`;
                }
            }
        });
        
        return errors;
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return "N/A";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    const formatDimensions = (dimensions) => {
        if (!dimensions) return "N/A";
        return `${dimensions.height}×${dimensions.width}×${dimensions.length} cm, ${dimensions.weight} kg`;
    };

    const handleAddProduct = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setAddModalMessage({
                type: "error",
                text: "Please fix the form errors before submitting.",
            });
            return;
        }

        setFormErrors({});
        
        try {
            setAddModalMessage({ type: "", text: "" });
            setUploadProgress(0);

            // Filter only enabled pack types
            const enabledPackTypes = {};
            Object.entries(formData.pack_types).forEach(([packType, packData]) => {
                if (packData.enabled) {
                    enabledPackTypes[packType] = {
                        dimensions: {
                            height: parseFloat(packData.dimensions.height),
                            width: parseFloat(packData.dimensions.width),
                            length: parseFloat(packData.dimensions.length),
                            weight: parseFloat(packData.dimensions.weight)
                        }
                    };
                }
            });

            const productToCreate = {
                p_name: formData.p_name.trim(),
                p_subtitle: formData.p_subtitle.trim(),
                sku: formData.sku.trim(),
                p_category: formData.p_category,
                p_price: parseFloat(formData.p_price),
                discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
                description: formData.description.trim(),
                image_urls: [],
                trending: formData.trending,
                bestseller: formData.bestseller,
                pack_types: enabledPackTypes
            };

            const createdProduct = await dataService.createProduct(productToCreate);
            setUploadProgress(30);

            let uploadedCloudinaryUrls = [];

            const newImagesToUpload = formData.image_urls.filter(
                (img) => img.type === "new"
            );

            if (newImagesToUpload.length > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append("p_id", createdProduct._id);

                newImagesToUpload.forEach((image, index) => {
                    uploadFormData.append(`image`, image.file);
                });

                const uploadResponse = await axios.post(
                    `${API_BASE}/api/upload`,
                    uploadFormData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round(
                                (progressEvent.loaded * 70) / progressEvent.total
                            );
                            setUploadProgress(30 + progress);
                        },
                    }
                );

                uploadedCloudinaryUrls = uploadResponse.data.imageUrls;
            }

            const finalImageUrls = [
                ...formData.image_urls
                    .filter((img) => img.type === "existing")
                    .map((img) => img.url),
                ...uploadedCloudinaryUrls,
            ];

            const updatedProductWithImages = await dataService.updateProduct(
                createdProduct._id,
                {
                    image_urls: finalImageUrls,
                }
            );

            setUploadProgress(100);
            setProducts((prev) => [updatedProductWithImages, ...prev]);
            setAddModalMessage({
                type: "success",
                text: "Product added successfully!",
            });

            setTimeout(() => {
                setShowAddModal(false);
                resetForm();
                setUploadProgress(0);
            }, 1500);
        } catch (error) {
            console.error("Error adding product:", error);
            setAddModalMessage({
                type: "error",
                text: "Error adding product. Please try again.",
            });
            setUploadProgress(0);
        }
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;

        try {
            setDeleteModalMessage({ type: "", text: "" });
            await dataService.deleteProduct(selectedProduct._id);

            setProducts((prev) =>
                prev.filter((p) => p._id !== selectedProduct._id)
            );
            setDeleteModalMessage({
                type: "success",
                text: "Product deleted successfully!",
            });

            setTimeout(() => {
                setShowDeleteModal(false);
                setSelectedProduct(null);
            }, 1500);
        } catch (error) {
            console.error("Error deleting product:", error);
            setDeleteModalMessage({
                type: "error",
                text: "Error deleting product. Please try again.",
            });
        }
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setViewModalMessage({
                type: "error",
                text: "Please fix the form errors before submitting.",
            });
            return;
        }

        setFormErrors({});

        try {
            setViewModalMessage({ type: "", text: "" });
            setUploadProgress(0);

            let uploadedCloudinaryUrls = [];
            const newImagesToUpload = formData.image_urls.filter(
                (img) => img.type === "new"
            );

            if (newImagesToUpload.length > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append("p_id", editingProduct._id);

                newImagesToUpload.forEach((image, index) => {
                    uploadFormData.append(`image`, image.file);
                });

                const uploadResponse = await axios.post(
                    `${API_BASE}/api/upload`,
                    uploadFormData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round(
                                (progressEvent.loaded * 70) / progressEvent.total
                            );
                            setUploadProgress(30 + progress);
                        },
                    }
                );
                uploadedCloudinaryUrls = uploadResponse.data.imageUrls;
            }

            const finalImageUrls = [
                ...formData.image_urls
                    .filter((img) => img.type === "existing")
                    .map((img) => img.url),
                ...uploadedCloudinaryUrls,
            ];

            // Filter only enabled pack types
            const enabledPackTypes = {};
            Object.entries(formData.pack_types).forEach(([packType, packData]) => {
                if (packData.enabled) {
                    enabledPackTypes[packType] = {
                        dimensions: {
                            height: parseFloat(packData.dimensions.height),
                            width: parseFloat(packData.dimensions.width),
                            length: parseFloat(packData.dimensions.length),
                            weight: parseFloat(packData.dimensions.weight)
                        }
                    };
                }
            });

            const productToUpdate = {
                p_name: formData.p_name.trim(),
                p_subtitle: formData.p_subtitle.trim(),
                sku: formData.sku.trim(),
                p_category: formData.p_category,
                p_price: parseFloat(formData.p_price),
                discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
                description: formData.description.trim(),
                image_urls: finalImageUrls,
                trending: formData.trending,
                bestseller: formData.bestseller,
                pack_types: enabledPackTypes
            };

            const updatedProduct = await dataService.updateProduct(
                editingProduct._id,
                productToUpdate
            );

            setUploadProgress(100);
            setProducts((prev) =>
                prev.map((p) =>
                    p._id === updatedProduct._id ? updatedProduct : p
                )
            );
            setViewModalMessage({
                type: "success",
                text: "Product updated successfully!",
            });

            setTimeout(() => {
                setShowViewModal(false);
                setEditingProduct(null);
                resetForm();
                setUploadProgress(0);
            }, 1500);
        } catch (error) {
            console.error("Error updating product:", error);
            setViewModalMessage({
                type: "error",
                text: "Error updating product. Please try again.",
            });
            setUploadProgress(0);
        }
    };

    const resetForm = () => {
        setFormData({
            p_name: "",
            p_subtitle: "",
            sku: "",
            image_urls: [],
            p_category: "",
            p_price: "",
            discount_price: "",
            description: "",
            trending: false,
            bestseller: false,
            pack_types: {
                "Pack of 1": {
                    dimensions: { height: "", width: "", length: "", weight: "" },
                    enabled: true
                },
                "Pack of 2": {
                    dimensions: { height: "", width: "", length: "", weight: "" },
                    enabled: false
                },
                "Pack of 4": {
                    dimensions: { height: "", width: "", length: "", weight: "" },
                    enabled: false
                }
            }
        });
        setExpandedPackType("pack-1");
        setFormErrors({});
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        
        // Validate file types and sizes
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} is not an image file`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert(`${file.name} is too large (max 5MB)`);
                return false;
            }
            return true;
        });

        const newImages = validFiles.map((file) => ({
            type: "new",
            file: file,
            preview: URL.createObjectURL(file),
        }));
        
        setFormData((prev) => ({
            ...prev,
            image_urls: [...prev.image_urls, ...newImages],
        }));
        setFormErrors(prev => ({ ...prev, image_urls: "" }));
    };

    const removeImage = async (indexToRemove) => {
        const imageToRemove = formData.image_urls[indexToRemove];

        if (imageToRemove.type === "new") {
            URL.revokeObjectURL(imageToRemove.preview);
        } else if (imageToRemove.type === "existing") {
            try {
                await axios.delete(`${API_BASE}/api/upload`, {
                    data: { public_id: imageToRemove.public_id },
                });
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }

        setFormData((prev) => ({
            ...prev,
            image_urls: prev.image_urls.filter((_, i) => i !== indexToRemove),
        }));
    };

    const extractPublicId = (url) => {
        const parts = url.split("/");
        const folderPathIndex = parts.indexOf("products");
        if (folderPathIndex !== -1) {
            return parts.slice(folderPathIndex).join("/").split(".")[0];
        }
        const filename = parts[parts.length - 1];
        return filename.split(".")[0];
    };

    const openViewModal = (product) => {
        setSelectedProduct(product);
        setExpandedPackType("pack-1");
        
        // Initialize pack types from product data or defaults
        const packTypes = product.pack_types || {};
        setFormData({
            p_name: product.p_name,
            p_subtitle: product.p_subtitle,
            sku: product.sku,
            image_urls: product.image_urls
                ? product.image_urls.map((url) => ({
                      type: "existing",
                      url: url,
                      public_id: extractPublicId(url),
                  }))
                : [],
            p_category: product.p_category ? product.p_category._id : "",
            p_price: product.p_price.toString(),
            discount_price: product.discount_price?.toString() || "",
            description: product.description || "",
            trending: product.trending || false,
            bestseller: product.bestseller || false,
            pack_types: {
                "Pack of 1": {
                    dimensions: packTypes["Pack of 1"]?.dimensions || { height: "", width: "", length: "", weight: "" },
                    enabled: !!packTypes["Pack of 1"]
                },
                "Pack of 2": {
                    dimensions: packTypes["Pack of 2"]?.dimensions || { height: "", width: "", length: "", weight: "" },
                    enabled: !!packTypes["Pack of 2"]
                },
                "Pack of 4": {
                    dimensions: packTypes["Pack of 4"]?.dimensions || { height: "", width: "", length: "", weight: "" },
                    enabled: !!packTypes["Pack of 4"]
                }
            }
        });
        setViewModalMessage({ type: "", text: "" });
        setFormErrors({});
        setShowViewModal(true);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setDeleteModalMessage({ type: "", text: "" });
        setShowDeleteModal(true);
    };

    const startEditing = () => {
        setEditingProduct(selectedProduct);
        setViewModalMessage({ type: "", text: "" });
        setFormErrors({});
    };

    const cancelEditing = () => {
        setEditingProduct(null);
        if (selectedProduct) {
            const packTypes = selectedProduct.pack_types || {};
            setFormData({
                p_name: selectedProduct.p_name,
                p_subtitle: selectedProduct.p_subtitle,
                sku: selectedProduct.sku,
                image_urls: selectedProduct.image_urls
                    ? selectedProduct.image_urls.map((url) => ({
                          type: "existing",
                          url: url,
                          public_id: extractPublicId(url),
                      }))
                    : [],
                p_category: selectedProduct.p_category ? selectedProduct.p_category._id : "",
                p_price: selectedProduct.p_price.toString(),
                discount_price: selectedProduct.discount_price?.toString() || "",
                description: selectedProduct.description || "",
                trending: selectedProduct.trending || false,
                bestseller: selectedProduct.bestseller || false,
                pack_types: {
                    "Pack of 1": {
                        dimensions: packTypes["Pack of 1"]?.dimensions || { height: "", width: "", length: "", weight: "" },
                        enabled: !!packTypes["Pack of 1"]
                    },
                    "Pack of 2": {
                        dimensions: packTypes["Pack of 2"]?.dimensions || { height: "", width: "", length: "", weight: "" },
                        enabled: !!packTypes["Pack of 2"]
                    },
                    "Pack of 4": {
                        dimensions: packTypes["Pack of 4"]?.dimensions || { height: "", width: "", length: "", weight: "" },
                        enabled: !!packTypes["Pack of 4"]
                    }
                }
            });
        }
        setViewModalMessage({ type: "", text: "" });
        setFormErrors({});
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setAddModalMessage({ type: "", text: "" });
        resetForm();
        setUploadProgress(0);
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setEditingProduct(null);
        setViewModalMessage({ type: "", text: "" });
        setUploadProgress(0);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedProduct(null);
        setDeleteModalMessage({ type: "", text: "" });
    };

    const handlePackTypeToggle = (packType) => {
        setFormData(prev => ({
            ...prev,
            pack_types: {
                ...prev.pack_types,
                [packType]: {
                    ...prev.pack_types[packType],
                    enabled: !prev.pack_types[packType].enabled
                }
            }
        }));
        setFormErrors(prev => {
            const newErrors = { ...prev };
            // Clear errors for this pack type when toggling
            delete newErrors[`${packType}_height`];
            delete newErrors[`${packType}_width`];
            delete newErrors[`${packType}_length`];
            delete newErrors[`${packType}_weight`];
            return newErrors;
        });
    };

    const handleDimensionChange = (packType, field, value) => {
        setFormData(prev => ({
            ...prev,
            pack_types: {
                ...prev.pack_types,
                [packType]: {
                    ...prev.pack_types[packType],
                    dimensions: {
                        ...prev.pack_types[packType].dimensions,
                        [field]: value
                    }
                }
            }
        }));
        // Clear specific error when user starts typing
        setFormErrors(prev => ({ ...prev, [`${packType}_${field}`]: "" }));
    };

    const togglePackTypeExpansion = (packId) => {
        setExpandedPackType(expandedPackType === packId ? null : packId);
    };

    // Simplified Pack Types Component
    const SimplePackTypesSection = ({ editing }) => (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                <Ruler className="inline mr-2" size={16} />
                Pack Types & Dimensions
            </h4>
            
            <div className="space-y-3">
                {PACK_TYPES.map(({ id, label }) => (
                    <div 
                        key={id} 
                        className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                            formData.pack_types[label].enabled 
                                ? "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20" 
                                : "border-gray-200 dark:border-gray-700"
                        }`}
                    >
                        {/* Pack Type Header */}
                        <div 
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            onClick={() => editing && togglePackTypeExpansion(id)}
                        >
                            <div className="flex items-center gap-3">
                                {editing && (
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.pack_types[label].enabled}
                                            onChange={() => handlePackTypeToggle(label)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </label>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${
                                        formData.pack_types[label].enabled 
                                            ? "text-blue-700 dark:text-blue-300" 
                                            : "text-gray-600 dark:text-gray-400"
                                    }`}>
                                        {label}
                                    </span>
                                    {formData.pack_types[label].enabled && (
                                        <CheckCircle size={14} className="text-green-600 dark:text-green-400" />
                                    )}
                                </div>
                            </div>
                            {editing && (
                                <div className="flex items-center gap-2">
                                    {formData.pack_types[label].enabled && (
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded">
                                            Active
                                        </span>
                                    )}
                                    {expandedPackType === id ? (
                                        <ChevronUp size={16} className="text-gray-400" />
                                    ) : (
                                        <ChevronDown size={16} className="text-gray-400" />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Dimensions Section - Show only if enabled and expanded */}
                        {editing && formData.pack_types[label].enabled && expandedPackType === id && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <div className="mb-3">
                                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Dimensions for {label}
                                    </h5>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        Enter dimensions in centimeters (cm) and weight in kilograms (kg)
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Height (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.pack_types[label].dimensions.height}
                                            onChange={(e) => handleDimensionChange(label, "height", e.target.value)}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                formErrors[`${label}_height`] 
                                                    ? "border-red-300 dark:border-red-600" 
                                                    : "border-gray-300 dark:border-gray-600"
                                            }`}
                                            placeholder="Enter height"
                                        />
                                        {formErrors[`${label}_height`] && (
                                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                {formErrors[`${label}_height`]}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Width (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.pack_types[label].dimensions.width}
                                            onChange={(e) => handleDimensionChange(label, "width", e.target.value)}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                formErrors[`${label}_width`] 
                                                    ? "border-red-300 dark:border-red-600" 
                                                    : "border-gray-300 dark:border-gray-600"
                                            }`}
                                            placeholder="Enter width"
                                        />
                                        {formErrors[`${label}_width`] && (
                                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                {formErrors[`${label}_width`]}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Length (cm) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.pack_types[label].dimensions.length}
                                            onChange={(e) => handleDimensionChange(label, "length", e.target.value)}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                formErrors[`${label}_length`] 
                                                    ? "border-red-300 dark:border-red-600" 
                                                    : "border-gray-300 dark:border-gray-600"
                                            }`}
                                            placeholder="Enter length"
                                        />
                                        {formErrors[`${label}_length`] && (
                                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                {formErrors[`${label}_length`]}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Weight (kg) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.pack_types[label].dimensions.weight}
                                            onChange={(e) => handleDimensionChange(label, "weight", e.target.value)}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                formErrors[`${label}_weight`] 
                                                    ? "border-red-300 dark:border-red-600" 
                                                    : "border-gray-300 dark:border-gray-600"
                                            }`}
                                            placeholder="Enter weight"
                                        />
                                        {formErrors[`${label}_weight`] && (
                                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                {formErrors[`${label}_weight`]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {formErrors.pack_types && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                    {formErrors.pack_types}
                </p>
            )}

            {/* Enabled Pack Types Summary */}
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Enabled Pack Types:
                    </h6>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Click on a pack type to edit its dimensions
                    </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {PACK_TYPES.map(({ label }) => (
                        formData.pack_types[label].enabled && (
                            <div key={label} className="flex items-center gap-2 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                                <CheckCircle size={12} className="text-green-600 dark:text-green-400" />
                                <span className="text-green-800 dark:text-green-300">{label}</span>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );

    // Message display component
    const MessageDisplay = ({ message }) => {
        if (!message.text) return null;

        return (
            <div
                className={`rounded-lg p-3 ${
                    message.type === "success"
                        ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
                        : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
                }`}
            >
                <div className="flex items-center gap-2">
                    {message.type === "success" ? (
                        <CheckCircle
                            size={16}
                            className="text-green-600 dark:text-green-400"
                        />
                    ) : (
                        <XCircle
                            size={16}
                            className="text-red-600 dark:text-red-400"
                        />
                    )}
                    <p
                        className={`text-sm ${
                            message.type === "success"
                                ? "text-green-800 dark:text-green-300"
                                : "text-red-800 dark:text-red-300"
                        }`}
                    >
                        {message.text}
                    </p>
                </div>
            </div>
        );
    };

    // Progress bar component
    const ProgressBar = ({ progress }) => {
        if (progress === 0) return null;
        
        return (
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
                            ></div>
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
                    Products Data ({products.length} items)
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        <Plus size={20} />
                        Add New Product
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                Product
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                Category
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                Price
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                Dimensions
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredProducts.map((product, index) => {
                            const packTypes = product.pack_types || {};
                            const enabledPackTypes = Object.keys(packTypes);
                            const firstPackType = enabledPackTypes[0];
                            const firstDimensions = firstPackType ? packTypes[firstPackType].dimensions : null;
                            
                            return (
                                <tr
                                    key={product._id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                                {product.image_urls &&
                                                product.image_urls.length > 0 ? (
                                                    <img
                                                        src={product.image_urls[0]}
                                                        alt={product.p_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageIcon
                                                        size={20}
                                                        className="text-gray-400"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {product.p_name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                    {product.description
                                                        ? product.description.split(" ").length > 4
                                                            ? product.description.split(" ").slice(0, 4).join(" ") + "..."
                                                            : product.description
                                                        : "No description"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                            {product.p_category ? product.p_category.product_category : 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        {formatPrice(product.p_price)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                        {firstDimensions ? (
                                            <div>
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Ruler size={14} className="text-gray-400" />
                                                    <span>{formatDimensions(firstDimensions)}</span>
                                                </div>
                                                {enabledPackTypes.length > 1 && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        +{enabledPackTypes.length - 1} more pack type(s)
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            "No dimensions set"
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => openViewModal(product)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(product)}
                                                className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        No products found
                    </p>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Add New Product
                            </h3>
                            <button
                                onClick={closeAddModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <MessageDisplay message={addModalMessage} />
                            <ProgressBar progress={uploadProgress} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.p_name}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                p_name: e.target.value,
                                            }));
                                            setAddModalMessage({ type: "", text: "" });
                                            setFormErrors(prev => ({ ...prev, p_name: "" }));
                                        }}
                                        className={`w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.p_name 
                                                ? "border-red-300 dark:border-red-600" 
                                                : "border-gray-300 dark:border-gray-600"
                                        }`}
                                        placeholder="Enter product name"
                                    />
                                    {formErrors.p_name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {formErrors.p_name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Product Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.p_subtitle}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                p_subtitle: e.target.value,
                                            }));
                                            setAddModalMessage({ type: "", text: "" });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter product subtitle"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.p_category}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                p_category: e.target.value,
                                            }));
                                            setAddModalMessage({ type: "", text: "" });
                                            setFormErrors(prev => ({ ...prev, p_category: "" }));
                                        }}
                                        className={`w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.p_category 
                                                ? "border-red-300 dark:border-red-600" 
                                                : "border-gray-300 dark:border-gray-600"
                                        }`}
                                    >
                                        <option value="">Select Category</option>
                                        {collections.map((collection) => (
                                            <option key={collection._id} value={collection._id}>
                                                {collection.product_category}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.p_category && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {formErrors.p_category}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.p_price}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                p_price: e.target.value,
                                            }));
                                            setAddModalMessage({ type: "", text: "" });
                                            setFormErrors(prev => ({ ...prev, p_price: "" }));
                                        }}
                                        className={`w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.p_price 
                                                ? "border-red-300 dark:border-red-600" 
                                                : "border-gray-300 dark:border-gray-600"
                                        }`}
                                        placeholder="Enter price"
                                    />
                                    {formErrors.p_price && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {formErrors.p_price}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Discounted Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.discount_price}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                discount_price: e.target.value,
                                            }));
                                            setAddModalMessage({ type: "", text: "" });
                                            setFormErrors(prev => ({ ...prev, discount_price: "" }));
                                        }}
                                        className={`w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.discount_price 
                                                ? "border-red-300 dark:border-red-600" 
                                                : "border-gray-300 dark:border-gray-600"
                                        }`}
                                        placeholder="Enter discounted price"
                                    />
                                    {formErrors.discount_price && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {formErrors.discount_price}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        SKU Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                sku: e.target.value,
                                            }));
                                            setAddModalMessage({ type: "", text: "" });
                                            setFormErrors(prev => ({ ...prev, sku: "" }));
                                        }}
                                        className={`w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            formErrors.sku
                                                ? "border-red-300 dark:border-red-600"
                                                : "border-gray-300 dark:border-gray-600"
                                        }`}
                                        placeholder="Enter SKU number"
                                    />
                                    {formErrors.sku && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {formErrors.sku}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Simplified Pack Types Section */}
                            <SimplePackTypesSection editing={true} />

                            {/* Checkboxes */}
                            <div className="flex items-center gap-3 mt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.trending}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                trending: e.target.checked,
                                            }))
                                        }
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Trending
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.bestseller}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                bestseller: e.target.checked,
                                            }))
                                        }
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Bestseller
                                    </span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Product Images *
                                </label>
                                <div className={`border-2 border-dashed rounded-lg p-4 ${
                                    formErrors.image_urls 
                                        ? "border-red-300 dark:border-red-600" 
                                        : "border-gray-300 dark:border-gray-600"
                                }`}>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer flex flex-col items-center justify-center p-4"
                                    >
                                        <Upload
                                            size={32}
                                            className="text-gray-400 mb-2"
                                        />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Click to upload images or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            Maximum 5MB per image
                                        </p>
                                    </label>
                                    {formData.image_urls.length > 0 && (
                                        <div className="mt-4 grid grid-cols-4 gap-2">
                                            {formData.image_urls.map(
                                                (image, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative"
                                                    >
                                                        <img
                                                            src={
                                                                image.type === "new"
                                                                    ? image.preview
                                                                    : image.url
                                                            }
                                                            alt={`Preview ${index}`}
                                                            className="w-20 h-20 object-cover rounded"
                                                        />
                                                        <button
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                                {formErrors.image_urls && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {formErrors.image_urls}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }));
                                        setAddModalMessage({ type: "", text: "" });
                                    }}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Enter product description"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={closeAddModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddProduct}
                                disabled={
                                    !formData.p_name ||
                                    !formData.p_category ||
                                    !formData.p_price ||
                                    formData.image_urls.length === 0 ||
                                    Object.values(formData.pack_types).filter(pack => pack.enabled).length === 0 ||
                                    addModalMessage.type === "success" ||
                                    uploadProgress > 0
                                }
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 
                                 addModalMessage.type === "success" ? "Success!" : "Add Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View/Edit Product Modal */}
            {showViewModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingProduct ? "Edit Product" : "Product Details"}
                            </h3>
                            <button
                                onClick={closeViewModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <MessageDisplay message={viewModalMessage} />
                            <ProgressBar progress={uploadProgress} />

                            {!editingProduct ? (
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-6">
                                        {selectedProduct.image_urls &&
                                        selectedProduct.image_urls.length > 0 ? (
                                            <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                <img
                                                    src={selectedProduct.image_urls[0]}
                                                    alt={selectedProduct.p_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                <ImageIcon
                                                    size={48}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                {selectedProduct.p_name}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                {selectedProduct.p_subtitle}
                                            </p>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Category:
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                        {selectedProduct.p_category ? selectedProduct.p_category.product_category : 'Uncategorized'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Price:
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {formatPrice(selectedProduct.p_price)}
                                                    </span>
                                                </div>
                                                {selectedProduct.discount_price && (
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Discounted Price:
                                                        </span>
                                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                            {formatPrice(selectedProduct.discount_price)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        SKU Number:
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {selectedProduct.sku}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Trending:
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {selectedProduct.trending ? "Yes" : "No"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Bestseller:
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {selectedProduct.bestseller ? "Yes" : "No"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Pack Types Display */}
                                    {selectedProduct.pack_types && Object.keys(selectedProduct.pack_types).length > 0 && (
                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                                <Ruler className="inline mr-2" size={16} />
                                                Pack Types & Dimensions
                                            </h5>
                                            <div className="space-y-3">
                                                {Object.entries(selectedProduct.pack_types).map(([packType, packData]) => (
                                                    <div key={packType} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {packType}
                                                            </span>
                                                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">
                                                                Enabled
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                            <div>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">Height</span>
                                                                <p className="text-sm text-gray-900 dark:text-white">
                                                                    {packData.dimensions.height} cm
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">Width</span>
                                                                <p className="text-sm text-gray-900 dark:text-white">
                                                                    {packData.dimensions.width} cm
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">Length</span>
                                                                <p className="text-sm text-gray-900 dark:text-white">
                                                                    {packData.dimensions.length} cm
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">Weight</span>
                                                                <p className="text-sm text-gray-900 dark:text-white">
                                                                    {packData.dimensions.weight} kg
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedProduct.description && (
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Description
                                            </h5>
                                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                                {selectedProduct.description}
                                            </p>
                                        </div>
                                    )}
                                    {selectedProduct.image_urls &&
                                        selectedProduct.image_urls.length > 0 && (
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Images
                                                </h5>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {selectedProduct.image_urls.map(
                                                        (url, index) => (
                                                            <img
                                                                key={index}
                                                                src={url}
                                                                alt={`Product Image ${index}`}
                                                                className="w-20 h-20 object-cover rounded"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={startEditing}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Edit size={16} />
                                            Edit Product
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Product Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.p_name}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        p_name: e.target.value,
                                                    }));
                                                    setViewModalMessage({ type: "", text: "" });
                                                    setFormErrors(prev => ({ ...prev, p_name: "" }));
                                                }}
                                                className={`w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    formErrors.p_name 
                                                        ? "border-red-300 dark:border-red-600" 
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            />
                                            {formErrors.p_name && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {formErrors.p_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Product Subtitle
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.p_subtitle}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        p_subtitle: e.target.value,
                                                    }));
                                                    setViewModalMessage({ type: "", text: "" });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Category *
                                            </label>
                                            <select
                                                value={formData.p_category}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        p_category: e.target.value,
                                                    }));
                                                    setViewModalMessage({ type: "", text: "" });
                                                    setFormErrors(prev => ({ ...prev, p_category: "" }));
                                                }}
                                                className={`w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    formErrors.p_category 
                                                        ? "border-red-300 dark:border-red-600" 
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            >
                                                <option value="">Select Category</option>
                                                {collections.map((collection) => (
                                                    <option key={collection._id} value={collection._id}>
                                                        {collection.product_category}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.p_category && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {formErrors.p_category}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Price ($) *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={formData.p_price}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        p_price: e.target.value,
                                                    }));
                                                    setViewModalMessage({ type: "", text: "" });
                                                    setFormErrors(prev => ({ ...prev, p_price: "" }));
                                                }}
                                                className={`w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    formErrors.p_price 
                                                        ? "border-red-300 dark:border-red-600" 
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            />
                                            {formErrors.p_price && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {formErrors.p_price}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Discounted Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={formData.discount_price}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        discount_price: e.target.value,
                                                    }));
                                                    setViewModalMessage({ type: "", text: "" });
                                                    setFormErrors(prev => ({ ...prev, discount_price: "" }));
                                                }}
                                                className={`w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    formErrors.discount_price 
                                                        ? "border-red-300 dark:border-red-600" 
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            />
                                            {formErrors.discount_price && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {formErrors.discount_price}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                SKU Number
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.sku}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        sku: e.target.value,
                                                    }));
                                                    setAddModalMessage({ type: "", text: "" });
                                                    setFormErrors(prev => ({ ...prev, sku: "" }));
                                                }}
                                                className={`w-full px-3 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    formErrors.sku 
                                                        ? "border-red-300 dark:border-red-600" 
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            />
                                            {formErrors.sku && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {formErrors.sku}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Simplified Pack Types Section */}
                                    <SimplePackTypesSection editing={true} />

                                    {/* Checkboxes */}
                                    <div className="flex items-center gap-4 mt-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.trending}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        trending: e.target.checked,
                                                    }));
                                                    setViewModalMessage({ type: "", text: "" });
                                                }}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Trending</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.bestseller}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        bestseller: e.target.checked,
                                                    }));
                                                    setViewModalMessage({ type: "", text: "" });
                                                }}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Bestseller</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }));
                                                setViewModalMessage({ type: "", text: "" });
                                            }}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Product Images *
                                        </label>
                                        <div className={`border-2 border-dashed rounded-lg p-4 ${
                                            formErrors.image_urls 
                                                ? "border-red-300 dark:border-red-600" 
                                                : "border-gray-300 dark:border-gray-600"
                                        }`}>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload-edit"
                                            />
                                            <label
                                                htmlFor="image-upload-edit"
                                                className="cursor-pointer flex flex-col items-center justify-center p-4"
                                            >
                                                <Upload
                                                    size={32}
                                                    className="text-gray-400 mb-2"
                                                />
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Click to upload images or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    Maximum 5MB per image
                                                </p>
                                            </label>
                                            {formData.image_urls.length > 0 && (
                                                <div className="mt-4 grid grid-cols-4 gap-2">
                                                    {formData.image_urls.map(
                                                        (image, index) => (
                                                            <div
                                                                key={index}
                                                                className="relative"
                                                            >
                                                                <img
                                                                    src={
                                                                        image.type === "new"
                                                                            ? image.preview
                                                                            : image.url
                                                                    }
                                                                    alt={`Preview ${index}`}
                                                                    className="w-20 h-20 object-cover rounded"
                                                                />
                                                                <button
                                                                    onClick={() => removeImage(index)}
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {formErrors.image_urls && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {formErrors.image_urls}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={cancelEditing}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateProduct}
                                            disabled={
                                                !formData.p_name ||
                                                !formData.p_category ||
                                                !formData.p_price ||
                                                formData.image_urls.length === 0 ||
                                                Object.values(formData.pack_types).filter(pack => pack.enabled).length === 0 ||
                                                viewModalMessage.type === "success" ||
                                                uploadProgress > 0
                                            }
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 
                                             viewModalMessage.type === "success" ? "Success!" : "Update Product"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Confirm Deletion
                            </h3>
                            <button
                                onClick={closeDeleteModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <MessageDisplay message={deleteModalMessage} />
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete{" "}
                            <strong>"{selectedProduct.p_name}"</strong>? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProduct}
                                disabled={deleteModalMessage.type === "success"}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {deleteModalMessage.type === "success"
                                    ? "Deleted!"
                                    : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsData;