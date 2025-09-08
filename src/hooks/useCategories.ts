// Categories management hooks following Single Responsibility Principle

import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Category, PaginationParams, CreateCategoryRequest, PaginatedResponse } from '../types';
import { useToast } from './use-toast';

export const useCategories = (initialParams?: PaginationParams) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<PaginationParams>(initialParams || { page: 1, limit: 50 });
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data: PaginatedResponse<Category> = await api.categories.getCategories(params);
      setCategories(data.data);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load categories',
      });
    } finally {
      setLoading(false);
    }
  }, [params, toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const updateParams = useCallback((newParams: Partial<PaginationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  return {
    categories,
    total,
    loading,
    error,
    params,
    updateParams,
    refetch: fetchCategories,
  };
};

export const useCategory = (id: string | null) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategory = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.categories.getCategoryById(id);
      setCategory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch category');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load category details',
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return {
    category,
    loading,
    error,
    refetch: fetchCategory,
  };
};

export const useCategoryMutations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createCategory = useCallback(async (categoryData: CreateCategoryRequest): Promise<Category | null> => {
    setLoading(true);
    
    try {
      const category = await api.categories.createCategory(categoryData);
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      return category;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to create category',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateCategory = useCallback(async (id: string, categoryData: CreateCategoryRequest): Promise<Category | null> => {
    setLoading(true);
    
    try {
      const category = await api.categories.updateCategory(id, categoryData);
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
      return category;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to update category',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      await api.categories.deleteCategory(id);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      return true;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to delete category',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
  };
};