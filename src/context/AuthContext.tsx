import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/helpdesk';
import { DEMO_USERS, StorageService } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginAs: (role: UserRole) => void;
  loginWithCredentials: (email: string) => boolean;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return StorageService.getCurrentUser();
  });

  useEffect(() => {
    if (user) {
      StorageService.setCurrentUser(user);
    }
  }, [user]);

  const loginAs = (role: UserRole) => {
    const selectedUser = DEMO_USERS[role];
    setUser(selectedUser);
    StorageService.setCurrentUser(selectedUser);
  };

  const loginWithCredentials = (email: string): boolean => {
    if (email.toLowerCase().includes('support') || email.toLowerCase().includes('tech')) {
      loginAs('technician');
      return true;
    }
    // Default to regular employee user
    loginAs('user');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smart_helpdesk_user_v1');
  };

  const switchRole = () => {
    if (!user || user.role === 'user') {
      loginAs('technician');
    } else {
      loginAs('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAs,
        loginWithCredentials,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
