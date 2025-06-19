import React, { createContext, useState, useEffect, useContext } from 'react';

interface RoleContextType {
    isAdmin: boolean;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<RoleContextType | undefined>(undefined);

export const AdminRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    try{
      const user = JSON.parse(storedUser!);
      setIsAdmin(user.isAdmin);
    } catch (error) {
      console.error('Error parsing user object:', error);
    }
  
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AuthContext); // too lazy to rename authcontext
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};