'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input } from '@/shared/components';
import toast from 'react-hot-toast';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions'; 
import { Category } from '@prisma/client';

interface CategoryWithProducts extends Category {
  products: { id: number; name: string }[]; 
}

export default function DashboardCategories() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories'); 
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error('Не удалось загрузить категории');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      toast.error('Заполните все обязательные поля!');
      return; 
    }
    try {
      await createCategory(newCategory); 
      toast.success('Категория создана');
      setNewCategory({ name: '' }); 
      fetchCategories(); 
    } catch (error) {
      toast.error('Ошибка создания категории');
    }
  };

  const handleUpdateCategory = async (id: number) => {
    try {
      await updateCategory(id, { name: newCategory.name }); 
      toast.success('Категория обновлена');
      setNewCategory({ name: '' });
      setEditingCategoryId(null); // Сбрасываем состояние редактирования
      fetchCategories(); 
    } catch (error) {
      toast.error('Ошибка обновления категории');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
        await deleteCategory(id);
        toast.success('Категория удалена');
        fetchCategories(); 
      }
    } catch (error) {
      toast.error('Ошибка удаления категории');
    }
  };

  const handleSaveCategory = async () => {
    if (editingCategoryId) {
      await handleUpdateCategory(editingCategoryId); 
    } else {
      await handleCreateCategory();
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null); // Сбрасываем состояние редактирования
    setNewCategory({ name: '' }); // Очищаем данные
  };

  useEffect(() => {
    fetchCategories(); 
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление категориями</h1>

      {/* Форма создания/обновления категории */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">
          {editingCategoryId ? 'Обновить категорию' : 'Создать новую категорию'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input 
            className="h-12"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ name: e.target.value })}
            placeholder="Название категории"
          />
          <div className="flex gap-2">
            <Button className='h-12 w-full' loading={loading} onClick={handleSaveCategory}>
              {editingCategoryId ? 'Сохранить' : 'Создать'}
            </Button>
            {editingCategoryId && (
            <Button className='h-12 w-full' loading={loading} onClick={handleCancelEdit}>
              Отменить
            </Button>
            )}
          </div>
        </div>
      </div>

      {/* Таблица категорий */}
      {loading ? (
        <p>Загрузка...</p>
      ) : categories.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-slate-500">
          <thead>
            <tr className="bg-gray-200 border border-gray-300">
              <th className="px-2 py-2">ID</th>
              <th>Название</th>
              <th>Продукты</th>
              <th>Дата создания</th>
              <th>Последнее обновление</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className='text-center'>{category.id}</td>
                <td className='text-center'>{category.name}</td>
                <td>
                  {category.products.length > 0
                    ? category.products.map((product) => (
                        <div key={product.id}>{product.name}</div>
                      ))
                    : 'Нет продуктов'}
                </td>
                <td className='text-center'>{new Date(category.createdAt).toLocaleDateString()}</td>
                <td className='text-center'>{new Date(category.updatedAt).toLocaleDateString()}</td>
                <td className="border-none text-center">
                  <div className="flex gap-1 justify-center flex-col flex-wrap h-full ">
                    <Button
                      className="h-[1.7rem]"
                      onClick={() => {
                        setEditingCategoryId(category.id);
                        setNewCategory({ name: category.name });
                      }}
                    >
                      Редактировать
                    </Button>
                    <Button className="h-[1.7rem]" onClick={() => handleDeleteCategory(category.id)}>
                      Удалить
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Категории отсутствуют</p>
      )}
    </div>
  );
}
