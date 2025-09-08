// Books management hooks following Single Responsibility Principle

import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Book, BookFilters, CreateBookRequest } from '../types';
import { useToast } from './use-toast';

export const useBooks = (initialFilters?: BookFilters) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookFilters>(initialFilters || {});
  const { toast } = useToast();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.books.getBooks(filters);
      setBooks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch books');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load books',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const updateFilters = useCallback((newFilters: Partial<BookFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    books,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: fetchBooks,
  };
};

export const useBook = (id: string | null) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBook = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.books.getBookById(id);
      setBook(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch book');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load book details',
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  return {
    book,
    loading,
    error,
    refetch: fetchBook,
  };
};

export const useBookMutations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createBook = useCallback(async (bookData: CreateBookRequest): Promise<Book | null> => {
    setLoading(true);
    
    try {
      const book = await api.books.createBook(bookData);
      toast({
        title: 'Success',
        description: 'Book created successfully',
      });
      return book;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to create book',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateBook = useCallback(async (id: string, bookData: Partial<CreateBookRequest>): Promise<Book | null> => {
    setLoading(true);
    
    try {
      const book = await api.books.updateBook(id, bookData);
      toast({
        title: 'Success',
        description: 'Book updated successfully',
      });
      return book;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to update book',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteBook = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      await api.books.deleteBook(id);
      toast({
        title: 'Success',
        description: 'Book deleted successfully',
      });
      return true;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to delete book',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    createBook,
    updateBook,
    deleteBook,
    loading,
  };
};