/* eslint-disable react-hooks/immutability */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/admin/DataTable';
import Pagination from '@/components/common/Pagination';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { User } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { usePagination } from '@/hooks/usePagination';
import { Search, Filter } from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const pagination = usePagination({
    totalItems: users.length,
    itemsPerPage: 10,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);

    // TODO: Replace with actual API call
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          name: 'Anisha Sah',
          email: 'anisha@example.com',
          role: 'USER',
          address: 'Kathmandu, Nepal',
          phone: '+977 9841234567',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          name: 'Admin User',
          email: 'admin@quickcart.com',
          role: 'admin',
          address: 'Kathmandu, Nepal',
          phone: '+977 9851234567',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '3',
          name: 'Rajesh Sharma',
          email: 'rajesh@example.com',
          role: 'USER',
          address: 'Lalitpur, Nepal',
          phone: '+977 9861234567',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01'),
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    pagination.startIndex,
    pagination.startIndex 
  );

  const columns = [
    {
      header: 'Name',
      accessor: (user: User) => user.name,
    },
    {
      header: 'Email',
      accessor: (user: User) => user.email,
    },
    {
      header: 'Phone',
      accessor: (user: User) => user.phone || 'N/A',
    },
    {
      header: 'Role',
      accessor: (user: User) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            user.role === 'admin'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {user.role.toUpperCase()}
        </span>
      ),
    },
    {
      header: 'Location',
      accessor: (user: User) => user.address || 'N/A',
    },
    {
      header: 'Joined',
      accessor: (user: User) => formatDateTime(user.createdAt),
    },
  ];

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
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <p className="text-gray-600 mt-1">Manage user accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <DataTable
          data={paginatedUsers}
          columns={columns}
          onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
        />
      )}

      {/* Pagination */}
      {filteredUsers.length  && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
        />
      )}
    </div>
  );
}
