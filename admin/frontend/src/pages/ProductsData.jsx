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
    IndianRupee,
} from "lucide-react";
import { dataService } from "../utils/dataService";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL; // Use environment variable for API_BASE

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
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async () => {
        try {
            // 1. Create product without Cloudinary image URLs initially

            const productToCreate = {
                p_name: formData.p_name,

                p_subtitle: formData.p_subtitle,

                p_category: formData.p_category,

                p_price: parseFloat(formData.p_price),

                discount_price: parseFloat(formData.discount_price),

                description: formData.description,

                image_urls: [], // Start with empty image_urls
            };

            const createdProduct = await dataService.createProduct(
                productToCreate
            );

            let uploadedCloudinaryUrls = [];

            const newImagesToUpload = formData.image_urls.filter(
                (img) => img.type === "new"
            );

            // 2. If new local images exist, upload them to Cloudinary

            if (newImagesToUpload.length > 0) {
                const uploadFormData = new FormData();

                uploadFormData.append("p_id", createdProduct._id); // Use the new product's _id

                newImagesToUpload.forEach((image, index) => {
                    uploadFormData.append(`image`, image.file); // 'image' is the field name expected by backend
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

            // 3. Update the newly created product with the Cloudinary URLs

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

            setShowAddModal(false);

            resetForm();

            alert("Product added successfully!");
        } catch (error) {
            console.error("Error adding product:", error);

            alert("Error adding product. Please try again.");
        }
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;

        try {
            await dataService.deleteProduct(selectedProduct._id);

            setProducts((prev) =>
                prev.filter((p) => p._id !== selectedProduct._id)
            );
            setShowDeleteModal(false);
            setSelectedProduct(null);
            alert("Product deleted successfully!");
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product. Please try again.");
        }
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;

        try {
            let uploadedCloudinaryUrls = [];
            const newImagesToUpload = formData.image_urls.filter(
                (img) => img.type === "new"
            );

            // 1. Upload new local images to Cloudinary
            if (newImagesToUpload.length > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append("p_id", editingProduct._id); // Use the existing product's _id

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

            // 2. Construct the final image_urls array
            const finalImageUrls = [
                ...formData.image_urls
                    .filter((img) => img.type === "existing")
                    .map((img) => img.url),
                ...uploadedCloudinaryUrls,
            ];

            // 3. Prepare product data for update
            const productToUpdate = {
                p_name: formData.p_name,
                p_subtitle: formData.p_subtitle,
                p_category: formData.p_category,
                p_price: parseFloat(formData.p_price),
                discount_price: parseFloat(formData.discount_price),
                description: formData.description,
                image_urls: finalImageUrls,
            };

            // 4. Update the product in the backend
            const updatedProduct = await dataService.updateProduct(
                editingProduct._id,
                productToUpdate
            );

            setProducts((prev) =>
                prev.map((p) =>
                    p._id === updatedProduct._id ? updatedProduct : p
                )
            );
            setShowViewModal(false);
            setEditingProduct(null);
            resetForm();
            alert("Product updated successfully!");
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error updating product. Please try again.");
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
            URL.revokeObjectURL(imageToRemove.preview); // Clean up local object URL
        } else if (imageToRemove.type === "existing") {
            try {
                // Call backend to delete from Cloudinary
                await axios.delete(`${API_BASE}/api/upload`, {
                    data: { public_id: imageToRemove.public_id },
                });
                alert("Image deleted from Cloudinary successfully!");
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
                alert(
                    "Error deleting image from Cloudinary. Please try again."
                );
                return; // Prevent removal from state if backend deletion fails
            }
        }

        setFormData((prev) => ({
            ...prev,
            image_urls: prev.image_urls.filter((_, i) => i !== indexToRemove),
        }));
    };

    // Helper to extract Cloudinary public_id from URL
    const extractPublicId = (url) => {
        const parts = url.split("/");
        const filename = parts[parts.length - 1];
        const publicId = filename.split(".")[0];
        // Cloudinary public IDs often include folder paths, e.g., 'products/product_id/image_name'
        // We need to reconstruct the full public ID including the folder.
        const folderPathIndex = parts.indexOf("products");
        if (folderPathIndex !== -1) {
            return parts.slice(folderPathIndex).join("/").split(".")[0];
        }
        return publicId;
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
        });
        setShowViewModal(true);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const startEditing = () => {
        setEditingProduct(selectedProduct);
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
            });
        }
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
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.p_name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                p_name: e.target.value,
                                            }))
                                        }
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
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                p_subtitle: e.target.value,
                                            }))
                                        }
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
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                p_category: e.target.value,
                                            }))
                                        }
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
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                p_price: e.target.value,
                                            }))
                                        }
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
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                discount_price: e.target.value,
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter discounted price"
                                    />
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
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Enter product description"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddProduct}
                                disabled={
                                    !formData.p_name ||
                                    !formData.p_category ||
                                    !formData.p_price
                                }
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Add Product
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
                                onClick={() => {
                                    setShowViewModal(false);
                                    setEditingProduct(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
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
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        p_name: e.target.value,
                                                    }))
                                                }
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
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        p_subtitle:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Category *
                                            </label>
                                            <input
                                                value={formData.p_category}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        p_category:
                                                            e.target.value,
                                                    }))
                                                }
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
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        p_price: e.target.value,
                                                    }))
                                                }
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
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        discount_price:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
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
                                                id="image-upload-edit" // Unique ID for edit modal
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
                                                !formData.p_price
                                            }
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Update Product
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
                                onClick={() => setShowDeleteModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete{" "}
                            <strong>"{selectedProduct.name}"</strong>? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProduct}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsData;
