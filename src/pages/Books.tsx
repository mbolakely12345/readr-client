// Books catalog page following Single Responsibility Principle

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBooks } from '@/hooks/useBooks';
import { useLoanMutations } from '@/hooks/useLoans';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Search, Filter, BookMarked, User } from 'lucide-react';
import type { Book } from '@/types';

export const Books: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  
  const { books, loading, updateFilters } = useBooks({
    title: searchTerm,
    author: authorFilter,
    genre: genreFilter,
  });
  
  const { borrowBook, loading: borrowLoading } = useLoanMutations();

  const handleSearch = () => {
    updateFilters({
      title: searchTerm,
      author: authorFilter,
      genre: genreFilter,
    });
  };

  const handleBorrowBook = async (book: Book) => {
    if (!user) return;
    
    const success = await borrowBook({
      userId: user._id,
      bookId: book._id,
    });
    
    if (success) {
      // Refresh books to update available copies
      updateFilters({});
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setAuthorFilter('');
    setGenreFilter('');
    updateFilters({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span>Book Catalog</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and borrow from our extensive collection
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
          <CardDescription>
            Find the perfect book for your next read
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Author</label>
              <Input
                placeholder="Search by author..."
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <Input
                placeholder="Search by genre..."
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <div className="flex space-x-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="text-muted-foreground">Loading books...</span>
          </div>
        </div>
      ) : books.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or clear the filters to see all books.
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <Card key={book._id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-1 mt-1">
                      <User className="h-3 w-3" />
                      <span>{book.author}</span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant={book.availableCopies > 0 ? 'default' : 'secondary'}>
                      {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Genre</p>
                    <p className="font-medium">{book.genre}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ISBN</p>
                    <p className="font-medium text-xs">{book.isbn}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Available</p>
                    <p className="font-medium">{book.availableCopies}/{book.totalCopies}</p>
                  </div>
                  {book.category && (
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">{book.category}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleBorrowBook(book)}
                    disabled={book.availableCopies === 0 || borrowLoading}
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                  >
                    {borrowLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      <>
                        <BookMarked className="mr-2 h-4 w-4" />
                        {book.availableCopies > 0 ? 'Borrow' : 'Unavailable'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Count */}
      {!loading && books.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {books.length} book{books.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};