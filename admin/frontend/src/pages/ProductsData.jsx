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
} from "lucide-react";
import { dataService } from "../utils/dataService";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

    // Form state
    const [formData, setFormData] = useState({
        p_id: "",
        p_name: "",
        p_subtitle: "",
        image_urls: [],
        p_category: "",
        p_price: "",
        discount_price: "",
        description: "",
        trending: false,
        bestseller: false,
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

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(
            (product) =>
                (product.p_name || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (product.p_category || "")
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
            // Error handled silently in the background
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async () => {
        try {
            setAddModalMessage({ type: "", text: "" });

            const productToCreate = {
                p_name: formData.p_name,
                p_subtitle: formData.p_subtitle,
                p_category: formData.p_category,
                p_price: parseFloat(formData.p_price),
                discount_price: parseFloat(formData.discount_price),
                description: formData.description,
                image_urls: [],
                trending: formData.trending,
                bestseller: formData.bestseller,
            };

            const createdProduct = await dataService.createProduct(
                productToCreate
            );

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

            setProducts((prev) => [updatedProductWithImages, ...prev]);
            setAddModalMessage({
                type: "success",
                text: "Product added successfully!",
            });

            setTimeout(() => {
                setShowAddModal(false);
                resetForm();
            }, 1500);
        } catch (error) {
            setAddModalMessage({
                type: "error",
                text: "Error adding product. Please try again.",
            });
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
            setDeleteModalMessage({
                type: "error",
                text: "Error deleting product. Please try again.",
            });
        }
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;

        try {
            setViewModalMessage({ type: "", text: "" });

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

            const productToUpdate = {
                p_name: formData.p_name,
                p_subtitle: formData.p_subtitle,
                p_category: formData.p_category,
                p_price: parseFloat(formData.p_price),
                discount_price: parseFloat(formData.discount_price),
                description: formData.description,
                image_urls: finalImageUrls,
                trending: formData.trending,
                bestseller: formData.bestseller,
            };

            const updatedProduct = await dataService.updateProduct(
                editingProduct._id,
                productToUpdate
            );

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
            }, 1500);
        } catch (error) {
            setViewModalMessage({
                type: "error",
                text: "Error updating product. Please try again.",
            });
        }
    };

    const resetForm = () => {
        setFormData({
            p_name: "",
            p_subtitle: "",
            image_urls: [],
            p_category: "",
            p_price: "",
            discount_price: "",
            description: "",
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            type: "new",
            file: file,
            preview: URL.createObjectURL(file),
        }));
        setFormData((prev) => ({
            ...prev,
            image_urls: [...prev.image_urls, ...newImages],
        }));
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
                // Success handled silently
            } catch (error) {
                // Error handled silently - image removal from state continues
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
        setFormData({
            p_name: product.p_name,
            p_subtitle: product.p_subtitle,
            image_urls: product.image_urls
                ? product.image_urls.map((url) => ({
                      type: "existing",
                      url: url,
                      public_id: extractPublicId(url),
                  }))
                : [],
            p_category: product.p_category,
            p_price: product.p_price.toString(),
            discount_price: product.discount_price?.toString() || "",
            description: product.description || "",
            trending: product.trending || false,
            bestseller: product.bestseller || false,
        });
        setViewModalMessage({ type: "", text: "" });
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
    };

    const cancelEditing = () => {
        setEditingProduct(null);
        if (selectedProduct) {
            setFormData({
                p_name: selectedProduct.p_name,
                p_subtitle: selectedProduct.p_subtitle,
                image_urls: selectedProduct.image_urls
                    ? selectedProduct.image_urls.map((url) => ({
                          type: "existing",
                          url: url,
                          public_id: extractPublicId(url),
                      }))
                    : [],
                p_category: selectedProduct.p_category,
                p_price: selectedProduct.p_price.toString(),
                discount_price:
                    selectedProduct.discount_price?.toString() || "",
                description: selectedProduct.description || "",
                trending: selectedProduct.trending || false,
                bestseller: selectedProduct.bestseller || false,
            });
        }
        setViewModalMessage({ type: "", text: "" });
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setAddModalMessage({ type: "", text: "" });
        resetForm();
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setEditingProduct(null);
        setViewModalMessage({ type: "", text: "" });
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedProduct(null);
        setDeleteModalMessage({ type: "", text: "" });
    };

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
                                Discounted Price
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredProducts.map((product, index) => (
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
                                                    ? product.description.split(
                                                          " "
                                                      ).length > 4
                                                        ? product.description
                                                              .split(" ")
                                                              .slice(0, 4)
                                                              .join(" ") + "..."
                                                        : product.description
                                                    : "No description"}
                                            </p>{" "}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                        {product.p_category}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    {product.p_price
                                        ? `$${product.p_price.toLocaleString()}`
                                        : "N/A"}
                                </td>
                                <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    {product.discount_price
                                        ? `$${product.discount_price.toLocaleString()}`
                                        : "N/A"}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() =>
                                                openViewModal(product)
                                            }
                                            className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                openDeleteModal(product)
                                            }
                                            className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                                            title="Delete Product"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                                            setAddModalMessage({
                                                type: "",
                                                text: "",
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter product name"
                                    />
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
                                            setAddModalMessage({
                                                type: "",
                                                text: "",
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter product subtitle"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.p_category}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                p_category: e.target.value,
                                            }));
                                            setAddModalMessage({
                                                type: "",
                                                text: "",
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter category"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.p_price}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                p_price: e.target.value,
                                            }));
                                            setAddModalMessage({
                                                type: "",
                                                text: "",
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter price"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Discounted Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.discount_price}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                discount_price: e.target.value,
                                            }));
                                            setAddModalMessage({
                                                type: "",
                                                text: "",
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter discounted price"
                                    />
                                </div>
                                {/* Radio buttons */}
                                <div className="flex items-center gap-3 mt-6">
                                    <label className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.trending}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    trending: e.target.checked,
                                                }))
                                            }
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Trending
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.bestseller}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    bestseller:
                                                        e.target.checked,
                                                }))
                                            }
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Bestseller
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Product Images
                                </label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
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
                                        <ImageIcon
                                            size={32}
                                            className="text-gray-400 mb-2"
                                        />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Click to upload images or drag and
                                            drop
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
                                                                image.type ===
                                                                "new"
                                                                    ? image.preview
                                                                    : image.url
                                                            }
                                                            alt={`Preview ${index}`}
                                                            className="w-20 h-20 object-cover rounded"
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
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
                                        setAddModalMessage({
                                            type: "",
                                            text: "",
                                        });
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
                                    addModalMessage.type === "success"
                                }
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {addModalMessage.type === "success"
                                    ? "Success!"
                                    : "Add Product"}
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
                                {editingProduct
                                    ? "Edit Product"
                                    : "Product Details"}
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

                            {!editingProduct ? (
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-6">
                                        {selectedProduct.image_urls &&
                                        selectedProduct.image_urls.length >
                                            0 ? (
                                            <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                <img
                                                    src={
                                                        selectedProduct
                                                            .image_urls[0]
                                                    }
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
                                                        {
                                                            selectedProduct.p_category
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Price:
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        $
                                                        {selectedProduct.p_price.toLocaleString()}
                                                    </span>
                                                </div>
                                                {selectedProduct.discount_price && (
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Discounted Price:
                                                        </span>
                                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                            $
                                                            {selectedProduct.discount_price.toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
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
                                        selectedProduct.image_urls.length >
                                            0 && (
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
                                                    setViewModalMessage({
                                                        type: "",
                                                        text: "",
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
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
                                                        p_subtitle:
                                                            e.target.value,
                                                    }));
                                                    setViewModalMessage({
                                                        type: "",
                                                        text: "",
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Category *
                                            </label>
                                            <input
                                                value={formData.p_category}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        p_category:
                                                            e.target.value,
                                                    }));
                                                    setViewModalMessage({
                                                        type: "",
                                                        text: "",
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Price ($) *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.p_price}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        p_price: e.target.value,
                                                    }));
                                                    setViewModalMessage({
                                                        type: "",
                                                        text: "",
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Discounted Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.discount_price}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        discount_price:
                                                            e.target.value,
                                                    }));
                                                    setViewModalMessage({
                                                        type: "",
                                                        text: "",
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
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
                                                setViewModalMessage({
                                                    type: "",
                                                    text: "",
                                                });
                                            }}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Product Images
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
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
                                                <ImageIcon
                                                    size={32}
                                                    className="text-gray-400 mb-2"
                                                />
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Click to upload images or
                                                    drag and drop
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
                                                                        image.type ===
                                                                        "new"
                                                                            ? image.preview
                                                                            : image.url
                                                                    }
                                                                    alt={`Preview ${index}`}
                                                                    className="w-20 h-20 object-cover rounded"
                                                                />
                                                                <button
                                                                    onClick={() =>
                                                                        removeImage(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                                >
                                                                    <X
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
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
                                                viewModalMessage.type ===
                                                    "success"
                                            }
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {viewModalMessage.type === "success"
                                                ? "Success!"
                                                : "Update Product"}
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
