'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon, LockIcon, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/presentation/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/presentation/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from '@/presentation/components/ui/form';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from '@/presentation/components/ui/input-group'; //
import { useAuth } from '@/presentation/hooks/use-auth';


const registrationSchema = z.object({
    email: z.string().min(1, 'El email es requerido').email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas deben coincidir',
    path: ['confirmPassword'],
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const RegistrationForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register: registerUser, isRegistrationLoading, registrationError } = useAuth();

    const form = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: RegistrationFormValues) => {
        registerUser({ email: data.email, password: data.password });
    };

    return (
        <div className="relative inline-block">
            <Card className="w-120 h-140.75 rounded-4xl relative shadow-lg bg-white/70 backdrop-blur-md border border-white/20">
                <CardHeader className="space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm">
                            <Image
                                src="/sign-in.svg"
                                alt="Vector icon"
                                width={48}
                                height={48}
                            />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">Sign Up</CardTitle>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            {/*MailField*/}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            {/* Forzamos bg-white y eliminamos cualquier transparencia dark */}
                                            <InputGroup className="bg-white dark:bg-white border-white/30 transition-all h-12 shadow-sm  rounded-2xl">
                                                <InputGroupAddon>
                                                    <MailIcon className="h-4 w-4 text-gray-500" />
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    {...field}
                                                    type="email"
                                                    placeholder="example@mail.com"
                                                    className="text-black bg-white"
                                                />
                                            </InputGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/*PasswordField*/}
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

                            {/*ConfirmPasswordField*/}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <InputGroup className="bg-white dark:bg-white border-white/30 h-12 shadow-sm rounded-2xl">
                                                <InputGroupAddon>
                                                    <LockIcon className="h-4 w-4 text-gray-500" />
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    {...field}
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm password"
                                                    className="flex-1 text-black bg-white border-0 focus-visible:ring-0"
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="mr-2 text-gray-500 hover:text-gray-700 transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Errors */}
                            {
                                (form.formState.errors.email || form.formState.errors.password || form.formState.errors.confirmPassword) && (
                                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20">
                                        {form.formState.errors.email?.message ||
                                            form.formState.errors.password?.message ||
                                            form.formState.errors.confirmPassword?.message}
                                    </div>
                                )
                            }

                            {
                                registrationError && (
                                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                        Error al registrarse. Verifica tus credenciales.
                                    </div>
                                )
                            }

                            <Button
                                type="submit"
                                className="w-full rounded-4xl h-12 text-lg font-semibold"
                                disabled={isRegistrationLoading}
                            >
                                {isRegistrationLoading ? 'Signing Up...' : 'Sign Up!'}
                            </Button>
                        </form >
                    </Form >
                </CardContent >
            </Card >
        </div >
    );
};