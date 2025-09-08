// Register page wrapper following Single Responsibility Principle

import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const Register: React.FC = () => {
  return <RegisterForm />;
};