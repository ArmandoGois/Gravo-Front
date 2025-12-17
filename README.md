# Gravo Frontend

Next.js 15 application with Clean Architecture, TypeScript, and development best practices.

## 🏗️ Architecture

This project follows **Clean Architecture** principles, organizing code into well-defined layers:

```
src/
├── domain/              # Domain layer (entities and interfaces)
│   ├── entities/        # Business models
│   └── interfaces/      # Repository and service contracts
├── application/         # Application layer (use cases)
│   └── features/        # Use cases organized by feature
│       └── auth/
├── infrastructure/      # Infrastructure layer (implementations)
│   ├── services/        # HTTP services, API clients
│   ├── stores/          # Zustand stores
│   └── providers/       # React Context Providers
├── presentation/        # Presentation layer (UI)
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── common/      # Shared components
│   │   └── features/    # Feature-specific components
│   └── hooks/           # Custom React hooks
├── app/                 # Next.js App Router
└── lib/                 # Utilities and helpers
```

## 🛠️ Tech Stack

### Core
- **Next.js 15** - React framework with App Router
- **TypeScript** - Static typing
- **React 19** - UI library

### State and Data Fetching
- **Zustand** - Lightweight global state management
- **TanStack Query (React Query)** - Data fetching, caching, synchronization

### Forms and Validation
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### UI and Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable and accessible UI components
- **Lucide React** - Icons
- **class-variance-authority** - Component variants

### HTTP and Utilities
- **Axios** - HTTP client with interceptors
- **dayjs** - Lightweight date manipulation
- **clsx** + **tailwind-merge** - CSS class utilities

### Code Quality
- **ESLint** - Linter with Airbnb configuration
- **TypeScript ESLint** - TypeScript-specific rules

## 🔐 Authentication

The project implements a **custom** authentication system with httpOnly cookies:

1. **httpOnly Cookies**: Tokens stored in httpOnly cookies (more secure than localStorage)
2. **API Routes**: Next.js API routes act as proxy to the backend
3. **Zustand Store**: Authenticated user state management
4. **Middleware**: Authentication-based route protection
5. **Axios Interceptors**: Automatic refresh token handling

### Authentication Flow

```
Client → Next.js API Route → Backend API
                ↓
         httpOnly cookie
                ↓
        Zustand Store (user info)
```

## 📦 Path Aliases

The project uses layer-specific path aliases for clean imports:

```typescript
@/domain/*          → src/domain/*
@/application/*     → src/application/*
@/infrastructure/*  → src/infrastructure/*
@/presentation/*    → src/presentation/*
@/app/*            → src/app/*
@/lib/*            → src/lib/*
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22.17.0 (recommended via nvm)
- pnpm (recommended)

### Node Version Management

This project uses [nvm](https://github.com/nvm-sh/nvm) to ensure consistent Node.js versions across all environments.

#### Installing nvm

**Linux/macOS:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

**Windows:**
Download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

#### Using nvm with this project

```bash
# Install the project's Node.js version
nvm install

# Use the project's Node.js version
nvm use

# Verify the version
node -v  # Should output: v22.17.0
```

The `.nvmrc` file at the root of the project specifies the exact Node.js version (22.17.0) to use.

### Installation

```bash
# Install dependencies
pnpm install

# Configure environment variables
# Edit .env.local with your API URL
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development

```bash
# Start development server
pnpm dev

# Server will be available at http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
# Run ESLint
pnpm lint
```

## 📁 Feature Structure

Each feature is organized following Clean Architecture:

```
feature/
├── domain/
│   ├── entities/          # user.entity.ts
│   └── interfaces/        # user.repository.interface.ts
├── application/
│   └── features/
│       └── auth/
│           └── use-cases/ # login.use-case.ts
├── infrastructure/
│   ├── services/          # auth.service.ts
│   └── stores/            # auth.store.ts
└── presentation/
    └── components/
        └── features/
            └── auth/      # login-form.tsx
```

## 🎨 UI Components (shadcn/ui)

shadcn/ui components are located in `src/presentation/components/ui/`. To add new components:

```bash
npx shadcn@latest add [component-name]
```

Installed components:
- Button
- Input
- Label
- Card
- Dialog
- Form

## 🔄 React Query Usage

Example usage with TanStack Query:

```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => httpService.get('/users'),
});
```

## 💾 Zustand Usage

Example store creation:

```typescript
import { create } from 'zustand';

interface MyStore {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## 📝 Code Conventions

### Naming
- **Components**: PascalCase (`LoginForm.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types/Interfaces**: PascalCase (`User`, `UserCredentials`)

### File Structure
- One component per file
- Export components as named exports or default
- Place types close to their usage

### ESLint
- Airbnb configuration adapted for Next.js
- Arrow functions for components
- Automatically organized imports
- Don't use `any` (use `unknown` if necessary)

## 🧪 Included Examples

The project includes functional examples:

1. **Login Form** (`/login`) - Form with React Hook Form + Zod
2. **Dashboard** (`/dashboard`) - Protected page displaying user data
3. **Home Page** (`/`) - Landing page with shadcn/ui cards

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

## 🤝 Best Practices

1. **Separation of Concerns**: Each layer has a specific purpose
2. **Dependency Inversion**: Higher layers don't depend on lower ones
3. **Immutability**: Don't mutate state directly
4. **Composition**: Prefer composition over inheritance
5. **DRY**: Don't Repeat Yourself
6. **KISS**: Keep It Simple, Stupid

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

