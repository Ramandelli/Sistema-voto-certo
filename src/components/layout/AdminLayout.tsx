
import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!currentUser || !userRole?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="p-8 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
