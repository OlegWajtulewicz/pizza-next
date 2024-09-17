'use client';


import React from 'react';

interface Category {
  id: number;
  name: string;
}

interface CategorySelectProps {
  categories: Category[];
  selectedCategoryId: number;
  onChange: (categoryId: number) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories, selectedCategoryId, onChange }) => {
  return (
    <div >
      <select
        id="category"
        value={selectedCategoryId}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-sm block w-full border rounded-md text-gray-500 p-2 border-gray-200 h-12"
      >
        <option value="">Выберите категорию</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
