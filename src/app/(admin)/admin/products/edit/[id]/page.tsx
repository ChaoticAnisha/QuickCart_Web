'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { getProductById, updateProduct, UpdateProductPayload, Product } from '@/lib/products.api';
import { getAllCategories, Category } from '@/lib/categories.api';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 0,
    deliveryTime: '16',
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await getProductById(productId);
      
      const product = response.product;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        deliveryTime: product.deliveryTime,
        isActive: product.isActive,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product');
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              value
    }));
    
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSaving(true);
      
      await updateProduct(productId, formData);
      
      alert('Product updated successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(error.message || 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Products</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                placeholder="Enter product description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Delivery Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Delivery Time (minutes)
              </label>
              <input
                type="text"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                placeholder="16"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL *
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                  placeholder="image-name.png or /images/image-name.png"
                />
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload
                </button>
              </div>
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>

            {/* Is Active */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#FFA500] border-gray-300 rounded focus:ring-[#FFA500]"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Product is active (visible to customers)
                </span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}