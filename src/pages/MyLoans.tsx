// My Loans page following Single Responsibility Principle

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserLoans } from '@/hooks/useLoans';
import { useLoanMutations } from '@/hooks/useLoans';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpenCheck, Calendar, Clock, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import type { Loan } from '@/types';

export const MyLoans: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  
  const { loans, loading, refetch } = useUserLoans(user?._id, { 
    status: activeTab as 'active' | 'returned' | 'all' 
  });
  
  const { returnBook, extendLoan, loading: mutationLoading } = useLoanMutations();

  const handleReturnBook = async (loanId: string) => {
    const success = await returnBook(loanId);
    if (success) {
      refetch();
    }
  };

  const handleExtendLoan = async (loanId: string) => {
    const success = await extendLoan(loanId, { additionalDays: 7 });
    if (success) {
      refetch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilDue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const LoanCard: React.FC<{ loan: Loan; showActions?: boolean }> = ({ loan, showActions = true }) => {
    const daysUntilDue = getDaysUntilDue(loan.dueDate);
    const isOverdue = daysUntilDue < 0;
    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
    
    return (
      <Card className={`shadow-soft hover:shadow-medium transition-shadow ${isOverdue ? 'border-destructive' : isDueSoon ? 'border-warning' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight">{loan.book?.title || 'Book Title'}</CardTitle>
              <CardDescription className="mt-1">
                by {loan.book?.author || 'Unknown Author'}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-1">
              {loan.returned ? (
                <Badge variant="secondary" className="bg-success text-success-foreground">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Returned
                </Badge>
              ) : isOverdue ? (
                <Badge variant="destructive">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Overdue
                </Badge>
              ) : isDueSoon ? (
                <Badge variant="outline" className="border-warning text-warning">
                  <Clock className="mr-1 h-3 w-3" />
                  Due Soon
                </Badge>
              ) : (
                <Badge variant="default">
                  <BookOpenCheck className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Borrowed</p>
              <p className="font-medium flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(loan.borrowedAt)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className={`font-medium flex items-center ${isOverdue ? 'text-destructive' : isDueSoon ? 'text-warning' : ''}`}>
                <Clock className="mr-1 h-3 w-3" />
                {formatDate(loan.dueDate)}
              </p>
            </div>
            {loan.returned && loan.returnedAt && (
              <div className="col-span-2">
                <p className="text-muted-foreground">Returned</p>
                <p className="font-medium flex items-center text-success">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {formatDate(loan.returnedAt)}
                </p>
              </div>
            )}
            {!loan.returned && (
              <div className="col-span-2">
                <p className="text-muted-foreground">Status</p>
                <p className={`font-medium ${isOverdue ? 'text-destructive' : isDueSoon ? 'text-warning' : 'text-foreground'}`}>
                  {isOverdue 
                    ? `${Math.abs(daysUntilDue)} days overdue` 
                    : daysUntilDue === 0 
                    ? 'Due today' 
                    : `${daysUntilDue} days remaining`
                  }
                </p>
              </div>
            )}
            {loan.extensionCount && loan.extensionCount > 0 && (
              <div className="col-span-2">
                <p className="text-muted-foreground">Extensions Used</p>
                <p className="font-medium">
                  {loan.extensionCount}/2 extensions used
                </p>
              </div>
            )}
          </div>

          {showActions && !loan.returned && (
            <div className="flex space-x-2">
              <Button
                onClick={() => handleReturnBook(loan._id)}
                disabled={mutationLoading}
                className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
              >
                {mutationLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-success-foreground border-t-transparent" />
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Return Book
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleExtendLoan(loan._id)}
                disabled={mutationLoading || isOverdue || (loan.extensionCount || 0) >= 2}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Extend (+7 days)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <BookOpenCheck className="h-8 w-8 text-primary" />
            <span>My Loans</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your borrowed books and loan history
          </p>
        </div>
        <Button onClick={refetch} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Loans</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
          <TabsTrigger value="all">All Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="ml-2 text-muted-foreground">Loading active loans...</span>
            </div>
          ) : loans.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpenCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active loans</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any books currently borrowed. Visit our catalog to find your next read!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {loans.map((loan) => (
                <LoanCard key={loan._id} loan={loan} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="returned" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="ml-2 text-muted-foreground">Loading returned loans...</span>
            </div>
          ) : loans.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No returned loans</h3>
                <p className="text-muted-foreground text-center">
                  Your loan history will appear here once you return some books.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {loans.map((loan) => (
                <LoanCard key={loan._id} loan={loan} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="ml-2 text-muted-foreground">Loading all loans...</span>
            </div>
          ) : loans.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpenCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No loan history</h3>
                <p className="text-muted-foreground text-center">
                  Start by borrowing your first book from our catalog!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {loans.map((loan) => (
                <LoanCard key={loan._id} loan={loan} showActions={!loan.returned} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      {!loading && loans.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Loan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{loans.filter(l => !l.returned).length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{loans.filter(l => l.returned).length}</p>
                <p className="text-sm text-muted-foreground">Returned</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {loans.filter(l => !l.returned && getDaysUntilDue(l.dueDate) < 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{loans.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};