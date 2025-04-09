
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <RegisterForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
