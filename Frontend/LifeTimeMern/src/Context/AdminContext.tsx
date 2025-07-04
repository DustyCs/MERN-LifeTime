import React, { createContext, useState, useEffect, useContext } from 'react';

interface RoleContextType {
    isAdmin: boolean;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
}

const AuthContext = createContext<RoleContextType | undefined>(undefined);

export const AdminRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser){
      try{
        const parsed = JSON.parse(storedUser);
        setIsAdmin(!!parsed.isAdmin);
      } catch (error) {
        console.error('Error parsing user object:', error);
      }
    }

    setIsLoading(false);
  
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin, isLoading }}>
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