import Link from 'next/link';

import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';

const Home = () => (
  <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
    <main className="flex w-full max-w-4xl flex-col gap-8 px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Gravo IA Frontend
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Next.js 15 project with Clean Architecture, TypeScript, and best practices
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>🏗️ Clean Architecture</CardTitle>
            <CardDescription>
              Structure organized by layers: Domain, Application, Infrastructure, Presentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>✓ Domain: Entities e Interfaces</li>
              <li>✓ Application: Use Cases por feature</li>
              <li>✓ Infrastructure: Services y Stores</li>
              <li>✓ Presentation: Components UI</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🛠️ Tech Stack</CardTitle>
            <CardDescription>
              The best tools from the React ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>✓ Next.js 15 (App Router)</li>
              <li>✓ TypeScript + ESLint Airbnb</li>
              <li>✓ Zustand + TanStack Query</li>
              <li>✓ Tailwind CSS + shadcn/ui</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔐 Authentication</CardTitle>
            <CardDescription>
              Custom auth system with httpOnly cookies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>✓ httpOnly Cookies (secure)</li>
              <li>✓ Zustand for global state</li>
              <li>✓ Middleware for protected routes</li>
              <li>✓ API Routes as proxy</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📦 Utilities</CardTitle>
            <CardDescription>
              Configured tools and libraries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>✓ React Hook Form + Zod</li>
              <li>✓ dayjs (dates)</li>
              <li>✓ Axios with interceptors</li>
              <li>✓ Specific path aliases</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/login">
            View Login Example
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/chathub">
            Go to Chat Hub
          </Link>
        </Button>
      </div>

      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          Proyecto configurado con las mejores prácticas de desarrollo
        </p>
      </div>
    </main>
  </div>
);

export default Home;
