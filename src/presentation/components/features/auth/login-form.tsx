'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon, LockIcon, Eye, EyeOff } from "lucide-react";
import Image from 'next/image';
import { useState } from 'react';
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

import { InputGroup, InputGroupAddon, InputGroupInput } from '../../ui/input-group';



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
  const [showPassword, setShowPassword] = useState(false);
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



  return (
    <Card className="w-120 h-140.75 rounded-4xl relative shadow-lg bg-white/70 backdrop-blur-md border border-white/20" >
      <CardHeader className="space-y-6 text-center">
        {/*Logo*/}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16  rounded-2xl bg-white/10">
            <Image
              src="/vector.svg"
              alt="Vector icon"
              width={48}
              height={48}
            />
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
                        className="pl-10 bg-white opacity-100 text-black"
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
                    <InputGroup className="bg-white dark:bg-white border-white/30 h-12 shadow-sm rounded-2xl">
                      <InputGroupAddon>
                        <LockIcon className="h-4 w-4 text-gray-500" />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Input password"
                        className="flex-1 text-black bg-white border-0 focus-visible:ring-0"
                      />
                      <InputGroupAddon align="inline-end">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="mr-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />


            {/*Recuperar contraseña*/}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="px-0 font-medium text-primary hover:text-primary/80">
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
              className="w-full h-18 text-base font-semibold bg-secondary-black text-primary-foreground rounded-4xl"
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