'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon } from "lucide-react";
import { useForm } from 'react-hook-form';
import * as z from 'zod';


import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/presentation/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/presentation/components/ui/form';
import { Input } from '@/presentation/components/ui/input';
import { useAuth } from '@/presentation/hooks/use-auth';

import { PasswordInput } from '../../ui/password-input';


// Esquema de validación con Zod 
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, isLoginLoading, loginError } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  const handleForgotPassword = () => {
    console.log('Recuperar contraseña');
  };

  return (
    <Card className="w-120 h-140.75 rounded-4xl" >
      <CardHeader className="space-y-6 text-center">
        {/*Logo*/}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16  bg-white">
            <img src="/vector.svg" className="w-16 h-16" />
          </div>
        </div>

        {/*Título*/}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Sign in with email</h1>
        </div>
      </CardHeader>

      <CardContent className="pt-6 gap-12">
        {/* Formulario */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Campo Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="example"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*Contraseña */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      placeholder="input password"
                      className="h-12 bg-background border-input focus:border-primary focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*Recuperar contraseña*/}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="px-0 font-medium text-primary hover:text-primary/80"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </Button>
            </div>

            {/*Error de login */}
            {loginError && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/50">
                Error al iniciar sesión. Verifica tus credenciales.
              </div>
            )}

            {/* Botón Get Started*/}
            <Button
              type="submit"
              className="w-full h-18 text-base font-semibold bg-custom-gray text-primary-foreground rounded-4xl"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? 'Iniciando sesión...' : 'Get started'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};