import React, { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import UserViewModal from '../components/UserViewModal';
import UserEditModal from '../components/UserEditModal';
import UserStatusModal from '../components/UserStatusModal';
import UserDeleteModal from '../components/UserDeleteModal';
import { getUsers, updateUserStatus, deleteUser, updateUser } from '../api/adminApi';

const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, status } = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers({ page, limit }).then((res: any) => res.data),
  });


  const users = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1 };

  const [viewUser, setViewUser] = useState<any | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [statusUser, setStatusUser] = useState<any | null>(null);
  const [deleteUserObj, setDeleteUserObj] = useState<any | null>(null);
  const statusMutation = useMutation({
    mutationFn: (status: string) => updateUserStatus(statusUser.id, status).then((res: any) => res.data),
    onSuccess: () => {
      setStatusUser(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(deleteUserObj.id).then((res: any) => res.data),
    onSuccess: () => {
      setDeleteUserObj(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const queryClient = useQueryClient();
  const editMutation = useMutation({
    mutationFn: (data: any) => updateUser(editUser.id, data).then((res: any) => res.data),
    onSuccess: () => {
      setEditUser(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 bg-gray-50 p-6">
          <h1 className="text-2xl font-bold mb-6">Users</h1>
          {status === 'pending' && <div>Loading users...</div>}
          {status === 'error' && <div className="text-red-500">Failed to load users.</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">KYC</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4">No users found.</td>
                  </tr>
                )}
                {users.map((user: any) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">{user.first_name} {user.last_name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phone_number}</td>
                    <td className="px-4 py-2">{user.status}</td>
                    <td className="px-4 py-2">{user.kyc_status}</td>
                    <td className="px-4 py-2">
                      {/* Actions: View, Edit, Status, Delete (to be implemented) */}
                      <button className="text-blue-600 hover:underline mr-2" onClick={() => setViewUser(user)}>View</button>
                      <button className="text-green-600 hover:underline mr-2" onClick={() => setEditUser(user)}>Edit</button>
                      <button className="text-yellow-600 hover:underline mr-2" onClick={() => setStatusUser(user)}>Status</button>
                      <button className="text-red-600 hover:underline" onClick={() => setDeleteUserObj(user)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-end mt-4 gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="px-2 py-1">Page {pagination.page} of {pagination.pages}</span>
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
            >
              Next
            </button>
          </div>
        {viewUser && (
          <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />
        )}
        {editUser && (
          <UserEditModal
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={editMutation.mutate}
            isSaving={editMutation.status === 'pending'}
          />
        )}
        {statusUser && (
          <UserStatusModal
            user={statusUser}
            onClose={() => setStatusUser(null)}
            onSave={statusMutation.mutate}
            isSaving={statusMutation.status === 'pending'}
          />
        )}
        {deleteUserObj && (
          <UserDeleteModal
            user={deleteUserObj}
            onClose={() => setDeleteUserObj(null)}
            onDelete={deleteMutation.mutate}
            isDeleting={deleteMutation.status === 'pending'}
          />
        )}
        </main>
      </div>
    </div>
  );
};

export default Users;
