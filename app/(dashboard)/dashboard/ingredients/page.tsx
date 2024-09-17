'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { UploadButton } from '@/shared/lib/uploadthing';

import {
  CreateIngredientFormSchema,
  CreateIngredientFormValues,
} from '@/shared/components/shared/dashboard/forms/create-ingredient-form/constants';
import { createIngredient, updateIngredient, deleteIngredient } from '@/app/actions';
import { Ingredient } from '@prisma/client';
import { cn } from '@/shared/lib/utils';
import { Button, Input } from '@/shared/components/ui';

const DashboardIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingIngredientId, setEditingIngredientId] = useState<number | null>(null);
  

  const form = useForm<CreateIngredientFormValues>({
    defaultValues: {
      name: '',
      imageUrl: '',
      price: '',
    },
    resolver: zodResolver(CreateIngredientFormSchema),
  });

  const router = useRouter();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    setLoading(true);
    const fetchIngredients = async () => {
      
      try {
        const response = await fetch('/api/ingredients');
        const data = await response.json();
        setIngredients(data);
      } catch (error) {
        toast.error('Не удалось загрузить ингредиенты');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const handleCreateIngredient: SubmitHandler<CreateIngredientFormValues> = async (data) => {
    if (!data.name || !data.price || !data.imageUrl) {
      toast.error('Заполните все обязательные поля!');
      return; 
    }
    try {
      const fields = { ...data, price: Number(data.price) };

      if (params.id) {
        await updateIngredient(+params.id, fields);
      } else {
        await createIngredient({
          ...fields,
          imageUrl: fields.imageUrl || '',
        });
        router.push('/dashboard/ingredients');
      }

      toast.success('Ингредиент сохранен');
      form.reset();
      setEditingIngredientId(null); // Reset editing state
    } catch (error) {
      toast.error('Ошибка при сохранении ингредиента');
    }
  };

  const handleCancelEdit = () => {
    form.reset();
    setEditingIngredientId(null); 
    router.push('/dashboard/ingredients'); 
  };

  const onUploadSuccess = (url: string) => {
    form.setValue('imageUrl', url);
    toast.success('Файл успешно загружен!');
  };

  const onUploadError = (error: Error) => {
    toast.error('Не удалось загрузить файл');
  };

  const onClickRemoveImage = () => {
    form.setValue('imageUrl', '');
  };

  const handleDeleteIngredient = async (id: number) => {
    try {
      if (confirm('Вы уверены, что хотите удалить этот ингредиент?')) {
        await deleteIngredient(id);
        toast.success('Ингредиент удален');
        setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
      }
    } catch (error) {
      toast.error('Ошибка удаления ингредиента');
    }
  };

  const imageUrl = form.watch('imageUrl');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление ингредиентами</h1>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleCreateIngredient)}>
          <div className=" mb-12">
            <h2 className="text-xl font-bold mb-4">
              {params.id ? 'Редактировать ингредиент' : 'Создать новый ингредиент'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                className="h-12"
                placeholder="Название ингредиента"
                {...form.register('name')}
              />
              <Input
                className="h-12"
                placeholder="Цена ингредиента"
                {...form.register('price')}
              />
              <Input
                className="h-12"
                value={imageUrl}
                onChange={(e) => form.setValue('imageUrl', e.target.value)}
                placeholder="URL изображения"
              />
              {imageUrl ? (
                <div className="relative border-gray-200 border rounded-md">
                <div className='h-full w-full flex justify-center items-center'>
                    <img className="object-cover rounded" src={imageUrl} alt="Изображение" />
                </div>
                  <Button
                    type='button'
                    onClick={onClickRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 rounded-sm p-2"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </div>
              ) : (
                <div>
                  <UploadButton
                    className={cn(
                      'border rounded-md h-12 color-black border-gray-200 opacity-100 text-opacity-100 text-center mb-2'
                    )}
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => onUploadSuccess(res[0].url)}
                    onUploadError={onUploadError}
                  />
                  {form.formState.errors.imageUrl && (
                    <p className="text-red-500 text-sm mt-2">
                      {form.formState.errors.imageUrl.message}
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Button type="submit" loading={loading} className="h-12">
                  {params.id ? 'Сохранить изменения' : 'Создать'}
                </Button>
                {params.id && (
                  <Button type="button" loading={loading} onClick={handleCancelEdit} className="h-12">
                    Отменить
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>

      {loading ? (
        <p>Загрузка...</p>
      ) : ingredients.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-slate-500">
          <thead>
            <tr className="bg-gray-200 border border-gray-300">
              <th className="px-2 py-2">ID</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Изображение</th>
              <th>Дата создания</th>
              <th>Последнее обновление</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient.id}>
                <td className='text-center'>{ingredient.id}</td>
                <td>{ingredient.name}</td>
                <td className='text-center'>{ingredient.price} ₽</td>
                <td className="items-center flex justify-center border-none">
                  {ingredient.imageUrl && (
                    <img src={ingredient.imageUrl} alt={ingredient.name} className="w-16 h-16 object-cover" />
                  )}
                </td>
                <td className='text-center'>{new Date(ingredient.createdAt).toLocaleDateString()}</td>
                <td className='text-center'>{new Date(ingredient.updatedAt).toLocaleDateString()}</td>
                <td className="text-center">
                  <div className="flex gap-1 justify-center flex-col flex-wrap h-full">
                    <Button
                      className="h-[1.7rem]"
                      onClick={() => {
                        form.setValue('name', ingredient.name);
                        form.setValue('price', String(ingredient.price));
                        form.setValue('imageUrl', ingredient.imageUrl);
                        params.id = String(ingredient.id);
                      }}
                    >
                      Редактировать
                    </Button>
                    <Button className="h-[1.7rem]" onClick={() => handleDeleteIngredient(ingredient.id)}>
                      Удалить
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Ингредиенты отсутствуют</p>
      )}
    </div>
  );
};

export default DashboardIngredients;
