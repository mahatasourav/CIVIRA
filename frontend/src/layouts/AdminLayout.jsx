import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaSignOutAlt,
  FaShieldAlt,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import { useAdminContext } from "@/context/AdminContext";

const AdminLayout = () => {
  const navigate = useNavigate();

  const { unreadCount, logout } = useAdminContext();
  console.log("Unread notifications count in AdminLayout:", unreadCount);

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/admin/dashboard",
    },
    {
      name: "Create Officer",
      icon: <FaUserPlus />,
      path: "/admin/create-officer",
    },
    {
      name: "Manage Officers",
      icon: <FaUsers />,
      path: "/admin/manage-officers",
    },
    {
      name: "Notifications",
      icon: <FaBell />,
      path: "/admin/notifications",
      badge: unreadCount,
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-950 text-white shadow-2xl">
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-800 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 to-blue-500">
            <FaShieldAlt className="text-xl" />
          </div>

          <div className="ml-3">
            <h1 className="text-2xl font-bold">CIVIRA</h1>
            <p className="text-xs text-slate-400">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-4">
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </div>

              {item.badge > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-800 p-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-700"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-64 flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white px-8 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Admin Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Manage officers and monitor the system.
            </p>
          </div>

          {/* Search */}
          <div className="hidden w-[380px] lg:block">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search officers..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            {/* Notification */}
            <button
              onClick={() => navigate("/admin/notifications")}
              className="relative rounded-full p-3 hover:bg-slate-100"
            >
              <FaBell className="text-2xl text-slate-700" />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Admin */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold text-slate-800">Administrator</p>

                <p className="text-sm text-slate-500">System Admin</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-lg font-bold text-white">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t bg-white py-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} CIVIRA Admin Portal. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
