// API services following Interface Segregation Principle

import { ApiService, buildQueryParams } from './axios.config';
import type {
  User,
  Book,
  Loan,
  Category,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  CreateBookRequest,
  CreateLoanRequest,
  ExtendLoanRequest,
  CreateCategoryRequest,
  CreateUserRequest,
  BookFilters,
  LoanFilters,
  PaginationParams,
  PaginatedResponse,
  LoanStats,
  ActiveLoansCountResponse,
} from '../types';

// Authentication Service - Single Responsibility
export class AuthService extends ApiService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/login', credentials);
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/register', userData);
  }
}

// Books Service - Single Responsibility
export class BooksService extends ApiService {
  async getBooks(filters?: BookFilters): Promise<Book[]> {
    const queryString = filters ? `?${buildQueryParams(filters)}` : '';
    return this.get<Book[]>(`/books${queryString}`);
  }

  async getBookById(id: string): Promise<Book> {
    return this.get<Book>(`/books/${id}`);
  }

  async createBook(bookData: CreateBookRequest): Promise<Book> {
    return this.post<Book>('/books', bookData);
  }

  async updateBook(id: string, bookData: Partial<CreateBookRequest>): Promise<Book> {
    return this.put<Book>(`/books/${id}`, bookData);
  }

  async deleteBook(id: string): Promise<void> {
    return this.delete<void>(`/books/${id}`);
  }
}

// Users Service - Single Responsibility
export class UsersService extends ApiService {
  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    const queryString = params ? `?${buildQueryParams(params)}` : '';
    return this.get<PaginatedResponse<User>>(`/users${queryString}`);
  }

  async getUserById(id: string): Promise<User> {
    return this.get<User>(`/users/${id}`);
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    return this.post<User>('/users', userData);
  }

  async updateUser(id: string, userData: Partial<CreateUserRequest>): Promise<User> {
    return this.put<User>(`/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<void> {
    return this.delete<void>(`/users/${id}`);
  }
}

// Loans Service - Single Responsibility
export class LoansService extends ApiService {
  async getLoans(filters?: LoanFilters): Promise<Loan[]> {
    const queryString = filters ? `?${buildQueryParams(filters)}` : '';
    return this.get<Loan[]>(`/loans${queryString}`);
  }

  async getLoanById(id: string): Promise<Loan> {
    return this.get<Loan>(`/loans/${id}`);
  }

  async getUserLoans(userId: string, filters?: LoanFilters): Promise<Loan[]> {
    const queryString = filters ? `?${buildQueryParams(filters)}` : '';
    return this.get<Loan[]>(`/loans/user/${userId}${queryString}`);
  }

  async createLoan(loanData: CreateLoanRequest): Promise<Loan> {
    return this.post<Loan>('/loans', loanData);
  }

  async returnLoan(id: string): Promise<{ message: string; isOverdue: boolean; returnDate: string }> {
    return this.put(`/loans/${id}/return`);
  }

  async extendLoan(id: string, extensionData: ExtendLoanRequest): Promise<{ 
    message: string; 
    newDueDate: string; 
    additionalDays: number 
  }> {
    return this.put(`/loans/${id}/extend`, extensionData);
  }

  // Statistics endpoints
  async getActiveLoansCount(): Promise<ActiveLoansCountResponse> {
    return this.get<ActiveLoansCountResponse>('/loans/stats/active-count');
  }

  async getOverdueLoans(): Promise<Loan[]> {
    return this.get<Loan[]>('/loans/stats/overdue');
  }

  async getLoanStats(): Promise<LoanStats> {
    return this.get<LoanStats>('/loans/stats/overview');
  }
}

// Categories Service - Single Responsibility
export class CategoriesService extends ApiService {
  async getCategories(params?: PaginationParams): Promise<PaginatedResponse<Category>> {
    const queryString = params ? `?${buildQueryParams(params)}` : '';
    return this.get<PaginatedResponse<Category>>(`/categories${queryString}`);
  }

  async getCategoryById(id: string): Promise<Category> {
    return this.get<Category>(`/categories/${id}`);
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    return this.post<Category>('/categories', categoryData);
  }

  async updateCategory(id: string, categoryData: CreateCategoryRequest): Promise<Category> {
    return this.put<Category>(`/categories/${id}`, categoryData);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.delete<void>(`/categories/${id}`);
  }
}

// Factory pattern for service instances - Dependency Inversion Principle
export const createServices = () => ({
  auth: new AuthService(),
  books: new BooksService(),
  users: new UsersService(),
  loans: new LoansService(),
  categories: new CategoriesService(),
});

// Export singleton instances
export const api = createServices();