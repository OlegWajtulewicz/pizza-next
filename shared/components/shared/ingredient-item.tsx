import { cn } from '@/shared/lib/utils';
import { CircleCheck } from 'lucide-react';
import React from  'react';

interface Props {
    imageUrl: string;
    name: string;
    price: number;
    active?: boolean;
    onClick?: () => void;
    className?: string;
}

export const IngredientItem: React.FC<Props> = ({ 
    imageUrl,
    name,
    price,
    active,
    onClick,
    className,
 }) => {
    return (
        <div className={cn(
            "flex flex-col p-2 items-center justify-center rounded-md w-32 h-[100%] text-center relative cursor-pointer shadow-md bg-white border border-transparent hover:shadow-xl transition-all duration-300 ease-in-out", 
            { 'border border-primary shadow-xl': active  },
            className,
        )}
        onClick={onClick}> 
        {active && <CircleCheck className="absolute top-2 right-2 text-primary" /> }
        <img src={imageUrl} alt="Logo" width={110} height={110} />
        <span className="text-xs mb-1">{name}</span>
        <span className="font-bold">{price} ₽ </span>
        </div>
        
    )
}