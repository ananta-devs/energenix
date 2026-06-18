// pages/ProductsData.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
} from "lucide-react";
import { dataService } from "../utils/dataService";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const PACK_TYPES = [
    { id: "Pack of 1", label: "Pack of 1", defaultEnabled: true },
    { id: "Pack of 2", label: "Pack of 2", defaultEnabled: true },
    { id: "Pack of 4", label: "Pack of 4", defaultEnabled: true },
];

const INITIAL_FORM_DATA = {
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
            enabled: true,
        },
        "Pack of 2": {
            dimensions: { height: "", width: "", length: "", weight: "" },
            enabled: true,
        },
        "Pack of 4": {
            dimensions: { height: "", width: "", length: "", weight: "" },
            enabled: true,
        },
    },
};

// Message Display Component (Extracted)
const MessageDisplay = ({ message }) => {
    if (!message?.text) return null;

    const isSuccess = message.type === "success";
    const Icon = isSuccess ? CheckCircle : XCircle;

    return (
        <div
            className={`rounded-lg p-3 ${
                isSuccess
                    ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
            }`}
        >
            <div className="flex items-center gap-2">
                <Icon
                    size={16}
                    className={
                        isSuccess
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                    }
                />
                <p
                    className={`text-sm ${
                        isSuccess
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

// Progress Bar Component (Extracted)
const ProgressBar = ({ progress }) => {
    if (!progress) return null;

    return (
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

// Pack Types Section Component (Extracted)
const PackTypesSection = ({
    formData,
    formErrors,
    editing,
    onDimensionChange,
}) => {
    return (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                <Ruler className="inline mr-2" size={16} />
                Pack Types & Dimensions
            </h4>

            <div className="space-y-3">
                {PACK_TYPES.map(({ id, label }) => {
                    const packData = formData.pack_types[label];
                    const isEnabled = packData.enabled;

                    return (
                        <div
                            key={id}
                            className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                                isEnabled
                                    ? "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20"
                                    : "border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            {/* Pack Type Header */}
                            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-sm font-medium ${
                                                isEnabled
                                                    ? "text-blue-700 dark:text-blue-300"
                                                    : "text-gray-600 dark:text-gray-400"
                                            }`}
                                        >
                                            {label}
                                        </span>
                                        {isEnabled && (
                                            <CheckCircle
                                                size={14}
                                                className="text-green-600 dark:text-green-400"
                                            />
                                        )}
                                    </div>
                                </div>
                                {editing && (
                                    <div className="flex items-center gap-2"></div>
                                )}
                            </div>

                            {/* Dimensions Section */}
                            {editing && isEnabled && (
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <div className="mb-3">
                                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Dimensions for {label}
                                        </h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                            Enter dimensions in centimeters (cm)
                                            and weight in grams (gm)
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            "height",
                                            "width",
                                            "length",
                                            "weight",
                                        ].map((field) => (
                                            <div key={field}>
                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                                                    {field}{" "}
                                                    {field === "weight"
                                                        ? "(gm)"
                                                        : "(cm)"}{" "}
                                                    *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={
                                                        packData.dimensions[
                                                            field
                                                        ]
                                                    }
                                                    onChange={(e) =>
                                                        onDimensionChange(
                                                            label,
                                                            field,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 text-sm border dark:text-white rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        formErrors[
                                                            `${label}_${field}`
                                                        ]
                                                            ? "border-red-300 dark:border-red-600"
                                                            : "border-gray-300 dark:border-gray-600"
                                                    }`}
                                                    placeholder={`Enter ${field}`}
                                                />
                                                {formErrors[
                                                    `${label}_${field}`
                                                ] && (
                                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                        {
                                                            formErrors[
                                                                `${label}_${field}`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {formErrors.pack_types && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                    {formErrors.pack_types}
                </p>
            )}
        </div>
    );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
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

// Helper Functions
const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
    }).format(price);
};

const formatDimensions = (dimensions) => {
    if (!dimensions) return "N/A";
    return `${dimensions.height}×${dimensions.width}×${dimensions.length} cm, ${dimensions.weight} gm`;
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

const ProductsData = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [collections, setCollections] = useState([]);

    // Message states
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

    // Memoized filtered products
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;

        const term = searchTerm.toLowerCase();
        return products.filter(
            (product) =>
                (product.p_name || "").toLowerCase().includes(term) ||
                (product.p_category?.c_name || "").toLowerCase().includes(term)
        );
    }, [searchTerm, products]);

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsData, collectionsData] = await Promise.all([
                    dataService.getProducts(),
                    dataService.getCollections(),
                ]);

                setProducts(productsData);
                setCollections(collectionsData);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const validateForm = useCallback(() => {
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

        if (
            formData.discount_price &&
            parseFloat(formData.discount_price) >= parseFloat(formData.p_price)
        ) {
            errors.discount_price =
                "Discount price must be less than regular price";
        }

        if (formData.image_urls.length === 0) {
            errors.image_urls = "At least one image is required";
        }

        // Validate at least one pack type is enabled
        const enabledPackTypes = Object.values(formData.pack_types).filter(
            (pack) => pack.enabled
        );
        if (enabledPackTypes.length === 0) {
            errors.pack_types = "At least one pack type must be enabled";
        }

        // Validate dimensions for enabled pack types
        Object.entries(formData.pack_types).forEach(([packType, packData]) => {
            if (packData.enabled) {
                Object.entries(packData.dimensions).forEach(
                    ([field, value]) => {
                        if (!value || parseFloat(value) <= 0) {
                            errors[`${packType}_${field}`] = `${
                                field.charAt(0).toUpperCase() + field.slice(1)
                            } is required for ${packType}`;
                        }
                    }
                );
            }
        });

        return errors;
    }, [formData]);

    // Image upload handler with 20MB size
    const handleImageUpload = useCallback((e) => {
        const files = Array.from(e.target.files);

        const validFiles = files.filter((file) => {
            if (!file.type.startsWith("image/")) {
                alert(`${file.name} is not an image file`);
                return false;
            }
            if (file.size > 20 * 1024 * 1024) {
                alert(`${file.name} is too large (max 20MB)`);
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
        setFormErrors((prev) => ({ ...prev, image_urls: "" }));
    }, []);

    // Remove image handler
    const removeImage = useCallback(
        async (indexToRemove) => {
            const imageToRemove = formData.image_urls[indexToRemove];

            if (imageToRemove.type === "new") {
                URL.revokeObjectURL(imageToRemove.preview);
            } else if (imageToRemove.type === "existing") {
                try {
                    await dataService.deleteImage(imageToRemove.public_id);
                } catch (error) {
                    console.error(
                        "Error deleting image from Cloudinary:",
                        error
                    );
                }
            }

            setFormData((prev) => ({
                ...prev,
                image_urls: prev.image_urls.filter(
                    (_, i) => i !== indexToRemove
                ),
            }));
        },
        [formData.image_urls]
    );

    // Form data handlers
    const updateFormField = useCallback(
        (field, value) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            if (formErrors[field]) {
                setFormErrors((prev) => ({ ...prev, [field]: "" }));
            }
        },
        [formErrors]
    );

    const handleDimensionChange = useCallback((packType, field, value) => {
        setFormData((prev) => ({
            ...prev,
            pack_types: {
                ...prev.pack_types,
                [packType]: {
                    ...prev.pack_types[packType],
                    dimensions: {
                        ...prev.pack_types[packType].dimensions,
                        [field]: value,
                    },
                },
            },
        }));
        setFormErrors((prev) => ({ ...prev, [`${packType}_${field}`]: "" }));
    }, []);

    // Product CRUD operations
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

            // Prepare product data
            const weightAndDimensions = {};
            Object.entries(formData.pack_types).forEach(
                ([packType, packData]) => {
                    if (packData.enabled) {
                        weightAndDimensions[packType] = {
                            height: parseFloat(packData.dimensions.height),
                            width: parseFloat(packData.dimensions.width),
                            length: parseFloat(packData.dimensions.length),
                            weight: parseFloat(packData.dimensions.weight),
                        };
                    }
                }
            );

            const productToCreate = {
                p_name: formData.p_name.trim(),
                p_subtitle: formData.p_subtitle.trim(),
                sku: formData.sku ? formData.sku.trim() : "",
                p_category: formData.p_category,
                p_price: parseFloat(formData.p_price),
                discount_price: formData.discount_price
                    ? parseFloat(formData.discount_price)
                    : null,
                description: formData.description.trim(),
                image_urls: [],
                trending: formData.trending,
                bestseller: formData.bestseller,
                "weight&dimensio": weightAndDimensions, // Changed to the new field
            };

            const createdProduct = await dataService.createProduct(
                productToCreate
            );
            setUploadProgress(30);

            // Upload new images
            const newImagesToUpload = formData.image_urls.filter(
                (img) => img.type === "new"
            );
            let uploadedCloudinaryUrls = [];

            if (newImagesToUpload.length > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append("p_id", createdProduct._id);
                newImagesToUpload.forEach((image) => {
                    uploadFormData.append("image", image.file);
                });

                const uploadResponse = await axios.post(
                    `${API_BASE}/api/upload`,
                    uploadFormData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round(
                                (progressEvent.loaded * 70) /
                                    progressEvent.total
                            );
                            setUploadProgress(30 + progress);
                        },
                    }
                );

                uploadedCloudinaryUrls = uploadResponse.data.imageUrls;
            }

            // Combine all image URLs
            const existingImageUrls = formData.image_urls
                .filter((img) => img.type === "existing")
                .map((img) => img.url);

            const finalImageUrls = [
                ...existingImageUrls,
                ...uploadedCloudinaryUrls,
            ];

            // Update product with image URLs
            const updatedProductWithImages = await dataService.updateProduct(
                createdProduct._id,
                { image_urls: finalImageUrls }
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

            // Upload new images
            const newImagesToUpload = formData.image_urls.filter(
                (img) => img.type === "new"
            );
            let uploadedCloudinaryUrls = [];

            if (newImagesToUpload.length > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append("p_id", editingProduct._id);
                newImagesToUpload.forEach((image) => {
                    uploadFormData.append("image", image.file);
                });

                const uploadResponse = await axios.post(
                    `${API_BASE}/api/upload`,
                    uploadFormData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round(
                                (progressEvent.loaded * 70) /
                                    progressEvent.total
                            );
                            setUploadProgress(30 + progress);
                        },
                    }
                );
                uploadedCloudinaryUrls = uploadResponse.data.imageUrls;
            }

            // Combine all image URLs
            const existingImageUrls = formData.image_urls
                .filter((img) => img.type === "existing")
                .map((img) => img.url);

            const finalImageUrls = [
                ...existingImageUrls,
                ...uploadedCloudinaryUrls,
            ];

            // Prepare pack types
            const weightAndDimensions = {};
            Object.entries(formData.pack_types).forEach(
                ([packType, packData]) => {
                    if (packData.enabled) {
                        weightAndDimensions[packType] = {
                            height: parseFloat(packData.dimensions.height),
                            width: parseFloat(packData.dimensions.width),
                            length: parseFloat(packData.dimensions.length),
                            weight: parseFloat(packData.dimensions.weight),
                        };
                    }
                }
            );

            const productToUpdate = {
                p_name: formData.p_name.trim(),
                p_subtitle: formData.p_subtitle.trim(),
                sku: formData.sku ? formData.sku.trim() : "",
                p_category: formData.p_category,
                p_price: parseFloat(formData.p_price),
                discount_price: formData.discount_price
                    ? parseFloat(formData.discount_price)
                    : null,
                description: formData.description.trim(),
                image_urls: finalImageUrls,
                trending: formData.trending,
                bestseller: formData.bestseller,
                "weight&dimensio": weightAndDimensions, // Changed to the new field
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

    // Modal handlers
    const openViewModal = useCallback((product) => {
        setSelectedProduct(product);

        const weightAndDimensio = product["weight&dimensio"];
        const oldPackTypes = product.pack_types;

        const getDimensions = (pack) => {
            if (weightAndDimensio && weightAndDimensio[pack]) {
                return weightAndDimensio[pack];
            }
            if (oldPackTypes && oldPackTypes[pack]) {
                return oldPackTypes[pack].dimensions;
            }
            return { height: "", width: "", length: "", weight: "" };
        };

        const isEnabled = (pack) => {
            if (weightAndDimensio && weightAndDimensio[pack]) {
                return true;
            }
            if (oldPackTypes && oldPackTypes[pack]) {
                return true;
            }
            return false;
        };

        const formDataFromProduct = {
            p_name: product.p_name,
            p_subtitle: product.p_subtitle,
            sku: product.sku,
            image_urls:
                product.image_urls?.map((url) => ({
                    type: "existing",
                    url: url,
                    public_id: extractPublicId(url),
                })) || [],
            p_category: product.p_category?._id || "",
            p_price: product.p_price?.toString() || "",
            discount_price: product.discount_price?.toString() || "",
            description: product.description || "",
            trending: product.trending || false,
            bestseller: product.bestseller || false,
            pack_types: {
                "Pack of 1": {
                    dimensions: getDimensions("Pack of 1"),
                    enabled: isEnabled("Pack of 1"),
                },
                "Pack of 2": {
                    dimensions: getDimensions("Pack of 2"),
                    enabled: isEnabled("Pack of 2"),
                },
                "Pack of 4": {
                    dimensions: getDimensions("Pack of 4"),
                    enabled: isEnabled("Pack of 4"),
                },
            },
        };

        setFormData(formDataFromProduct);
        setViewModalMessage({ type: "", text: "" });
        setFormErrors({});
        setShowViewModal(true);
    }, []);

    const openDeleteModal = useCallback((product) => {
        setSelectedProduct(product);
        setDeleteModalMessage({ type: "", text: "" });
        setShowDeleteModal(true);
    }, []);

    const startEditing = useCallback(() => {
        setEditingProduct(selectedProduct);
        setViewModalMessage({ type: "", text: "" });
        setFormErrors({});
    }, [selectedProduct]);

    const cancelEditing = useCallback(() => {
        setEditingProduct(null);
        if (selectedProduct) {
            openViewModal(selectedProduct);
        }
    }, [selectedProduct, openViewModal]);

    const resetForm = useCallback(() => {
        setFormData(INITIAL_FORM_DATA);
        setFormErrors({});
    }, []);

    const closeAddModal = useCallback(() => {
        setShowAddModal(false);
        setAddModalMessage({ type: "", text: "" });
        resetForm();
        setUploadProgress(0);
    }, [resetForm]);

    const closeViewModal = useCallback(() => {
        setShowViewModal(false);
        setEditingProduct(null);
        setViewModalMessage({ type: "", text: "" });
        setUploadProgress(0);
    }, []);

    const closeDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
        setSelectedProduct(null);
        setDeleteModalMessage({ type: "", text: "" });
    }, []);

    // Render loading state
    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Header and Search */}
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
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 dark:text-white    rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
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

            {/* Products Table */}
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
                        {filteredProducts.map((product) => {
                            const weightAndDimensions =
                                product["weight&dimensio"] || {};
                            const enabledPackTypes =
                                Object.keys(weightAndDimensions);
                            const firstPackType = enabledPackTypes[0];
                            const firstDimensions = firstPackType
                                ? weightAndDimensions[firstPackType]
                                : null;

                            return (
                                <tr
                                    key={product._id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                    <td className="py-3 px-4">
                                        <ProductCell product={product} />
                                    </td>
                                    <td className="py-3 px-4">
                                        <CategoryCell product={product} />
                                    </td>
                                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        {formatPrice(product.p_price)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                        <DimensionsCell
                                            dimensions={firstDimensions}
                                            enabledPackTypes={enabledPackTypes}
                                        />
                                    </td>
                                    <td className="py-3 px-4">
                                        <ActionButtons
                                            product={product}
                                            onView={openViewModal}
                                            onDelete={openDeleteModal}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        No products found
                    </p>
                </div>
            )}

            {/* Modals */}
            <AddProductModal
                show={showAddModal}
                onClose={closeAddModal}
                formData={formData}
                formErrors={formErrors}
                collections={collections}
                message={addModalMessage}
                progress={uploadProgress}
                onFormChange={updateFormField}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                onDimensionChange={handleDimensionChange}
                onSubmit={handleAddProduct}
                isSubmitting={
                    uploadProgress > 0 || addModalMessage.type === "success"
                }
            />

            <ViewEditProductModal
                show={showViewModal}
                onClose={closeViewModal}
                product={selectedProduct}
                editing={editingProduct}
                formData={formData}
                formErrors={formErrors}
                collections={collections}
                message={viewModalMessage}
                progress={uploadProgress}
                onFormChange={updateFormField}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                onDimensionChange={handleDimensionChange}
                onStartEditing={startEditing}
                onCancelEditing={cancelEditing}
                onUpdate={handleUpdateProduct}
                isSubmitting={
                    uploadProgress > 0 || viewModalMessage.type === "success"
                }
            />

            <DeleteProductModal
                show={showDeleteModal}
                onClose={closeDeleteModal}
                product={selectedProduct}
                message={deleteModalMessage}
                onDelete={handleDeleteProduct}
            />
        </div>
    );
};

// Extracted Table Cell Components
const ProductCell = ({ product }) => (
    <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            {product.image_urls?.length > 0 ? (
                <img
                    src={product.image_urls[0]}
                    alt={product.p_name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <ImageIcon size={20} className="text-gray-400" />
            )}
        </div>
        <div>
            <p className="font-medium text-gray-900 dark:text-white">
                {product.p_name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                {product.description
                    ? product.description.split(" ").length > 4
                        ? product.description.split(" ").slice(0, 4).join(" ") +
                          "..."
                        : product.description
                    : "No description"}
            </p>
        </div>
    </div>
);

const CategoryCell = ({ product }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        {product.p_category
            ? product.p_category.product_category
            : "Uncategorized"}
    </span>
);

const DimensionsCell = ({ dimensions, enabledPackTypes }) =>
    dimensions ? (
        <div>
            <div className="flex items-center gap-1 mb-1">
                <Ruler size={14} className="text-gray-400" />
                <span>{formatDimensions(dimensions)}</span>
            </div>
            {enabledPackTypes.length > 1 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{enabledPackTypes.length - 1} more pack type(s)
                </span>
            )}
        </div>
    ) : (
        "No dimensions set"
    );

const ActionButtons = ({ product, onView, onDelete }) => (
    <div className="flex items-center space-x-2">
        <button
            onClick={() => onView(product)}
            className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
            title="View Details"
        >
            <Eye size={16} />
        </button>
        <button
            onClick={() => onDelete(product)}
            className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
            title="Delete Product"
        >
            <Trash2 size={16} />
        </button>
    </div>
);

// Modal Components
const AddProductModal = ({
    show,
    onClose,
    formData,
    formErrors,
    collections,
    message,
    progress,
    onFormChange,
    onImageUpload,
    onRemoveImage,
    onDimensionChange,
    onSubmit,
    isSubmitting,
}) => {
    if (!show) return null;

    const isFormValid =
        formData.p_name &&
        formData.p_category &&
        formData.p_price &&
        formData.image_urls.length > 0 &&
        Object.values(formData.pack_types).filter((pack) => pack.enabled)
            .length > 0;

    return (
        <ModalWrapper title="Add New Product" onClose={onClose}>
            <MessageDisplay message={message} />
            <ProgressBar progress={progress} />

            <FormFields
                formData={formData}
                formErrors={formErrors}
                collections={collections}
                onFormChange={onFormChange}
                onImageUpload={onImageUpload}
                onRemoveImage={onRemoveImage}
            />

            <PackTypesSection
                formData={formData}
                formErrors={formErrors}
                editing={true}
                onDimensionChange={onDimensionChange}
            />

            <CheckboxSection formData={formData} onFormChange={onFormChange} />

            <DescriptionSection
                formData={formData}
                onFormChange={onFormChange}
            />

            <ModalActions
                onCancel={onClose}
                onSubmit={onSubmit}
                submitLabel={
                    progress > 0
                        ? `Uploading... ${progress}%`
                        : message.type === "success"
                        ? "Success!"
                        : "Add Product"
                }
                disabled={!isFormValid || isSubmitting}
            />
        </ModalWrapper>
    );
};

const ViewEditProductModal = ({
    show,
    onClose,
    product,
    editing,
    formData,
    formErrors,
    collections,
    message,
    progress,
    onFormChange,
    onImageUpload,
    onRemoveImage,
    onDimensionChange,
    onStartEditing,
    onCancelEditing,
    onUpdate,
    isSubmitting,
}) => {
    if (!show || !product) return null;

    const isFormValid =
        formData.p_name &&
        formData.p_category &&
        formData.p_price &&
        formData.image_urls.length > 0 &&
        Object.values(formData.pack_types).filter((pack) => pack.enabled)
            .length > 0;

    return (
        <ModalWrapper
            title={editing ? "Edit Product" : "Product Details"}
            onClose={onClose}
        >
            <MessageDisplay message={message} />
            <ProgressBar progress={progress} />

            {!editing ? (
                <ProductDetailsView product={product} onEdit={onStartEditing} />
            ) : (
                <>
                    <FormFields
                        formData={formData}
                        formErrors={formErrors}
                        collections={collections}
                        onFormChange={onFormChange}
                        onImageUpload={onImageUpload}
                        onRemoveImage={onRemoveImage}
                    />

                    <PackTypesSection
                        formData={formData}
                        formErrors={formErrors}
                        editing={true}
                        onDimensionChange={onDimensionChange}
                    />

                    <CheckboxSection
                        formData={formData}
                        onFormChange={onFormChange}
                    />
                    <DescriptionSection
                        formData={formData}
                        onFormChange={onFormChange}
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onCancelEditing}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onUpdate}
                            disabled={!isFormValid || isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {progress > 0
                                ? `Uploading... ${progress}%`
                                : message.type === "success"
                                ? "Success!"
                                : "Update Product"}
                        </button>
                    </div>
                </>
            )}
        </ModalWrapper>
    );
};

const DeleteProductModal = ({ show, onClose, product, message, onDelete }) => {
    if (!show || !product) return null;

    return (
        <ModalWrapper title="Confirm Deletion" onClose={onClose}>
            <MessageDisplay message={message} />
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete{" "}
                <strong>"{product.p_name}"</strong>? This action cannot be
                undone.
            </p>
            <ModalActions
                onCancel={onClose}
                onSubmit={onDelete}
                submitLabel={message.type === "success" ? "Deleted!" : "Delete"}
                disabled={message.type === "success"}
                submitStyle="bg-red-600 hover:bg-red-700"
            />
        </ModalWrapper>
    );
};

// Reusable Modal Components
const ModalWrapper = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <X size={24} />
                </button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

const ModalActions = ({
    onCancel,
    onSubmit,
    submitLabel,
    disabled,
    submitStyle = "bg-blue-600 hover:bg-blue-700",
}) => (
    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
            Cancel
        </button>
        <button
            onClick={onSubmit}
            disabled={disabled}
            className={`px-4 py-2 text-sm font-medium text-white ${submitStyle} rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
            {submitLabel}
        </button>
    </div>
);

// Form Components
const FormFields = ({
    formData,
    formErrors,
    collections,
    onFormChange,
    onImageUpload,
    onRemoveImage,
}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
            label="Product Name *"
            value={formData.p_name}
            onChange={(e) => onFormChange("p_name", e.target.value)}
            error={formErrors.p_name}
        />
        <FormInput
            label="Product Subtitle"
            value={formData.p_subtitle}
            onChange={(e) => onFormChange("p_subtitle", e.target.value)}
        />
        <FormSelect
            label="Category *"
            value={formData.p_category}
            options={collections}
            onChange={(e) => onFormChange("p_category", e.target.value)}
            error={formErrors.p_category}
        />
        <FormInput
            label="Price ($) *"
            type="number"
            step="0.01"
            value={formData.p_price}
            onChange={(e) => onFormChange("p_price", e.target.value)}
            error={formErrors.p_price}
        />
        <FormInput
            label="Discounted Price ($)"
            type="number"
            step="0.01"
            value={formData.discount_price}
            onChange={(e) => onFormChange("discount_price", e.target.value)}
            error={formErrors.discount_price}
        />
        <FormInput
            label="SKU Number"
            value={formData.sku}
            onChange={(e) => onFormChange("sku", e.target.value)}
            error={formErrors.sku}
        />

        <ImageUploadSection
            formData={formData}
            formErrors={formErrors}
            onImageUpload={onImageUpload}
            onRemoveImage={onRemoveImage}
        />
    </div>
);

const FormInput = ({
    label,
    type = "text",
    value,
    onChange,
    error,
    ...props
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-300 dark:border-gray-600"
            }`}
            {...props}
        />
        {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
            </p>
        )}
    </div>
);

const FormSelect = ({ label, value, options, onChange, error }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
        </label>
        <select
            value={value}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-300 dark:border-gray-600"
            }`}
        >
            <option value="">Select Category</option>
            {options.map((collection) => (
                <option key={collection._id} value={collection._id}>
                    {collection.product_category}
                </option>
            ))}
        </select>
        {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
            </p>
        )}
    </div>
);

const ImageUploadSection = ({
    formData,
    formErrors,
    onImageUpload,
    onRemoveImage,
}) => (
    <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Images *
        </label>
        <div
            className={`border-2 border-dashed rounded-lg p-4 ${
                formErrors.image_urls
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-300 dark:border-gray-600"
            }`}
        >
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                id="image-upload"
            />
            <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center p-4"
            >
                <Upload size={32} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to upload images or drag and drop
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Maximum 20MB per image
                </p>
            </label>
            {formData.image_urls.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                    {formData.image_urls.map((image, index) => (
                        <div key={index} className="relative">
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
                                onClick={() => onRemoveImage(index)}
                                className="absolute -top-2 right-27 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        {formErrors.image_urls && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.image_urls}
            </p>
        )}
    </div>
);

const CheckboxSection = ({ formData, onFormChange }) => (
    <div className="flex items-center gap-3 mt-6">
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={formData.trending}
                onChange={(e) => onFormChange("trending", e.target.checked)}
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
                onChange={(e) => onFormChange("bestseller", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
                Bestseller
            </span>
        </label>
    </div>
);

const DescriptionSection = ({ formData, onFormChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
        </label>
        <textarea
            value={formData.description}
            onChange={(e) => onFormChange("description", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter product description"
        />
    </div>
);

const ProductDetailsView = ({ product, onEdit }) => (
    <div className="space-y-6">
        <div className="flex items-start space-x-6">
            {product.image_urls?.length > 0 ? (
                <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                        src={product.image_urls[0]}
                        alt={product.p_name}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-400" />
                </div>
            )}
            <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.p_name}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {product.p_subtitle}
                </p>
                <div className="space-y-2">
                    <DetailItem
                        label="Category:"
                        value={
                            product.p_category?.product_category ||
                            "Uncategorized"
                        }
                        badge
                    />
                    <DetailItem
                        label="Price:"
                        value={formatPrice(product.p_price)}
                    />
                    {product.discount_price && (
                        <DetailItem
                            label="Discounted Price:"
                            value={formatPrice(product.discount_price)}
                        />
                    )}
                    <DetailItem label="SKU Number:" value={product.sku} />
                    <DetailItem
                        label="Trending:"
                        value={product.trending ? "Yes" : "No"}
                    />
                    <DetailItem
                        label="Bestseller:"
                        value={product.bestseller ? "Yes" : "No"}
                    />
                </div>
            </div>
        </div>

        {/* Pack Types Display */}
        {product["weight&dimensio"] &&
            Object.keys(product["weight&dimensio"]).length > 0 && (
                <PackTypesDisplay packTypes={product["weight&dimensio"]} />
            )}

        {product.description && (
            <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                </h5>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {product.description}
                </p>
            </div>
        )}
        {product.image_urls?.length > 0 && (
            <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Images
                </h5>
                <div className="grid grid-cols-4 gap-2">
                    {product.image_urls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Product Image ${index}`}
                            className="w-20 h-20 object-cover rounded"
                        />
                    ))}
                </div>
            </div>
        )}
        <div className="flex justify-end">
            <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Edit size={16} />
                Edit Product
            </button>
        </div>
    </div>
);

const DetailItem = ({ label, value, badge = false }) => (
    <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </span>
        {badge ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {value}
            </span>
        ) : (
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {value}
            </span>
        )}
    </div>
);

const PackTypesDisplay = ({ packTypes }) => (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            <Ruler className="inline mr-2" size={16} />
            Pack Types & Dimensions
        </h5>
        <div className="space-y-3">
            {Object.entries(packTypes).map(([packType, packData]) => (
                <div
                    key={packType}
                    className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg"
                >
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
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Height
                            </span>
                            <p className="text-sm text-gray-900 dark:text-white">
                                {packData.height} cm
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Width
                            </span>
                            <p className="text-sm text-gray-900 dark:text-white">
                                {packData.width} cm
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Length
                            </span>
                            <p className="text-sm text-gray-900 dark:text-white">
                                {packData.length} cm
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Weight
                            </span>
                            <p className="text-sm text-gray-900 dark:text-white">
                                {packData.weight} gm
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ProductsData;