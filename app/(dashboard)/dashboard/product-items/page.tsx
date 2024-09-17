'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { createProductItem, deleteProductItem, updateProductItem } from '@/app/actions';
import { CreateProductItemFormSchema, CreateProductItemFormValues } from '@/shared/components/shared/dashboard/forms/create-product-item-form/constants';
import { FormInput } from '@/shared/components/shared/form-components/form-input';
import { FormSelect } from '@/shared/components/shared/form-components/form-select';
import { Button } from '@/shared/components/ui';

interface Props {
  values?: ProductItem;
  products: Product[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  size: number | null;
  pizzaType: number | null;
  productId: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductItem {
  id: number;
  price: number;
  size: number | null;
  pizzaType: number | null;
  productId: number;
 // createdAt: Date;
 // updatedAt: Date;
createdAt: string;
  updatedAt: string;
  name: string; 
}

export default function DashboardProductItems({ values }: Props) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [isEdit, setIsEdit] = useState(false); 
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/product-item');
        if (!response.ok) {
          throw new Error(`Ошибка при получении данных: ${response.statusText}`);
        }
        const data: ProductItem[] = await response.json();
        setProductItems(data);
      } catch (error) {
        console.error('Ошибка при запросе:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductItems();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`Ошибка при получении данных: ${response.statusText}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
      }
    };

    fetchProducts();
  }, []);

  

  const form = useForm<CreateProductItemFormValues>({
    defaultValues: {
      price: values?.price ? String(values.price) : '',
      size: values?.size ? String(values.size) : '',
      pizzaType: values?.pizzaType ? String(values.pizzaType) : '',
      productId: values?.productId ? String(values.productId) : '',
    },
    resolver: zodResolver(CreateProductItemFormSchema),
  });

//   useEffect(() => {
//     form.reset({
//       price: '',
//       size: '',
//       pizzaType: '',
//       productId: '',
//     });
//   }, [values, form]);

  const onSubmit = async (data: CreateProductItemFormValues) => {
    try {
      if (values?.id) {
        await updateProductItem(values.id, {
          price: Number(data.price),
          size: data.size ? Number(data.size) : null,
          pizzaType: data.pizzaType ? Number(data.pizzaType) : null,
          product: { connect: { id: Number(data.productId) } },
        });
        toast.success('Товар успешно обновлён!');
      } else {
        await createProductItem({
          price: Number(data.price),
          size: data.size ? Number(data.size) : null,
          pizzaType: data.pizzaType ? Number(data.pizzaType) : null,
          productId: Number(data.productId),
        });
        toast.success('Товар успешно создан!');
      }
      form.reset();
      router.push('/dashboard/product-items');
    } catch (error) {
      toast.error('Произошла ошибка!');
    }
  };

  const handleEdit = (item: ProductItem) => {
    form.setValue('price', String(item.price));
    form.setValue('size', String(item.size || ''));
    form.setValue('pizzaType', String(item.pizzaType || ''));
    form.setValue('productId', String(item.productId));
     params.id = String(item.id);
    setIsEdit(true);
  };

  const handleCancelEdit = () => {
    form.reset();
    setIsEdit(false);
    params.id = ''; // Clear the ID to exit edit mode
  };

  const handleDelete = async (id: number) => {
    try {
        if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
            await deleteProductItem(id);
            setProductItems((prevItems) => prevItems.filter((item) => item.id !== id));
            toast.success('Товар успешно удалён!');
        }
    } catch (error) {
      toast.error('Произошла ошибка при удалении товара.');
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление карточкой товара</h1>

      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">
          {params.id ? 'Редактировать товар' : 'Создать новый товар'}
        </h2>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormInput
                name="price"
                value={form.watch('price')}
                label="Цена"
                required
                type="number"
                step="0.01"
                placeholder="Цена" 
                />
              <FormSelect
                value={form.watch('size')}
                name="size"
                label="Размер продукта"
                placeholder="Размер..."
                items={[
                    {
                      value: '20',
                      label: '20',
                    },
                    {
                      value: '30',
                      label: '30',
                    },
                    {
                      value: '40',
                      label: '40',
                    },
                  ]}
                />
              <FormSelect
                name="pizzaType"
                value={form.watch('pizzaType')}
                label="Тип продукта"
                placeholder="Тип..." 
                items={[
                    {
                      value: '1',
                      label: 'Традиционное',
                    },
                    {
                      value: '2',
                      label: 'Тонкое',
                    },
                  ]}
                />
              <FormSelect
                name="productId"
                value={form.watch('productId')}
                label="Продукт"
                placeholder="Выберите продукт..."
                items={products.map((product) => ({
                  value: product.id.toString(),
                  label: product.name,
                }))} />
              <div className="flex flex-col gap-2">
                <Button type="submit" loading={loading} className="h-12">
                  {params.id ? 'Сохранить изменения' : 'Создать'}
                </Button>
                {params.id && (
                  <Button onClick={handleCancelEdit} type="button" className="h-12">
                    Отменить
                  </Button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : productItems.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-slate-500">
          <thead>
            <tr className="bg-gray-200 border border-gray-300">
              <th className="px-2 py-2">ID</th>
              <th>Цена</th>
              <th>Размер</th>
              <th>Тип</th>
              <th>ПродуктID</th>
              <th>Дата создания</th>
              <th>Последнее обновление</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {productItems.map((item) => (
              <tr key={item.id} className="border border-gray-300 text-center">
                <td className="px-2 py-2">{item.id}</td>
                <td className="px-2 py-2">{item.price} ₽</td>
                <td className="px-2 py-2">{item.size ?? 'Не указано'}</td>
                <td className="px-2 py-2">{item.pizzaType ?? 'Не указано'}</td>
                <td className="px-2 py-2">{item.productId}</td>
                <td className="px-2 py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-2 py-2">{new Date(item.updatedAt).toLocaleDateString()}</td>
                <td className="px-2 py-2">
                  <div className="flex gap-1 justify-center flex-col flex-wrap h-full">
                    <Button
                      className="h-[1.7rem]"
                      onClick={() => handleEdit(item)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      className="h-[1.7rem]"
                      onClick={() => handleDelete(item.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Нет данных</p>
      )}
    </div>
  );
}
