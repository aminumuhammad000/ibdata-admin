import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuditLogs, deleteAuditLog } from '../api/adminApi';

const AuditLogs: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const queryClient = useQueryClient();
  const { data, status } = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: () => getAuditLogs({ page, limit }).then(res => res.data),
  });

  const logs = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1 };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMutation = useMutation({
    mutationFn: () => deleteAuditLog(deleteId!).then(res => res.data),
    onSuccess: () => {
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 bg-gray-50 p-6">
          <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>
          {status === 'pending' && <div>Loading logs...</div>}
          {status === 'error' && <div className="text-red-500">Failed to load logs.</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Admin</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4">No logs found.</td>
                  </tr>
                )}
                {logs.map((log: any) => (
                  <tr key={log.id} className="border-t">
                    <td className="px-4 py-2">{log.id}</td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">{log.admin_name || log.admin?.email || '-'}</td>
                    <td className="px-4 py-2">{log.created_at ? new Date(log.created_at).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => setDeleteId(log.id)}
                      >
                        Delete
                      </button>
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
          {/* Delete Modal */}
          {deleteId && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setDeleteId(null)}
                  disabled={deleteMutation.status === 'pending'}
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4 text-red-600">Delete Audit Log</h2>
                <p className="mb-6">Are you sure you want to delete this audit log?</p>
                <div className="flex gap-4">
                  <button
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
                    onClick={() => setDeleteId(null)}
                    disabled={deleteMutation.status === 'pending'}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.status === 'pending'}
                  >
                    {deleteMutation.status === 'pending' ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AuditLogs;
