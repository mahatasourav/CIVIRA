import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || "",
  );
  const [unreadCount, setUnreadCount] = useState(0);

  const login = (token) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken("");
  };
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Fetching unread notifications count with token:", token);

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Unread count response:", data);

      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        adminToken,
        login,
        logout,
        unreadCount,
        fetchUnreadCount,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
