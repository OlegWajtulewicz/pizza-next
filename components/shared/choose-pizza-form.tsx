'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '../ui/button';
import { Title } from './title';
//import { IProduct } from '@/hooks/use-choose-pizza';
import toast from 'react-hot-toast';
import { ProductImage } from './product-image';
//import { useCart } from '@/hooks/use-cart';

interface Props {
  imageUrl: string;
  name: string;
  className?: string;
  ingredients: any[];
  items?: any[];
  onClickAdd?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<Props> = ({
  name,
  items,
  imageUrl,
  onClickAdd,
  className,
  ingredients,
}) => {
  const textDetaills = '30 см, средняя каллорийность, сырная';
  const totalPrice = 3500;

  return (
    <div className={cn(className, 'flex flex-1')}>
        <ProductImage imageUrl={imageUrl} size={30} />

        <div className="w-[490px] bg-[#eeecec5e] p-7 flex flex-col justify-between">
            <div className="flex flex-col justify-between">
            
                <Title text={name} size="md" className="font-extrabold mb-1" />

                <p className="text-gray-400">{textDetaills}</p>
            </div>
            
            <Button
                
                
                className="h-[55px] px-10 text-base w-full">
                Добавить в корзину за {totalPrice} ₽
            </Button>
        </div>
    </div>
      
  );
};
