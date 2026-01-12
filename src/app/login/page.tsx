import { LoginForm } from '@/presentation/components/features/auth/login-form';

const LoginPage = () => (

  <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 p-4 dark:from-zinc-950 dark:to-black bg-[url('/login-bg.jpg')] bg-no-repeat">
    <LoginForm />
  </div>
);

export default LoginPage;
