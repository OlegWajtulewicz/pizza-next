'use client';

import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Category } from '@prisma/client';
import { CreateCategoryFormSchema, CreateCategoryFormValues } from './constants';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createCategory, updateCategory } from '@/app/actions';
import { DashboardFormHeader } from '../../dashboard-form-header';
import { FormInput } from '@/shared/components';

interface Props {
  values?: Category;
}
interface CategoryCreateInput {
  name: string; 
  createdAt?: Date | string
  updatedAt?: Date | string
}

export const CreateCategoryForm: React.FC<Props> = ({ values }) => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<CreateCategoryFormValues>({
    defaultValues: {
      name: values?.name || '',
    },
    resolver: zodResolver(CreateCategoryFormSchema),
  });

  const onSubmit: SubmitHandler<CreateCategoryFormValues> = async (data) => {
    setLoading(true);
    try {

      if (!data.name) {
        throw new Error('Имя категории обязательно');
      }
  
      const categoryData: CategoryCreateInput = {
        name: data.name, // Приводим тип
      };
      
      if (params.id) {
        await updateCategory(+params.id, data);
      } else {
        await createCategory(categoryData);
        router.push('/dashboard/categories');
      }

      console.log(data);
    } catch (error) {
      console.log('Error [CREATE_CATEGORY]', error);
      toast.error('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DashboardFormHeader isEdit={!!values} loading={loading} />
        <div className="border shadow-sm rounded-lg grid grid-cols-2 gap-5 p-5">
          <FormInput name="name" label="Название категории" required />
        </div>
      </form>
    </FormProvider>
  );
};
