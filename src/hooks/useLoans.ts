// Loans management hooks following Single Responsibility Principle

import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Loan, LoanFilters, CreateLoanRequest, ExtendLoanRequest, LoanStats } from '../types';
import { useToast } from './use-toast';
import { useAuth } from '../contexts/AuthContext';

export const useLoans = (initialFilters?: LoanFilters) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LoanFilters>(initialFilters || {});
  const { toast } = useToast();

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.loans.getLoans(filters);
      setLoans(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch loans');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load loans',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const updateFilters = useCallback((newFilters: Partial<LoanFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    loans,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchLoans,
  };
};

export const useUserLoans = (userId?: string, initialFilters?: LoanFilters) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LoanFilters>(initialFilters || {});
  const { user } = useAuth();
  const { toast } = useToast();

  const targetUserId = userId || user?._id;

  const fetchUserLoans = useCallback(async () => {
    if (!targetUserId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.loans.getUserLoans(targetUserId, filters);
      setLoans(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user loans');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load your loans',
      });
    } finally {
      setLoading(false);
    }
  }, [targetUserId, filters, toast]);

  useEffect(() => {
    fetchUserLoans();
  }, [fetchUserLoans]);

  const updateFilters = useCallback((newFilters: Partial<LoanFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    loans,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchUserLoans,
  };
};

export const useLoanMutations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const borrowBook = useCallback(async (loanData: CreateLoanRequest): Promise<Loan | null> => {
    setLoading(true);
    
    try {
      const loan = await api.loans.createLoan(loanData);
      toast({
        title: 'Success',
        description: 'Book borrowed successfully',
      });
      return loan;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to borrow book',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const returnBook = useCallback(async (loanId: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const result = await api.loans.returnLoan(loanId);
      toast({
        title: 'Success',
        description: result.isOverdue 
          ? 'Book returned (was overdue)' 
          : 'Book returned successfully',
      });
      return true;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to return book',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const extendLoan = useCallback(async (loanId: string, extensionData: ExtendLoanRequest): Promise<boolean> => {
    setLoading(true);
    
    try {
      const result = await api.loans.extendLoan(loanId, extensionData);
      toast({
        title: 'Success',
        description: `Loan extended by ${result.additionalDays} days`,
      });
      return true;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to extend loan',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    borrowBook,
    returnBook,
    extendLoan,
    loading,
  };
};

export const useLoanStats = () => {
  const [stats, setStats] = useState<LoanStats | null>(null);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [overdueLoans, setOverdueLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsData, activeCountData, overdueData] = await Promise.all([
        api.loans.getLoanStats(),
        api.loans.getActiveLoansCount(),
        api.loans.getOverdueLoans(),
      ]);
      
      setStats(statsData);
      setActiveCount(activeCountData.activeLoansCount);
      setOverdueLoans(overdueData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch loan statistics');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load loan statistics',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    activeCount,
    overdueLoans,
    loading,
    error,
    refetch: fetchStats,
  };
};