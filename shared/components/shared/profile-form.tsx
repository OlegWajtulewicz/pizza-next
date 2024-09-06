'use client';

import React from 'react';
import { Container, FormInput } from '@/shared/components/shared';

import {
  TFormRegisterValue,
  formRegisterSchema,
} from '@/shared/components/shared/modals/auth-modal/forms/schemas';
import { Title } from './title';
import { Button } from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User } from '@prisma/client';
import { signOut } from 'next-auth/react';
import { updateUserInfo } from '@/app/actions';

interface Props {
  data: User;
}

export const ProfileForm: React.FC<Props> = ({ data }) => {
  const form = useForm({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: TFormRegisterValue) => {
    try {
      await updateUserInfo({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      toast.error('Данные обновлены 📝', {
        icon: '✅',
      });
    } catch (error) {
      return toast.error('Ошибка при обновлении данных', {
        icon: '❌',
      });
    }
  };

  const onClickSignOut = () => {
    signOut({
      callbackUrl: '/',
    });
  };

  return (
    <Container className="my-10">
      <div className='w-full flex flex-col items-center '>
        <Title text={`Личные данные | #${data.id}`}  size="md" className="font-bold" />

        <FormProvider {...form}>
          <form className="flex flex-col gap-5 sm:w-96 w-[100%] mt-10" onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput className='w-full' name="email" label="E-Mail" required />
            <FormInput className='w-full' name="fullName" label="Полное имя" required />

            <FormInput className='w-full' type="password" name="password" label="Новый пароль" required />
            <FormInput className='w-full' type="password" name="confirmPassword" label="Повторите пароль" required />

            <Button disabled={form.formState.isSubmitting} className="text-base mt-10 w-full" type="submit">
              Сохранить
            </Button>

            <Button
              onClick={onClickSignOut}
              variant="secondary"
              disabled={form.formState.isSubmitting}
              className="text-base w-full"
              type="button">
              Выйти
            </Button>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
};
