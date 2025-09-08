// Users management hooks following Single Responsibility Principle

import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { User, PaginationParams, CreateUserRequest, PaginatedResponse } from '../types';
import { useToast } from './use-toast';

export const useUsers = (initialParams?: PaginationParams) => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<PaginationParams>(initialParams || { page: 1, limit: 10 });
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data: PaginatedResponse<User> = await api.users.getUsers(params);
      setUsers(data.data);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load users',
      });
    } finally {
      setLoading(false);
    }
  }, [params, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateParams = useCallback((newParams: Partial<PaginationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  return {
    users,
    total,
    loading,
    error,
    params,
    updateParams,
    refetch: fetchUsers,
  };
};

export const useUser = (id: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUser = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.users.getUserById(id);
      setUser(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load user details',
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
};

export const useUserMutations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createUser = useCallback(async (userData: CreateUserRequest): Promise<User | null> => {
    setLoading(true);
    
    try {
      const user = await api.users.createUser(userData);
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
      return user;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to create user',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateUser = useCallback(async (id: string, userData: Partial<CreateUserRequest>): Promise<User | null> => {
    setLoading(true);
    
    try {
      const user = await api.users.updateUser(id, userData);
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      return user;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to update user',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      await api.users.deleteUser(id);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      return true;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to delete user',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    createUser,
    updateUser,
    deleteUser,
    loading,
  };
};