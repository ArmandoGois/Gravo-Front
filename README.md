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
- **Husky** - Git hooks for pre-commit validation
- **lint-staged** - Run linters on staged files

## 🔀 Git Flow

This project follows a **Git Flow** branching strategy with strict conventions.

### Branch Structure

#### Main Branches

- **`master`** - Production-ready code. Deploys to production environment.
- **`qa`** - Quality Assurance environment. For final testing before production.
- **`develop`** - Integration branch. Latest development changes.

#### Supporting Branches

- **`feature/*`** - New features and non-critical enhancements
- **`hotfix/*`** - Critical fixes for production issues
- **`release/*`** - Release preparation

### Workflow

```
feature/login-form  →  develop  →  qa  →  master
                         ↓        ↓       ↓
                       Dev Env  QA Env  Production
```

### Branch Naming Conventions

```bash
# Features
feature/user-authentication
feature/dashboard-redesign
feature/export-to-pdf

# Hotfixes
hotfix/critical-login-bug
hotfix/payment-gateway-error

# Releases
release/v1.2.0
release/v2.0.0-beta
```

### Creating a Feature Branch

```bash
# Always branch from develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/my-new-feature

# Work on your feature...
git add .
git commit -m "feat: add user profile page"

# Push to remote
git push origin feature/my-new-feature

# Open PR to develop
```

### Creating a Hotfix

```bash
# Branch from master for critical fixes
git checkout master
git pull origin master

# Create hotfix branch
git checkout -b hotfix/critical-bug

# Fix the issue
git add .
git commit -m "fix: resolve critical authentication bug"

# Push and create PR to master AND develop
git push origin hotfix/critical-bug
```

### Creating a Release

```bash
# Branch from develop when ready for release
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/v1.2.0

# Update version, changelog, final adjustments
git add .
git commit -m "chore: prepare release v1.2.0"

# Push and create PR to qa first, then master
git push origin release/v1.2.0
```

### Commit Message Convention

This project uses **Conventional Commits** specification:

```bash
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Build system or dependencies changes
- **ci**: CI/CD configuration changes
- **chore**: Other changes that don't modify src or test files

#### Examples

```bash
feat: add user authentication module
feat(auth): implement OAuth2 login flow
fix: resolve memory leak in dashboard
fix(api): handle null response in user service
docs: update installation instructions
style: format code with prettier
refactor(hooks): simplify useAuth hook logic
perf: optimize image loading
test: add unit tests for login component
build: update next.js to v16
ci: add GitHub Actions workflow
chore: update dependencies
```

### Pull Request Rules

#### All PRs Must:

1. ✅ Pass CI/CD checks (linting, type checking, build)
2. ✅ Have at least **1 approval** from a team member
3. ✅ Include a clear description of changes
4. ✅ Reference related issues (if applicable)
5. ✅ Follow conventional commit messages
6. ✅ Have no merge conflicts

#### PR Flow

```
feature/* → develop (requires 1 approval)
develop → qa (requires 1 approval)
qa → master (requires 1 approval)
hotfix/* → master + develop (requires 1 approval each)
release/* → qa → master (requires 1 approval each)
```

#### PR Template Suggestion

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Feature
- [ ] Bug Fix
- [ ] Hotfix
- [ ] Documentation
- [ ] Refactoring

## Testing

- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests passing

## Screenshots (if applicable)

[Add screenshots here]

## Related Issues

Closes #123
```

### Branch Protection Rules

The following branches are **protected** and require PRs:

#### `master`, `qa`, `develop`

- ❌ No direct pushes
- ✅ Pull requests required
- ✅ Require 1 approval
- ✅ Require status checks to pass
- ✅ Require branches to be up to date before merging
- ✅ Require linear history (squash or rebase)

### Pre-commit Hooks

Husky runs automatically before each commit:

```bash
# Runs on staged files only
1. ESLint --fix
2. TypeScript type checking (tsc-files)
```

If validation fails, the commit will be blocked. Fix the issues and try again.

### Best Practices

1. **Keep branches updated**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/my-feature
   git rebase develop
   ```

2. **Squash commits when merging**
   - Keep history clean
   - One feature = one commit in main branches

3. **Delete branches after merge**

   ```bash
   git branch -d feature/my-feature
   git push origin --delete feature/my-feature
   ```

4. **Review before pushing**

   ```bash
   git status
   git diff
   git log --oneline -5
   ```

5. **Never commit sensitive data**
   - API keys
   - Passwords
   - Tokens
   - Use `.env.local` (gitignored)

6. **Write meaningful commit messages**
   - ❌ `fix stuff`
   - ❌ `update`
   - ✅ `feat(auth): add password reset functionality`
   - ✅ `fix(dashboard): resolve data loading race condition`

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
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, error } = useQuery({
  queryKey: ["users"],
  queryFn: () => httpService.get("/users"),
});
```

## 💾 Zustand Usage

Example store creation:

```typescript
import { create } from "zustand";

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
