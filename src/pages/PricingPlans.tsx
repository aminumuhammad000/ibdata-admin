import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { bulkImportPricingPlans, createPricingPlan, deletePricingPlan, getPricingPlans, updatePricingPlan } from '../api/adminApi';
import PricingBulkImportModal from '../components/PricingBulkImportModal';
import PricingDeleteModal from '../components/PricingDeleteModal';
import PricingEditModal from '../components/PricingEditModal';
import PricingViewModal from '../components/PricingViewModal';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const PROVIDERS = [
  { id: 1, name: 'MTN' },
  { id: 2, name: 'Glo' },
  { id: 3, name: 'Airtel' },
  { id: 4, name: '9mobile' }
];

const TYPES = ['AIRTIME', 'DATA'];

const PricingPlans: React.FC = () => {
  const [page, setPage] = useState(1);
  const [providerId, setProviderId] = useState<string>('');
  const [type, setType] = useState<string>('');
  const limit = 10;

  const queryClient = useQueryClient();

  const [viewPlan, setViewPlan] = useState<any | null>(null);
  const [editPlan, setEditPlan] = useState<any | null>(null);
  const [deletePlan, setDeletePlan] = useState<any | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const params = {
    page,
    limit,
    ...(providerId && { providerId: parseInt(providerId) }),
    ...(type && { type })
  };

  const { data, status } = useQuery({
    queryKey: ['pricing-plans', page, providerId, type],
    queryFn: () => getPricingPlans(params).then((res: any) => res.data),
  });

  const plans = data?.plans || [];
  const total = data?.total || 0;

  const editMutation = useMutation({
    mutationFn: (formData: any) => updatePricingPlan(editPlan.id || editPlan._id, formData).then((res: any) => res.data),
    onSuccess: () => {
      setEditPlan(null);
      queryClient.invalidateQueries({ queryKey: ['pricing-plans'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePricingPlan(deletePlan.id || deletePlan._id).then((res: any) => res.data),
    onSuccess: () => {
      setDeletePlan(null);
      queryClient.invalidateQueries({ queryKey: ['pricing-plans'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (formData: any) => createPricingPlan(formData).then((res: any) => res.data),
    onSuccess: () => {
      setShowCreateModal(false);
      queryClient.invalidateQueries({ queryKey: ['pricing-plans'] });
    },
  });

  const bulkImportMutation = useMutation({
    mutationFn: (plansData: any[]) => bulkImportPricingPlans(plansData).then((res: any) => res.data),
    onSuccess: () => {
      setShowBulkImport(false);
      queryClient.invalidateQueries({ queryKey: ['pricing-plans'] });
    },
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Pricing Plans</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  + Add Plan
                </button>
                <button
                  onClick={() => setShowBulkImport(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  📤 Bulk Import
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <select
                    value={providerId}
                    onChange={(e) => {
                      setProviderId(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Providers</option>
                    {PROVIDERS.map((p) => (
                      <option key={p.id} value={p.id.toString()}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setProviderId('');
                      setType('');
                      setPage(1);
                    }}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Plans Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {status === 'pending' && (
                <div className="p-6 text-center text-gray-500">Loading plans...</div>
              )}
              {status === 'error' && (
                <div className="p-6 text-center text-red-500">Failed to load plans.</div>
              )}
              {status === 'success' && (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Plan Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Provider</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price (₦)</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Discount (%)</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {plans.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No plans found.</td>
                          </tr>
                        )}
                        {plans.map((plan: any) => (
                          <tr key={plan._id || plan.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm text-gray-900">{plan.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{plan.providerName}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                plan.type === 'AIRTIME' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {plan.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">₦{plan.price?.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{plan.discount || 0}%</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                plan.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {plan.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm space-x-2">
                              <button
                                onClick={() => setViewPlan(plan)}
                                className="text-blue-600 hover:text-blue-900 font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => setEditPlan(plan)}
                                className="text-green-600 hover:text-green-900 font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeletePlan(plan)}
                                className="text-red-600 hover:text-red-900 font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Info */}
                  <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center text-sm text-gray-600">
                    <span>Showing {plans.length} of {total} plans</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1">Page {page}</span>
                      <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={plans.length < limit}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Modals */}
          {viewPlan && (
            <PricingViewModal plan={viewPlan} onClose={() => setViewPlan(null)} />
          )}
          {editPlan && (
            <PricingEditModal
              plan={editPlan}
              onClose={() => setEditPlan(null)}
              onSave={editMutation.mutate}
              isSaving={editMutation.status === 'pending'}
            />
          )}
          {deletePlan && (
            <PricingDeleteModal
              plan={deletePlan}
              onClose={() => setDeletePlan(null)}
              onDelete={deleteMutation.mutate}
              isDeleting={deleteMutation.status === 'pending'}
            />
          )}
          {showCreateModal && (
            <PricingEditModal
              plan={null}
              onClose={() => setShowCreateModal(false)}
              onSave={createMutation.mutate}
              isSaving={createMutation.status === 'pending'}
              isCreate={true}
            />
          )}
          {showBulkImport && (
            <PricingBulkImportModal
              onClose={() => setShowBulkImport(false)}
              onImport={bulkImportMutation.mutate}
              isImporting={bulkImportMutation.status === 'pending'}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default PricingPlans;
