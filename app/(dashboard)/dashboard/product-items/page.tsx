// // app/dashboard/product-items/page.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import { useQuery, useMutation, useQueryClient } from 'react-query';

// import { fetchProducts, fetchProductItems, deleteProductItem } from '@/app/actions'; // Импортируйте свои функции из actions.ts
// import { CreateProductItemForm } from '@/shared/components/shared/dashboard/forms/create-product-item-form/create-product-item-form';

// const ProductItemsPage: React.FC = () => {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const [selectedItem, setSelectedItem] = useState<number | null>(null);

//   const { data: products, isLoading: isProductsLoading } = useQuery('products', fetchProducts);
//   const { data: productItems, refetch, isLoading: isProductItemsLoading } = useQuery('productItems', fetchProductItems);

//   const mutation = useMutation({
//     mutationFn: deleteProductItem,
//     onSuccess: () => {
//       toast.success('Элемент удален успешно');
//       refetch();
//     },
//     onError: () => {
//       toast.error('Произошла ошибка при удалении');
//     },
//   });

//   const handleDelete = (id: number) => {
//     mutation.mutate(id);
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Управление элементами продукта</h1>

//       <CreateProductItemForm
//         values={selectedItem ? productItems?.find((item) => item.id === selectedItem) : undefined}
//         products={products || []}
//       />

//       <div className="mt-8">
//         <h2 className="text-xl font-semibold">Список элементов</h2>
//         {isProductItemsLoading ? (
//           <p>Загрузка...</p>
//         ) : (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead>
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Размер</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип пиццы</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Продукт</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {productItems?.map((item) => (
//                 <tr key={item.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.size}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.pizzaType}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {products?.find((product) => product.id === item.productId)?.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => setSelectedItem(item.id)}
//                       className="text-indigo-600 hover:text-indigo-900"
//                     >
//                       Изменить
//                     </button>
//                     <button
//                       onClick={() => handleDelete(item.id)}
//                       className="ml-4 text-red-600 hover:text-red-900"
//                     >
//                       Удалить
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductItemsPage;
