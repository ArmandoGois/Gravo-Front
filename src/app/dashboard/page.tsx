'use client';

import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { useAuth } from '@/presentation/hooks/use-auth';

const DashboardPage = () => {
  const { user, logout, isLogoutLoading } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 p-8 dark:from-zinc-950 dark:to-black">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <Button
            onClick={() => logout()}
            variant="outline"
            disabled={isLogoutLoading}
          >
            {isLogoutLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Authenticated user data from Zustand store
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">ID:</span> {user.id}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Name:</span> {user.name}
                </p>
                {user.role && (
                  <p className="text-sm">
                    <span className="font-semibold">Role:</span> {user.role}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No user information available
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Clean Architecture</CardTitle>
              <CardDescription>Well-separated layers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This dashboard demonstrates the use of use cases, stores, and
                UI components following Clean Architecture.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔐 Authentication</CardTitle>
              <CardDescription>httpOnly cookies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Authentication uses httpOnly cookies for maximum security,
                with Zustand for user state.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
