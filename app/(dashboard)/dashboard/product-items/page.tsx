'use client';

import {  ProductItem } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/components/ui";
import { createProductItem, deleteProductItem } from "@/app/actions";
import toast from "react-hot-toast";
import { ProductItemUpdateInput } from "@/@types/next-auth";
import { CreateProductItemFormSchema } from "@/shared/components/shared/dashboard/forms/create-product-item-form/constants";
import { FormInput } from "@/shared/components";
import { FormSelect } from "@/shared/components/shared/form-components/form-select";


interface PageProps {
 // products: Product[];
//  defaultValues: CreateProductItemFormValues;
 // onSave: (data: CreateProductItemFormValues) => void;
}
interface Product {
  id: number;
  name: string;
  imageUrl: string;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}
type CreateProductItemFormValues = {
    price: string;
    productId: string;
    size?: string; 
    pizzaType?: string;
};

const DashboardProductItems: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const form = useForm<CreateProductItemFormValues>({
    defaultValues: { price: '', size: '', pizzaType: '', productId: '' },
    resolver: zodResolver(CreateProductItemFormSchema),
  });

  // Загрузка продуктов и productItems
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Выполняем оба запроса параллельно
        const [productItemsResponse, productsResponse] = await Promise.all([
          fetch('/api/product-item'),
          fetch('/api/products')
        ]);

        if (!productItemsResponse.ok || !productsResponse.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const productItemsData: ProductItem[] = await productItemsResponse.json();
        const productsData: Product[] = await productsResponse.json();

        setProductItems(productItemsData);
        setProducts(productsData);
      } catch (error) {
        console.error('Ошибка при запросе:', error);
        toast.error('Ошибка при загрузке данных.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Загрузка данных по productItem для редактирования
  useEffect(() => {
    if (params.id) {
      fetchProductItemById(Number(params.id)).then((fetchedItem) => {
        form.reset({
          price: fetchedItem.price.toString(),
          size: fetchedItem.size?.toString() || '',
          pizzaType: fetchedItem.pizzaType?.toString() || '',
          productId: fetchedItem.productId.toString(),
        });
        
        setIsEdit(true);
      }).catch((error) => {
        toast.error('Ошибка при загрузке данных товара.');
      });
    }
  }, [params.id, form]);

 

  // Сабмит формы
  const onSubmit: SubmitHandler<CreateProductItemFormValues> = async (data) => {
    setLoading(true);
    try {
      if (isEdit && params.id) {
        const updateData: ProductItemUpdateInput = {
            price: Number(data.price),
            size: data.size ? Number(data.size) : null,
            pizzaType: data.pizzaType ? Number(data.pizzaType) : null,
            productId: Number(data.productId),
        };

        // Отправляем запрос на обновление по правильному адресу
        await fetch(`/api/product-item/${params.id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        toast.success("Товар успешно обновлён!");
      } else {
        await createProductItem({
          price: Number(data.price),
          size: data.size ? Number(data.size) : null,
          pizzaType: data.pizzaType ? Number(data.pizzaType) : null,
          productId: Number(data.productId),
        });
        toast.success("Товар успешно создан!");
      }
      router.push("/dashboard/product-items");
    } catch (error) {
      toast.error("Произошла ошибка!");
    } finally {
      setLoading(false);
      setIsEdit(false);
      form.reset();
    }
  };

  const fetchProductItemById = async (id: number) => {
    const response = await fetch(`/api/product-item/${id}`);
    if (!response.ok) {
      throw new Error('Не удалось получить элемент продукта');
    }
    return response.json();
  };
  
  const handleEdit = async (item: ProductItem) => {
    console.log(`Редактирование элемента: ${item.id}`);
    try {
      const fetchedItem = await fetchProductItemById(item.id);
      console.log('Извлеченный элемент для редактирования:', fetchedItem);
      form.reset({
        price: fetchedItem.price.toString(),
        size: fetchedItem.size ? fetchedItem.size.toString() : '',
        pizzaType: fetchedItem.pizzaType ? fetchedItem.pizzaType.toString() : '',
        productId: fetchedItem.productId.toString(),
      });
      setIsEdit(true);
      params.id = String(item.id); 
      
    } catch (error) {
      toast.error('Ошибка при загрузке данных товара.');
    }
  };

  const handleCancelEdit = () => {
    form.reset();
    setIsEdit(false);
    router.push("/dashboard/product-items");
  };

  // Удаление товара
  const handleDelete = async (id: number) => {
    try {
      if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
        await deleteProductItem(id);
        setProductItems((prevItems) => prevItems.filter((item) => item.id !== id));
        toast.success('Товар успешно удалён!');
      }
    } catch {
      toast.error('Ошибка при удалении товара.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление карточкой товара</h1>
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "Редактировать товар" : "Создать новый товар"}
      </h2>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <FormInput
              name="price"
              value={form.watch("price")}
              label="Цена"
              required
              type="number"
              step="0.01"
              placeholder="Цена"
            />
            <FormSelect
              name="size"
              value={form.watch("size")}
              label="Размер продукта"
              placeholder="Размер..."
              items={[
                { value: "20", label: "20" },
                { value: "30", label: "30" },
                { value: "40", label: "40" },
              ]}
            />
            <FormSelect
              name="pizzaType"
              value={form.watch("pizzaType")}
              label="Тип продукта"
              placeholder="Тип..."
              items={[
                { value: "1", label: "Традиционное" },
                { value: "2", label: "Тонкое" },
              ]}
            />
            <FormSelect
              name="productId"
              value={form.watch("productId")}
              label="Продукт"
              placeholder="Выберите продукт..."
              items={products.map((product) => ({
                value: product.id.toString(),
                label: product.name,
              }))}
            />
            <div className="flex flex-col gap-2">
              <Button type="submit" loading={loading} className="h-12">
                {isEdit ? "Сохранить изменения" : "Создать"}
              </Button>
              {isEdit && (
                <Button onClick={handleCancelEdit} type="button" className="h-12">
                  Отменить
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
      {loading ? (
        <p>Загрузка...</p>
      ) : productItems.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-slate-500">
          <thead>
            <tr key={productItems[0].id} className="bg-gray-200 border border-gray-300">
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
                     ✏️ Редактировать
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
    </div>
  );
};

export default DashboardProductItems;
















// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useParams } from 'next/navigation';
// import { CreateProductItemFormSchema, CreateProductItemFormValues } from '@/shared/components/shared/dashboard/forms/create-product-item-form/constants';
// import ProductItemForm from '@/shared/components/shared/dashboard/forms/create-product-item-form/product-item-form-create';
// import toast from 'react-hot-toast';



// interface Product {
//   id: number;
//   name: string;
//   imageUrl: string;
//   categoryId: number;
//   createdAt: Date;
//   updatedAt: Date;
// }



// export default function DashboardProductItems() {
//   const { id } = useParams<{ id: string }>();
//   const [isEdit, setIsEdit] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);



//   const form = useForm<CreateProductItemFormValues>({
//     defaultValues: { price: '', size: '', pizzaType: '', productId: '' },
//     resolver: zodResolver(CreateProductItemFormSchema),
//   });

//   const fetchProductItemById = async (id: number) => {
//     const response = await fetch(`/api/product-item/${id}`);
//     if (!response.ok) {
//       throw new Error('Не удалось получить элемент продукта');
//     }
//     return response.json();
//   };

//   useEffect(() => {
//     if (id) {
//       fetchProductItemById(Number(id)).then((fetchedItem) => {
//         form.reset({
//           price: fetchedItem.price.toString(),
//           size: fetchedItem.size?.toString() || '',
//           pizzaType: fetchedItem.pizzaType?.toString() || '',
//           productId: fetchedItem.productId.toString(),
//         });
        
//         setIsEdit(true);
//       }).catch((error) => {
//         toast.error('Ошибка при загрузке данных товара.');
//       });
//     }
//   }, [id, form]);

//   const handleSave = (data: CreateProductItemFormValues) => {
//     // Здесь реализуйте логику сохранения данных
//     toast.success(isEdit ? 'Товар обновлен' : 'Товар создан');
//   };
  

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Управление карточкой товара</h1>
//       <ProductItemForm   
//         products={products} 
//         defaultValues={{
//           price: '',
//           productId: '',
//           size: '',
//           pizzaType: '',
//         }} 
//         onSave={handleSave}
//         />
//     </div>
//   );
// }




