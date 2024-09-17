import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Title } from './title';
import Link from 'next/link';
import { Ingredient } from '@prisma/client';

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  ingredients: Ingredient[];
  className?: string;
}

export const ProductCard: React.FC<Props> = ({ id, name, price, imageUrl, ingredients, className }) => {
  return (
    <div className={cn(className)}>
      <Link href={`/product/${id}`}>
      <div className='h-full flex flex-col justify-between gap-4'>
        <div>
            <div className="flex justify-center items-center p-6 bg-secondary rounded-lg h-[260px]">
              <img className="object-contain w-[100%] h-[100%] skale" src={imageUrl} alt="Logo" />
            </div>

            <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />

            <p className="text-sm text-gray-400">
              {
                ingredients
                  .map((ingredient) => ingredient.name)
                  .join(', ')
              }
            </p>

          </div>

          <div>
            <div className="flex justify-between items-center ">
              <span className="text-[20px]">
                от <b>{price} ₽</b>
              </span>

              <Button  className="text-base font-bold">
                <Plus size={20} className="mr-1" />
                Добавить
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
