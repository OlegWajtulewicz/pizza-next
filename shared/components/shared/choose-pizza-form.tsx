'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Button } from '../ui/button';
import { Title } from './title';
import { PizzaImage } from './pizza-image';
import { GroupVariants } from './group-variants';
import { PizzaSize, PizzaType, PizzaTypes } from '@/shared/constants/pizza';
import { Ingredient, ProductItem } from '@prisma/client';
import { IngredientItem } from './ingredient-item';
import { usePizzaOptions } from '@/shared/hooks';
import { getPizzaDetails } from '@/shared/lib/get-pizza-details';



interface Props {
  imageUrl: string;
  name: string;
  className?: string;
  ingredients: Ingredient[];
  items: ProductItem[];
  loading?: boolean;
  onSubmit: (itemId: number, ingredient: number[]) => void;
}

//* форма выбора пиццы

export const ChoosePizzaForm: React.FC<Props> = ({
  name,
  ingredients,
  items,
  imageUrl,
  className,
  loading,
  onSubmit,
}) => {
  const {
    size,
    type,
    selectedIngredients,
    availableSizes,
    currentItemId,
    setSize,
    setType,
    addIngredient,
  } = usePizzaOptions(items);
  
  
  
  const {totalPrice, textDetaills} = getPizzaDetails(
    type, 
    size, 
    items, 
    ingredients,
    selectedIngredients, 
    
  );

  const handleClickAdd = () => {
    if (currentItemId) {
      onSubmit(currentItemId, Array.from(selectedIngredients));
    }
  };

  return (
    <div className={cn(className, 'flex flex-1 modal-adaptive')}>
        <PizzaImage imageUrl={imageUrl} size={size} />
        

        <div className="w-[50%] bg-[#eeecec5e] p-7 flex flex-col justify-between">
            <div className="flex flex-col justify-between gap-1">
            
                <Title text={name} size="md" className="font-extrabold mb-1" />

                <p className="text-gray-400">{textDetaills}</p>

                <p className="text-sm text-gray-400">
                    {
                      ingredients
                        .map((ingredient) => ingredient.name)
                        .join(', ')
                    }
                </p>

                <div className="flex flex-col gap-2 mt-3">
                <GroupVariants 
                  items={availableSizes} 
                  value={String(size)} 
                  onClick={value => setSize(Number(value) as PizzaSize)} 
                  />
                <GroupVariants 
                  items={PizzaTypes} 
                  value={String(type)} 
                  onClick={value => setType(Number(value) as PizzaType)} 
                  /> 
                </div>

                <div className='bg-gray-50 p-5 rounded-sm h-[370px] overflow-auto scrollbar mt-3 mb-5'>
                <div className='grid grid-cols-3 items-center gap-3'>
                  {ingredients.map(ingredient => 
                  <IngredientItem 
                    key={ingredient.id}  
                    imageUrl={ingredient.imageUrl} 
                    name={ingredient.name} 
                    price={ingredient.price}
                    onClick={() => addIngredient(ingredient.id)}
                    active={selectedIngredients.has(ingredient.id)}
                    
                     />
                  )}
                </div>
                </div>
            </div>
            <Button
                loading={loading}
                onClick={handleClickAdd}
                className="h-[55px] px-10 text-base w-full">
                Добавить в корзину за {totalPrice} ₽
            </Button>
        </div>
    </div>
      
  );
};
