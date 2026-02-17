'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  Category 
} from '@/lib/categories.api';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        image: category.image,
        description: category.description || '',
      });
      if (category.image) {
        setImagePreview(
          category.image.startsWith('/uploads') 
            ? `http://localhost:5000${category.image}` 
            : `/images/${category.image}`
        );
      }
    } else {
      setEditingCategory(null);
      setFormData({ name: '', image: '', description: '' });
      setImagePreview('');
      setImageFile(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', image: '', description: '' });
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (!imageFile && !formData.image) newErrors.image = 'Category image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      // Handle image
      let imagePath = formData.image;
      if (imageFile) {
        // For now store filename - in production upload to server
        imagePath = imageFile.name;
      }

      if (editingCategory) {
        await updateCategory(editingCategory._id || editingCategory.id, {
          name: formData.name,
          image: imagePath,
          description: formData.description,
        });
        alert('Category updated successfully!');
      } else {
        await createCategory({
          name: formData.name,
          image: imagePath,
          description: formData.description,
        });
        alert('Category created successfully!');
      }

      handleCloseModal();
      await loadCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert(error.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete._id || categoryToDelete.id);
      await loadCategories();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      alert('Category deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(error.message || 'Failed to delete category');
    }
  };

  const getCategoryImage = (image: string) => {
    if (!image) return '/images/placeholder.png';
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    return `/images/${image}`;
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Total Categories</p>
            <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-800">
              {categories.reduce((sum, cat) => sum + (cat.productsCount || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-xl mb-4">No categories found</p>
          <p className="text-gray-400 mb-6">Create your first category to get started</p>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold hover:shadow-lg"
          >
            Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category._id || category.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="h-40 bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center p-4">
                <img
                  src={getCategoryImage(category.image)}
                  alt={category.name}
                  className="w-24 h-24 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/400x400/FFD700/white?text=No+Image';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500 mb-1 line-clamp-1">{category.description}</p>
                )}
                <p className="text-sm text-gray-600 mb-4">
                  {category.productsCount || 0} products
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Image *
                </label>
                {imagePreview ? (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FFA500] hover:bg-orange-50 transition-all"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">Click to upload image</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              </div>

              {/* Category Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                  placeholder="e.g., Lights, Diyas & Candles"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                  placeholder="Category description..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Delete Category?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{categoryToDelete.name}</strong>? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}