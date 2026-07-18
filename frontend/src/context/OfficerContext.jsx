import axios from "axios";
import { createContext, useContext, useState } from "react";

const OfficerContext = createContext();

export const OfficerProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const api = axios.create({
    baseURL: API_BASE_URL,
  });
  const [officerToken, setOfficerToken] = useState(
    localStorage.getItem("officerToken") || "",
  );

  const [officer, setOfficer] = useState(
    JSON.parse(localStorage.getItem("officer")) || null,
  );

  const login = (token, officerData) => {
    localStorage.setItem("officerToken", token);
    localStorage.setItem("officer", JSON.stringify(officerData));

    setOfficerToken(token);
    setOfficer(officerData);
  };

  const logout = () => {
    localStorage.removeItem("officerToken");
    localStorage.removeItem("officer");

    setOfficerToken("");
    setOfficer(null);
  };

  return (
    <OfficerContext.Provider
      value={{
        officerToken,
        officer,
        login,
        logout,
      }}
    >
      {children}
    </OfficerContext.Provider>
  );
};

export const useOfficerContext = () => useContext(OfficerContext);
