import { Product, ProductItem } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductItemFormSchema, CreateProductItemFormValues } from "./constants";
import { FormInput } from "../../../form-components";
import {  createProductItem, deleteProductItem, updateProductItem } from "@/app/actions";
import toast from "react-hot-toast";
import { FormSelect } from "../../../form-components/form-select";
import { Button } from "@/shared/components/ui";

interface PageProps {
  values?: ProductItem;
  products: Product[];
  defaultValues: CreateProductItemFormValues;
  onSave: (data: CreateProductItemFormValues) => void;
}

interface Props extends PageProps {
  handleDelete?: (id: number) => void;
}

const ProductItemForm: React.FC<Props> = ({ 
  values,
}) => {
  const params = useParams<{ id: string }>();
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false); 
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const form = useForm<CreateProductItemFormValues>({
    defaultValues: values
      ? {
          price: values.price.toString(),
          size: values.size?.toString() || '',
          pizzaType: values.pizzaType?.toString() || '',
          productId: values.productId.toString(),
        }
      : { price: '', size: '', pizzaType: '', productId: '' },
    resolver: zodResolver(CreateProductItemFormSchema),
  });

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


  useEffect(() => {
    if (values && params.id) {
      form.reset({
        price: values.price.toString(),
        size: values.size?.toString() || '',
        pizzaType: values.pizzaType?.toString() || '',
        productId: values.productId.toString(),
      });
      setIsEdit(true);
    }
  }, [values, params.id, form]);

  // Сабмит формы
  const onSubmit: SubmitHandler<CreateProductItemFormValues> = async (data) => {
    setLoading(true);
    try {
      if (isEdit && values?.id) {
        await updateProductItem( values.id, {
          price: Number(data.price),
          size: data.size ? Number(data.size) : null,
          pizzaType: data.pizzaType ? Number(data.pizzaType) : null,
         // productId: Number(data.productId),
          product: { connect: { id: Number(data.productId) } }
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
      form.reset();
      router.push("/dashboard/product-items");
    } catch (error) {
      toast.error("Произошла ошибка!");
    } finally {
      setLoading(false);
      setIsEdit(false);
     // form.reset();
    }
  };


  const fetchProductItemById = async (id: number) => {
    console.log(`Получение элемента продукта с идентификатором: ${id}`);
    const response = await fetch(`/api/product-item/${id}`);
    if (!response.ok) {
      console.error('Не удалось получить элемент продукта');
      throw new Error('Не удалось получить элемент продукта');
    }
    return response.json();
   // const data = await response.json();
   // console.log('Извлеченный элемент продукта:', data);
    //return data;
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
      params.id = String(item.id); // Убедитесь, что `params.id` обновляется правильно
      
    } catch (error) {
      toast.error('Ошибка при загрузке данных товара.');
    }
  };




  const handleCancelEdit = () => {
    form.reset();
    setIsEdit(false);
    router.push("/dashboard/product-items");
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
  );
};

export default ProductItemForm;






















// import { Product, ProductItem } from "@prisma/client";
// import { useParams, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import { CreateProductItemFormSchema, CreateProductItemFormValues } from "./constants";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { FormInput } from "../../../form-components";
// import { FormSelect } from "../../../form-components/form-select";
// import { Button } from "@/shared/components/ui";
// import { createProductItem, updateProductItem } from "@/app/actions";
// import toast from "react-hot-toast";

// interface PageProps {
//     values?: ProductItem;
//     products: Product[];
//     defaultValues: CreateProductItemFormValues;
//     onSave: (data: CreateProductItemFormValues) => void;
// }
  
// interface Props extends PageProps {
//   //  handleEdit?: (item: ProductItem) => void;
//     handleDelete?: (id: number) => void;
//   //  isEdit: boolean;
//     form: ReturnType<typeof useForm>;
    
//   //  handleCancelEdit: () => void; 
// }
  
// interface CreateProductItemFormValues {
//     price: string;
//     size?: string;
//     pizzaType?: string;
//     productId: string;
//   }
  
// const ProductItemForm: React.FC<Props> = ({ 
//     values,
//     products,
//     defaultValues,
//     onSave,
//   //  handleEdit,
//     handleDelete,
//    // isEdit,
//     form,
 
//   //  handleCancelEdit
//  }) => {
//     const params = useParams<{ id: string }>();
//     const router = useRouter();
//     const [loading, setLoading] = React.useState(false);
//     const [isEdit, setIsEdit] = useState(false); 
//     const [productItems, setProductItems] = useState<ProductItem[]>([]);
//     const [productsState, setProducts] = useState<Product[]>([]);

//     useEffect(() => {
//         const fetchProductItems = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch('/api/product-item');
//             if (!response.ok) {
//             throw new Error(`Ошибка при получении данных: ${response.statusText}`);
//             }
//             const data: ProductItem[] = await response.json();
//             setProductItems(data);
//         } catch (error) {
//             console.error('Ошибка при запросе:', error);
//         } finally {
//             setLoading(false);
//         }
//         };

//         fetchProductItems();
//     }, []);

//     useEffect(() => {
//         const fetchProducts = async () => {
//         try {
//             const response = await fetch('/api/products');
//             if (!response.ok) {
//             throw new Error(`Ошибка при получении данных: ${response.statusText}`);
//             }
//             const data: Product[] = await response.json();
//             setProducts(data);
//         } catch (error) {
//             console.error('Ошибка загрузки продуктов:', error);
//         }
//         };

//         fetchProducts();
//     }, []);

//     // const form = useForm<CreateProductItemFormValues>({
//     //     defaultValues,
//     //     resolver: zodResolver(CreateProductItemFormSchema),
//     //   });


//     // const form = useForm<CreateProductItemFormValues>({
//     //     defaultValues: {
//     //     price: values?.price ? String(values.price) : '',
//     //     size: values?.size ? String(values.size) : '',
//     //     pizzaType: values?.pizzaType ? String(values.pizzaType) : '',
//     //     productId: values?.productId ? String(values.productId) : '',
//     //     },
//     //     resolver: zodResolver(CreateProductItemFormSchema),
//     // });

//     // useEffect(() => {
//     //     if (values) {
//     //         form.reset({
//     //             price: values.price.toString(),
//     //             size: values.size ? values.size.toString() : '',
//     //             pizzaType: values.pizzaType ? values.pizzaType.toString() : '',
//     //             productId: values.productId.toString(),
//     //         });
//     //     }
//     // }, [values, form]);

    

//     const onSubmit: SubmitHandler<CreateProductItemFormValues> = async (data) => {
//         try {
//             if (values?.id) {
//             await updateProductItem(values.id, {
//                 price: Number(data.price),
//                 size: data.size ? Number(data.size) : null,
//                 pizzaType: data.pizzaType ? Number(data.pizzaType) : null,
//                 product: { connect: { id: Number(data.productId) } }
//             });
//             form.reset();
//             toast.success('Товар успешно обновлён!');
//             } else {
//             await createProductItem({
//                 price: Number(data.price),
//                 size: data.size ? Number(data.size) : null,
//                 pizzaType: data.pizzaType ? Number(data.pizzaType) : null,
//                 productId: Number(data.productId),
//             });
//             toast.success('Товар успешно создан!');
//             }
//             form.reset();
//             router.push('/dashboard/product-items');
//         } catch (error) {
//             toast.error('Произошла ошибка!');
//         }
//         };
        


//     const handleCancelEdit = () => {
//         form.reset();
//         setIsEdit(false);
//         router.push('/dashboard/product-items');
//         };


//     return (
//     <div className="mb-12">
//     <h2 className="text-xl font-bold mb-4">
//         {params.id ? 'Редактировать товар' : 'Создать новый товар'}
//     </h2>
//     <FormProvider {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <FormInput
//             name="price"
//             value={form.watch('price')}
//             label="Цена"
//             required
//             type="number"
//             step="0.01"
//             placeholder="Цена" 
//             />
//             <FormSelect
//             value={form.watch('size')}
//             name="size"
//             label="Размер продукта"
//             placeholder="Размер..."
//             items={[ 
//                 { value: '20', label: '20', },
//                 { value: '30', label: '30',  },
//                 { value: '40', label: '40', },
//                 ]}
//             />
//             <FormSelect
//             name="pizzaType"
//             value={form.watch('pizzaType')}
//             label="Тип продукта"
//             placeholder="Тип..." 
//             items={[
//                 { value: '1', label: 'Традиционное', },
//                 { value: '2', label: 'Тонкое', },
//                 ]}
//             />
//             <FormSelect
//             name="productId"
//             value={form.watch('productId')}
//             label="Продукт"
//             placeholder="Выберите продукт..."
//             items={productsState.map((product) => ({
//                 value: product.id.toString(),
//                 label: product.name,
//             }))} />
//             <div className="flex flex-col gap-2">
//             <Button type="submit" loading={loading} className="h-12">
//                 {params.id ? 'Сохранить изменения' : 'Создать'}
//             </Button>
//             {params.id && (
//                 <Button onClick={handleCancelEdit} type="button" className="h-12">
//                 Отменить
//                 </Button>
//             )}
//             </div>
//         </div>
//         </form>
//     </FormProvider>
//     </div>
// );
// };

// export default ProductItemForm;
