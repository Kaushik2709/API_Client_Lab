import React, { createContext, useState, useEffect } from "react";
import { authService } from "@/services/authService";

// 1. Create and EXPORT the context object
export const AuthContext = createContext<any>(null);

// 2. The Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.me();
        setUser(data.User);
      } catch (error) {
        console.log("No active session");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: any, password: any) => {
    const data = await authService.login(email, password);
    setUser(data.User);
    return data;
  };

  const signup = async (
    firstName: any,
    lastName: any,
    email: any,
    password: any,
  ) => {
    const data = await authService.signup(firstName, lastName, email, password);
    setUser(data.User);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateProfile = async (userData: any) => {
    const data = await authService.updateProfile(userData);
    setUser(data.User);
    return data;
  };

  const deleteAccount = async () => {
    await authService.deleteAccount();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
