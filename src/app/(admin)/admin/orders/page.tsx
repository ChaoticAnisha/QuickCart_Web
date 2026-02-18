'use client';

import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, Order, getStatusColor, getStatusLabel } from '@/lib/orders.api';
import { getProductImageUrl } from '@/lib/products.api';
import { Package, Search } from 'lucide-react';

const STATUS_OPTIONS = ["all", "pending", "confirmed", "processing", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [currentPage, selectedStatus]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await getAllOrders(currentPage, 10, selectedStatus);
      setOrders(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalOrders(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getUserAvatar = (user: any) => {
    if (!user) return null;
    if (user.avatar) {
      return user.avatar.startsWith('/uploads')
        ? `http://localhost:5000${user.avatar}`
        : user.avatar;
    }
    return null;
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Orders Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: totalOrders, color: 'from-blue-50 to-blue-100' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'from-yellow-50 to-yellow-100' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'from-green-50 to-green-100' },
          { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: 'from-red-50 to-red-100' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4`}>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'out_for_delivery' ? 'Out for Delivery' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const user = order.userId as any;
            const avatarUrl = getUserAvatar(user);
            const isExpanded = expandedOrder === order._id;

            return (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div
                  className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center flex-shrink-0">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const t = e.target as HTMLImageElement;
                              t.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{user?.name || 'Unknown User'}</p>
                        <p className="text-sm text-gray-500">{user?.email || ''}</p>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Order ID</p>
                        <p className="font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Items</p>
                        <p className="font-bold text-gray-800">{order.items.length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-bold text-[#FFA500]">₹{order.totalAmount}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Payment</p>
                        <p className="font-semibold text-gray-700 text-sm">{order.paymentMethod}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="text-gray-400 text-xl">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5">
                    {/* Items */}
                    <div className="mb-5">
                      <h3 className="font-bold text-gray-700 mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-white flex-shrink-0">
                              <img
                                src={getProductImageUrl(item.image)}
                                alt={item.name}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                  const t = e.target as HTMLImageElement;
                                  t.src = 'https://placehold.co/100x100/FFD700/white?text=P';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                            </div>
                            <p className="font-bold text-[#FFA500]">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Delivery Address</p>
                        <p className="text-gray-800">📍 {order.deliveryAddress}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Order Info</p>
                        <p className="text-gray-800">💳 {order.paymentMethod}</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                        {order.note && <p className="text-gray-600 text-sm mt-1">📝 {order.note}</p>}
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-bold text-gray-700">Update Status:</p>
                      {["pending", "confirmed", "processing", "out_for_delivery", "delivered", "cancelled"].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(order._id, status)}
                          disabled={order.status === status || updatingStatus === order._id}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                            order.status === status
                              ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
                          }`}
                        >
                          {updatingStatus === order._id ? '...' : status === 'out_for_delivery' ? 'Out for Delivery' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white rounded-xl shadow font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-xl font-semibold ${
                currentPage === i + 1
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-md'
                  : 'bg-white shadow text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white rounded-xl shadow font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}