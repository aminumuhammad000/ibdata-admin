import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/audit-logs', label: 'Audit Logs' },
  { to: '/profile', label: 'Profile/Settings' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="h-screen w-60 bg-gray-900 text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-8">VTU Admin</div>
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded hover:bg-gray-700 transition ${isActive ? 'bg-gray-800 font-semibold' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
