// Dashboard page following Single Responsibility Principle

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserLoans } from '@/hooks/useLoans';
import { useLoanStats } from '@/hooks/useLoans';
import { BookOpen, BookOpenCheck, Clock, TrendingUp, Users, Library } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { loans: userLoans, loading: userLoansLoading } = useUserLoans(user?._id, { status: 'active' });
  const { stats, activeCount, overdueLoans, loading: statsLoading } = useLoanStats();

  const activeLoans = userLoans.filter(loan => !loan.returned);
  const overdueUserLoans = activeLoans.filter(loan => loan.isOverdue);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.username}!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your library today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
            <Library className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* User's Active Loans */}
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Active Loans</CardTitle>
            <BookOpenCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userLoansLoading ? '...' : activeLoans.length}</div>
            <p className="text-xs text-muted-foreground">
              {5 - activeLoans.length} remaining slots
            </p>
          </CardContent>
        </Card>

        {/* Overdue Books */}
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {userLoansLoading ? '...' : overdueUserLoans.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {overdueUserLoans.length > 0 ? 'Return ASAP' : 'All good!'}
            </p>
          </CardContent>
        </Card>

        {/* Admin Stats - System Active Loans */}
        {isAdmin && (
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Active Loans</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? '...' : activeCount}</div>
              <p className="text-xs text-muted-foreground">
                Books currently borrowed
              </p>
            </CardContent>
          </Card>
        )}

        {/* Admin Stats - Total Users/Books */}
        {isAdmin && (
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Overview</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.totalLoans || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total loans processed
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Common tasks you might want to perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/books">
              <Button className="w-full justify-start bg-gradient-primary hover:opacity-90">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Books
              </Button>
            </Link>
            <Link to="/loans">
              <Button variant="outline" className="w-full justify-start">
                <BookOpenCheck className="mr-2 h-4 w-4" />
                View My Loans
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="secondary" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Your latest library activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userLoansLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : activeLoans.length > 0 ? (
              <div className="space-y-3">
                {activeLoans.slice(0, 3).map((loan) => (
                  <div key={loan._id} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {loan.book?.title || 'Book Title'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {activeLoans.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{activeLoans.length - 3} more loans
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No active loans</p>
                <p className="text-xs text-muted-foreground">Start by browsing our book collection</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Overdue Alerts */}
      {isAdmin && overdueLoans.length > 0 && (
        <Card className="shadow-soft border-warning">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-warning">
              <Clock className="h-5 w-5" />
              <span>Overdue Loans Alert</span>
            </CardTitle>
            <CardDescription>
              These loans require immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueLoans.slice(0, 5).map((loan) => (
                <div key={loan._id} className="flex items-center justify-between p-2 bg-warning/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{loan.book?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      User: {loan.user?.username} • Due: {new Date(loan.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-xs text-warning font-medium">
                    {Math.ceil((Date.now() - new Date(loan.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                  </div>
                </div>
              ))}
              {overdueLoans.length > 5 && (
                <Link to="/admin/loans?status=overdue">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View All {overdueLoans.length} Overdue Loans
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};