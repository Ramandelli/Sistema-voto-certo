
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from 'firebase/auth';
import { auth, getUserRole, UserRole } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userRole: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          setUserRole(role);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole({ isAdmin: false, isVoter: true });
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
