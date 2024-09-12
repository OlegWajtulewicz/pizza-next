// app/dashboard/login/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput, Container, Title } from '@/shared/components/shared';
import { TFormRegisterValue, formRegisterSchema } from '@/shared/components/shared/modals/auth-modal/forms/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { Button } from '@/shared/components';

export default function LoginPage() {
  const [error, setError] = useState('');
  const form = useForm({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  const onSubmit = async (data: TFormRegisterValue) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.ok) {
        router.push('/dashboard');
      } else {
        setError(result?.error || 'Ошибка входа');
      }
    } catch (error) {
      toast.error('Ошибка сервера');
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-100">
    <Container className="min-h-screen w-full flex justify-center">
      <div className="w-full p-6 bg-white shadow-md rounded-md">
        <Title text="Вход в админ-панель" size="lg" className="mb-6" />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormInput name="email" label="E-Mail" required />
            <FormInput type="password" name="password" label="Пароль" required />
            <Button type="submit" className="mt-4">
              Войти
            </Button>
          </form>
        </FormProvider>
      </div>
    </Container>
    </div>
  );
}
