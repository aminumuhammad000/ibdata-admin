import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const Profile: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 bg-gray-50 p-6">Profile/Settings Page</main>
      </div>
    </div>
  );
};

export default Profile;
