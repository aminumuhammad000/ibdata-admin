import React from 'react';
import { useAuthContext } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const Topbar: React.FC = () => {
  const { admin, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <div className="text-lg font-semibold">Welcome, {admin?.first_name || 'Admin'}</div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
};

export default Topbar;
