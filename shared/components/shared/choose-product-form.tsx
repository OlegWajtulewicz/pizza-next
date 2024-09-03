'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Button } from '../ui/button';
import { Title } from './title';
import { Ingredient } from '@prisma/client';

interface Props {
  imageUrl: string;
  name: string;
  price: number;
  className?: string;
  loading?: boolean;
  onSubmit?: VoidFunction;
//  ingredients?: Ingredient[]
}
//* форма выбора продукта
export const ChooseProductForm: React.FC<Props> = ({
  name,
  price,
  imageUrl,
  className,
  loading,
  onSubmit,
 // ingredients
}) => {
  const textDetaills = '30 см, средняя каллорийность, сырная';
  const ingredientsProduct = '30 см, средняя каллорийность, сырная';

  return (
    <div className={cn(className, 'flex flex-1 modal-adaptive')}>
        <div className={cn('flex items-center justify-center flex-1 relative w-full', className)}>
        <img
        src={imageUrl}
        alt={name}
        className={cn('relative left-2 top-2 transition-all z-10 duration-300 w-[350px] h-[350px]' )}
            />
           
        </div>

        <div className="w-[50%] bg-[#eeecec5e] p-7 flex flex-col justify-between">
            <div className="flex flex-col justify-between">
            
                <Title text={name} size="md" className="font-extrabold mb-1" />
                <p className="text-gray-400">{textDetaills}</p>
                <p className="text-gray-400">{ingredientsProduct}
                {/* {
                    ingredients
                      .map((ingredient) => ingredient.name)
                      .join(', ')
                  } */}
                  </p>  
            </div>
            
            <Button
                loading={loading}
                onClick={() => onSubmit?.()}
                className="h-[55px] px-10 text-base w-full">
                Добавить в корзину за {price} ₽
            </Button>
        </div>
    </div>
      
  );
};
