'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Category } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    
    // TODO: Replace with actual API call
    setTimeout(() => {
      setCategories([
        { id: '1', name: 'Lights, Diyas & Candles', image: 'image 50.png', productsCount: 15 },
        { id: '2', name: 'Diwali Gifts', image: 'image 51.png', productsCount: 23 },
        { id: '3', name: 'Appliances & Gadgets', image: 'image 52.png', productsCount: 18 },
        { id: '4', name: 'Home & Living', image: 'image 53.png', productsCount: 30 },
        { id: '5', name: 'Vegetables & Fruits', image: 'image 41.png', productsCount: 45 },
        { id: '6', name: 'Atta, Dal & Rice', image: 'image 42.png', productsCount: 20 },
        { id: '7', name: 'Oil, Ghee & Masala', image: 'image 43.png', productsCount: 25 },
        { id: '8', name: 'Dairy, Bread & Milk', image: 'image 44 (1).png', productsCount: 35 },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        image: category.image,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', image: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', image: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: API call to create/update category
    
    handleCloseModal();
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      // TODO: API call to delete
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="h-40 bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center p-4">
              <img
                src={`/images/${category.image}`}
                alt={category.name}
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {category.productsCount} products
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
                  onClick={() => handleDelete(category.id)}
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Lights, Diyas & Candles"
            required
          />

          <Input
            label="Image Filename"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="e.g., image 50.png"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500] transition-colors"
              placeholder="Category description..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {editingCategory ? 'Update' : 'Create'} Category
            </Button>
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}