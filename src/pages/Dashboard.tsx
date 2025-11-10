import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/adminApi';

const Dashboard: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 bg-gray-50 p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          {isLoading && <div>Loading stats...</div>}
          {isError && <div className="text-red-500">Failed to load stats.</div>}
          {data && data.data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Users" value={data.data.data.totalUsers} />
              <StatCard label="Active Users" value={data.data.data.activeUsers} />
              <StatCard label="Total Transactions" value={data.data.data.totalTransactions} />
              <StatCard label="Successful Transactions" value={data.data.data.successfulTransactions} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white rounded shadow p-6 flex flex-col items-center">
    <div className="text-3xl font-bold mb-2">{value}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

export default Dashboard;
