'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { createProduct, updateProduct, deleteProduct } from '@/app/actions';
import { UploadButton } from '@/shared/lib/uploadthing';
import { Button, Input } from '@/shared/components/ui';
import CategorySelect from '@/shared/components/shared/category-select';
import { Category, Product } from '@prisma/client';
import { cn } from '@/shared/lib/utils';
import { CreateProductFormSchema, CreateProductFormValues } from '@/shared/components/shared/dashboard/forms/create-product-form/constants';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface ProductWithCategory extends Product {
  category: Category;
}

const DashboardProducts = () => {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const form = useForm<CreateProductFormValues>({
    defaultValues: {
      name: '',
      imageUrl: '',
      category: '',
    },
    resolver: zodResolver(CreateProductFormSchema),
  });

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        toast.error('Не удалось загрузить продукты');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error('Не удалось загрузить категории');
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCreateProduct: SubmitHandler<CreateProductFormValues> = async (data) => {
    try {
      const categoryInput = {
        connect: { id: Number(data.category) },
      };

      const productData = {
        ...data,
        category: categoryInput,
      };

      await createProduct(productData);
      toast.success('Продукт создан');
      form.reset(); // Сброс формы после создания продукта
      router.push('/dashboard/products'); // Перенаправление на страницу продуктов
    } catch (error) {
      toast.error('Ошибка при создании продукта');
    }
  };

  const handleUpdateProduct: SubmitHandler<CreateProductFormValues> = async (data) => {
    if (!editingProductId) return; // Защита от пустого id

    try {
      const categoryInput = {
        connect: { id: Number(data.category) },
      };

      const updatedProductData = {
        ...data,
        category: categoryInput,
      };

      await updateProduct(editingProductId, updatedProductData);
      toast.success('Продукт обновлен');
      form.reset(); // Сброс формы после редактирования продукта
      setEditingProductId(null); // Сброс ID редактируемого продукта
      router.push('/dashboard/products');
    } catch (error) {
      toast.error('Ошибка при обновлении продукта');
    }
  };

  const handleCancelEdit = () => {
    form.reset();
    setEditingProductId(null);
    router.push('/dashboard/products');
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
        await deleteProduct(id);
        toast.success('Продукт удален');
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      }
    } catch (error) {
      toast.error('Ошибка удаления продукта');
    }
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

  const imageUrl = form.getValues('imageUrl');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление продуктами</h1>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(editingProductId ? handleUpdateProduct : handleCreateProduct)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Input
              className="h-9"
              placeholder="Название продукта"
              {...form.register('name')}
              required
            />
            <Input
              className="h-9"
              value={imageUrl}
              placeholder="URL изображения"
              {...form.register('imageUrl')}
            />
            {imageUrl ? (
                <div className="relative border-gray-200 border rounded-md">
                    <div className='h-full w-full flex justify-center items-center'>
                        <img className="object-cover rounded" src={imageUrl} alt="Изображение" />
                    </div>
                  <Button
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
                      'border rounded-md block  border-gray-200 h-9 opacity-100 text-opacity-100 text-center mb-2'
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
            <CategorySelect
              categories={categories}
              selectedCategoryId={+form.watch('category')}
              onChange={(value) => form.setValue('category', String(value))}
            />
            <div className="flex flex-col gap-2">
              <Button className="h-9" type="submit">
                {editingProductId ? 'Обновить' : 'Создать'}
              </Button>
              {editingProductId && (
                <Button type="button" onClick={handleCancelEdit} className="h-9">
                  Отменить
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>

      {/* Таблица продуктов */}
      <table className="min-w-full table-auto border-collapse border border-slate-500">
        <thead>
          <tr className="bg-gray-200 border border-gray-300">
            <th>ID</th>
            <th>Название</th>
            <th>Изображение</th>
            <th>Категория</th>
            <th>Дата создания</th>
            <th>Последнее обновление</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td className="items-center flex justify-center border-none">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover" />
                ) : (
                  <p>Изображение не доступно</p>
                )}
              </td>
              <td>{product.category.name}</td>
              <td>{new Date(product.createdAt).toLocaleDateString()}</td>
              <td>{new Date(product.updatedAt).toLocaleDateString()}</td>
              <td>
                <div className="flex gap-1 justify-center flex-col flex-wrap h-full">
                  <Button 
                    className="h-[1.7rem]"
                     onClick={() => {
                    form.setValue('name', product.name);
                    form.setValue('imageUrl', product.imageUrl);
                    form.setValue('category', String(product.category.id));
                    setEditingProductId(product.id);
                  }}>
                    Редактировать
                  </Button>
                  <Button className="h-[1.7rem]" onClick={() => handleDeleteProduct(product.id)}>
                    Удалить
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardProducts;










// 'use client';

// // pages/dashboard/products.tsx

// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { createProduct, updateProduct, deleteProduct } from '@/app/actions';
// import { Product, Category } from '@prisma/client';
// import { Button, Input } from '@/shared/components/ui';
// import CategorySelect from '@/shared/components/shared/category-select';
// import { UploadButton } from '@/shared/lib/uploadthing';
// import { UploadThingError } from '@/app/api/uploadthing/core';

// import { Json } from '@uploadthing/shared';
// import { cn } from '@/shared/lib/utils';

// interface ProductWithCategory extends Product {
//   category: Category;
//   className?: string;
// }


// export default function DashboardProducts( { className }: { className?: string } ) {
//   const [products, setProducts] = useState<ProductWithCategory[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>('');
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     imageUrl: '',
//     categoryId: '',
//   });
//   const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null);

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch('/api/products');
//       const data = await response.json();
//       setProducts(data);
//     } catch (error) {
//       toast.error('Не удалось загрузить продукты');
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch('/api/categories');
//       const data = await response.json();
//       setCategories(data);
//     } catch (error) {
//       console.error("Не удалось загрузить категории");
//     }
//   };

//   const handleCreateProduct = async () => {
//     try {
//       await createProduct({
//         name: newProduct.name,
//         imageUrl: newProduct.imageUrl,
//         category: { connect: { id: Number(newProduct.categoryId) } },
//       });
//       toast.success('Продукт создан');
//       setNewProduct({ name: '', imageUrl: '', categoryId: '' });
//       fetchProducts();
//     } catch (error) {
//       toast.error('Ошибка создания продукта');
//     }
//   };

//   const handleUpdateProduct = async () => {
//     if (editingProduct) {
//       try {
//         await updateProduct(editingProduct.id, {
//           name: editingProduct.name,
//           imageUrl: editingProduct.imageUrl,
//           category: {
//             connect: { id: Number(editingProduct.categoryId) },
//           },
//         });
//         toast.success('Продукт обновлен');
//         setEditingProduct(null);
//         fetchProducts();
//       } catch (error) {
//         toast.error('Ошибка обновления продукта');
//       }
//     }
//   };

//   const handleDeleteProduct = async (id: number) => {
//     try {
//       await deleteProduct(id);
//       toast.success('Продукт удален');
//       fetchProducts();
//     } catch (error) {
//       toast.error('Ошибка удаления продукта');
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingProduct(null);
//     setNewProduct({ name: '', imageUrl: '', categoryId: '' });
//   };

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, []);

//   const handleCategoryChange = (categoryId: number) => {
//     setSelectedCategoryId(categoryId);
//   };

//   const onUploadSuccess = (url: string) => {
//     // form.setValue("imageUrl", url); // если используешь form, раскомментируй
//     toast.success("Файл успешно загружен!", {
//       icon: "👏",
//     });
//   };
  
//   const onUploadError = (error: UploadThingError<Json>) => {
//     console.log(error);
//     toast.error("Не удалось загрузить файл", {
//       icon: "😩",
//     });
//   };
  

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Управление продуктами</h1>

//       {/* Форма создания/обновления продукта */}
//       <div className="mb-6">
//         <h2 className="text-xl font-bold mb-4">
//           {editingProduct ? 'Обновить продукт' : 'Создать новый продукт'}
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <Input
//             value={editingProduct ? editingProduct.name : newProduct.name}
//             onChange={(e) =>
//               editingProduct
//                 ? setEditingProduct({ ...editingProduct, name: e.target.value })
//                 : setNewProduct({ ...newProduct, name: e.target.value })
//             }
//             placeholder="Название продукта"
//           />
//           <Input
//             value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
//             onChange={(e) =>
//               editingProduct
//                 ? setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
//                 : setNewProduct({ ...newProduct, imageUrl: e.target.value })
//             }
//             placeholder="URL изображения"
//           />
//           <div>
//           <UploadButton
//             className={cn('border rounded-md block color-black border-gray-200 h-9 opacity-100 text-opacity-100 text-center mb-2', className)}
//             endpoint="imageUploader"
//             onClientUploadComplete={(res) => onUploadSuccess(res[0].url)}
//             onUploadError={onUploadError}
//             />

//             </div>
          
//           <CategorySelect
//             categories={categories}
//             selectedCategoryId={Number(selectedCategoryId)} // Преобразование в число
//             onChange={handleCategoryChange}
//           />
//           <div className="flex gap-2">
//             {editingProduct ? (
//               <>
//                 <Button className="h-9" onClick={handleUpdateProduct}>
//                   Обновить
//                 </Button>
//                 <Button className="h-9" onClick={handleCancelEdit}>
//                   Отменить
//                 </Button>
//               </>
//             ) : (
//               <Button className="h-9" onClick={handleCreateProduct}>
//                 Создать
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Таблица продуктов */}
//       <table className="min-w-full table-auto border-collapse border border-slate-500">
//         <thead>
//           <tr className="bg-gray-200 border border-gray-300">
//             <th className="px-2 py-2">ID</th>
//             <th>Название</th>
//             <th>Изображение</th>
//             <th>Категория</th>
//             <th>Дата создания</th>
//             <th>Последнее обновление</th>
//             <th>Действия</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((product) => (
//             <tr key={product.id}>
//               <td>{product.id}</td>
//               <td>{product.name}</td>
//               <td className="items-center flex justify-center border-none">
//                 <img
//                   src={product.imageUrl}
//                   alt={product.name}
//                   className="w-16 h-16 object-cover"
//                 />
//               </td>
//               <td>{product.category.name}</td>
//               <td>{new Date(product.createdAt).toLocaleDateString()}</td>
//               <td>{new Date(product.updatedAt).toLocaleDateString()}</td>
//               <td className="border-none text-center">
//                 <div className="flex gap-1 justify-center flex-col flex-wrap h-full">
//                   <Button className="h-[1.7rem]" onClick={() => setEditingProduct(product)}>
//                     Редактировать
//                   </Button>
//                   <Button className="h-[1.7rem]" onClick={() => handleDeleteProduct(product.id)}>
//                     Удалить 
//                   </Button>  
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

