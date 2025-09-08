// Core API types for Library Management System

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  borrowedBooks?: string[];
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  category?: string;
  isbn: string;
  availableCopies: number;
  totalCopies: number;
}

export interface Loan {
  _id: string;
  userId: string;
  bookId: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  returned: boolean;
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
  extended?: boolean;
  extensionCount?: number;
  // Populated fields when requested
  book?: Book;
  user?: User;
}

export interface Category {
  _id: string;
  name: string;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  token: {
    auth_token: string;
    refresh_token: string;
  };
  user: User;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  genre: string;
  category?: string;
  isbn: string;
  availableCopies: number;
  totalCopies: number;
}

export interface CreateLoanRequest {
  userId: string;
  bookId: string;
}

export interface ExtendLoanRequest {
  additionalDays: number;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

// Pagination and filtering
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface BookFilters extends PaginationParams {
  title?: string;
  author?: string;
  genre?: string;
}

export interface LoanFilters extends PaginationParams {
  status?: 'active' | 'returned' | 'all';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Statistics
export interface LoanStats {
  totalLoans: number;
  activeLoans: number;
  returnedLoans: number;
  overdueLoans: number;
}

export interface ActiveLoansCountResponse {
  activeLoansCount: number;
}

// API Error response
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Auth context
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}