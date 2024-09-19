import { Button } from '@/shared/components/ui';
import React from 'react';


// Типы для props компонента
interface ProductItem {
  id: number;
  price: string;
  size: string | null;
  pizzaType: string | null;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductTableProps {
  productItems: ProductItem[];
  handleEdit: (item: ProductItem) => void;
  handleDelete: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ productItems, handleEdit, handleDelete }) => {
  return (
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
              <div className="flex gap-1 justify-center">
                <Button className="h-[1.7rem]" onClick={() => handleEdit(item)}>
                  Редактировать
                </Button>
                <Button className="h-[1.7rem]" onClick={() => handleDelete(item.id)}>
                  Удалить
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
