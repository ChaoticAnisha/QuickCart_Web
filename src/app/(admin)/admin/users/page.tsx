'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Eye, Search, UserPlus, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const usersPerPage = 10;

  // Mock users data (replace with actual API call)
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:5000/api/users');
      // const data = await response.json();
      
      // Mock data for now
      const mockUsers: User[] = [
        {
          _id: '1',
          name: 'Anisha Shah',
          email: 'anishashah0117@gmail.com',
          phone: '+977 9841234567',
          address: 'Kathmandu, Nepal',
          role: 'user',
          createdAt: '2024-02-10T10:30:00Z',
          updatedAt: '2024-02-10T10:30:00Z',
        },
        {
          _id: '2',
          name: 'Admin User',
          email: 'admin@quickcart.com',
          phone: '+977 9812345678',
          address: 'Pokhara, Nepal',
          role: 'admin',
          createdAt: '2024-01-15T08:20:00Z',
          updatedAt: '2024-02-01T14:45:00Z',
        },
        {
          _id: '3',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+977 9823456789',
          address: 'Lalitpur, Nepal',
          role: 'user',
          createdAt: '2024-02-08T12:15:00Z',
          updatedAt: '2024-02-08T12:15:00Z',
        },
        {
          _id: '4',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+977 9834567890',
          address: 'Bhaktapur, Nepal',
          role: 'user',
          createdAt: '2024-02-12T09:00:00Z',
          updatedAt: '2024-02-12T09:00:00Z',
        },
        {
          _id: '5',
          name: 'Test User',
          email: 'test@example.com',
          phone: '+977 9845678901',
          address: 'Biratnagar, Nepal',
          role: 'user',
          createdAt: '2024-02-13T11:30:00Z',
          updatedAt: '2024-02-13T11:30:00Z',
        },
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      // TODO: Replace with actual API call
      // await fetch(`http://localhost:5000/api/users/${userToDelete._id}`, {
      //   method: 'DELETE',
      // });

      // Remove user from local state
      setUsers(users.filter(u => u._id !== userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
      
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery) ||
    user.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">Manage all registered users</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or address..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
            />
          </div>

          {/* Add User Button */}
          <button
            onClick={() => router.push('/register')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105"
          >
            <UserPlus className="w-5 h-5" />
            Add New User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Active Users</p>
            <p className="text-2xl font-bold text-gray-800">{users.filter(u => u.role === 'user').length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Admins</p>
            <p className="text-2xl font-bold text-gray-800">{users.filter(u => u.role === 'admin').length}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Address</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      {user.phone ? (
                        <p className="text-sm text-gray-700 flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {user.phone}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">Not provided</p>
                      )}
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4">
                      {user.address ? (
                        <p className="text-sm text-gray-700 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {user.address}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">Not provided</p>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(user.createdAt)}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewUser(user._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === index + 1
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Delete User?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{userToDelete.name}</strong>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
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