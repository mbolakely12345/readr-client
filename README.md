# Library Management System - Frontend

A modern, responsive React TypeScript frontend for the Library Management System API. Built with clean architecture principles, SOLID design patterns, and a beautiful UI.

![Library Management System](src/assets/library-hero.jpg)

## 🚀 Features

### 👤 **User Features**
- **Secure Authentication** - JWT-based login and registration
- **Book Catalog** - Browse, search, and filter books by title, author, genre
- **Loan Management** - Borrow books, track due dates, extend loans
- **Personal Dashboard** - View active loans, overdue alerts, quick actions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 👨‍💼 **Admin Features** 
- **Admin Dashboard** - System-wide statistics and insights
- **Book Management** - Full CRUD operations for book catalog
- **User Management** - Create, edit, and manage user accounts
- **Loan Oversight** - Monitor all loans, handle overdue books
- **Analytics** - Track library usage and popular books

## 🏗️ **Architecture & Design Principles**

This application follows **SOLID principles** and clean architecture patterns:

### **Single Responsibility Principle (SRP)**
- Each component has one reason to change
- Services are separated by domain (Books, Loans, Users, etc.)
- Hooks handle specific business logic

### **Open/Closed Principle (OCP)**
- Components are open for extension, closed for modification
- Easy to add new features without changing existing code
- Plugin-based architecture for services

### **Liskov Substitution Principle (LSP)**
- Interface-based design allows easy mocking and testing
- All service implementations are interchangeable

### **Interface Segregation Principle (ISP)**
- Services are split into focused interfaces
- Components only depend on what they need

### **Dependency Inversion Principle (DIP)**
- High-level modules don't depend on low-level modules
- Both depend on abstractions (interfaces)

## 📁 **Project Structure**

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication forms
│   ├── common/          # Shared components
│   ├── layout/          # Layout components
│   └── ui/              # Shadcn UI components
├── contexts/            # React contexts (Auth, etc.)
├── hooks/               # Custom React hooks
│   ├── useBooks.ts      # Book management logic
│   ├── useLoans.ts      # Loan management logic
│   ├── useUsers.ts      # User management logic
│   └── useCategories.ts # Category management logic
├── pages/               # Page components
├── services/            # API service layer
│   ├── axios.config.ts  # Axios configuration
│   └── api.ts           # API service classes
├── types/               # TypeScript type definitions
└── lib/                 # Utility functions
```

## 🛠️ **Technology Stack**

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality, accessible UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Query** - Server state management
- **Lucide React** - Beautiful, customizable icons

## 🎨 **Design System**

The application uses a sophisticated design system with:

- **Royal Blue Primary** (`hsl(230, 75%, 45%)`) - Trust and knowledge
- **Elegant Gold Secondary** (`hsl(43, 74%, 66%)`) - Premium feel
- **Deep Purple Accent** (`hsl(260, 60%, 45%)`) - Sophistication
- **Semantic Color Tokens** - Consistent theming
- **Custom Gradients** - Beautiful visual effects
- **Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Automatic theme switching

## 📋 **Prerequisites**

- Node.js 16+ 
- npm or yarn
- Running Backend API (see backend README)

## 🚀 **Getting Started**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Update `src/services/axios.config.ts` with your backend URL:
   ```typescript
   const BASE_URL = 'http://localhost:3000'; // Your API URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🔧 **Configuration**

### **Environment Variables**

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Library Management System
```

### **API Configuration**

The Axios client is configured with:
- Automatic auth token injection
- Request/response interceptors
- Error handling and retry logic
- Loading states management

## 📚 **Usage Examples**

### **Authentication**
```typescript
const { login, register, logout, user, isAuthenticated } = useAuth();

// Login
await login({ email: "user@example.com", password: "password" });

// Register  
await register({ 
  username: "johndoe", 
  email: "john@example.com", 
  password: "password",
  role: "user" 
});
```

### **Managing Books**
```typescript
const { books, loading, updateFilters } = useBooks();
const { createBook, updateBook, deleteBook } = useBookMutations();

// Search books
updateFilters({ title: "Harry Potter", author: "Rowling" });

// Create new book (admin only)
await createBook({
  title: "New Book",
  author: "Author Name", 
  genre: "Fiction",
  isbn: "978-1234567890",
  availableCopies: 5,
  totalCopies: 5
});
```

### **Managing Loans**
```typescript
const { loans, refetch } = useUserLoans();
const { borrowBook, returnBook, extendLoan } = useLoanMutations();

// Borrow a book
await borrowBook({ userId: user.id, bookId: book.id });

// Return a book
await returnBook(loanId);

// Extend loan by 7 days
await extendLoan(loanId, { additionalDays: 7 });
```

## 🧪 **Testing**

Run the test suite:

```bash
npm run test
```

### **Test Structure**
- Unit tests for hooks and utilities
- Integration tests for API services  
- Component tests with React Testing Library
- E2E tests with Playwright

## 🏗️ **Building for Production**

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   
   The `dist/` folder contains all static assets ready for deployment.

## 🚀 **Deployment**

### **Recommended Platforms**
- **Vercel** - Zero-config deployment
- **Netlify** - Automatic deploys from Git
- **AWS S3 + CloudFront** - Scalable static hosting
- **GitHub Pages** - Free hosting for public repos

### **Build Configuration**

For deployment, ensure:
- API base URL is correctly configured
- Environment variables are set
- Build optimization is enabled
- HTTPS is enforced

## 📈 **Performance**

The application is optimized for performance with:

- **Code Splitting** - Lazy loading of routes
- **Tree Shaking** - Unused code elimination  
- **Asset Optimization** - Minified CSS/JS
- **Caching** - Service worker for offline support
- **Bundle Analysis** - Webpack bundle analyzer

## 🔒 **Security**

Security features include:

- **JWT Authentication** - Secure token-based auth
- **Route Protection** - Authenticated routes only
- **Role-Based Access** - Admin/user permissions
- **XSS Protection** - Input sanitization
- **HTTPS Only** - Secure communication

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**

- Follow TypeScript best practices
- Use semantic commit messages
- Write tests for new features
- Follow the established architecture patterns
- Ensure responsive design

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library
- **React Community** - Amazing ecosystem and support

---

**Built with ❤️ using modern React and TypeScript**