import { RegistrationForm } from '@/presentation/components/features/auth/register-form';

const RegisterPage = () => (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 p-4 dark:from-zinc-950 dark:to-black bg-[url('/register-bg.jpg')]">
        <RegistrationForm />
    </div>
);

export default RegisterPage;