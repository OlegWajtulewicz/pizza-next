'use client'

import { cn } from "@/lib/utils"
import React, { use } from "react"

type Variant = {
    name: string;
    value: string;
    disabled?: boolean;
}
interface Props {
    items: readonly Variant[];
    onClick?: (value: Variant['value']) => void;
    className?: string;
    selectValue?: Variant['value'];
}

export const GroupVariants: React.FC<Props> = ({ className, items, onClick, selectValue }) => {
    return (
        <div className={cn(className, 'flex justify-between bg-[#f5f5f5] rounded-3xl p-1 select-none')}>
        {
            items.map((item) => (
                <button
                    key={item.name}
                    onClick={() => onClick?.(item.value)}
                    className={cn(
                        'flex items-center justify-center cursor-pointer h-[30px] rounded-md px-4 py-1 font-bold transition duration-400 ease-in-out delay-100',  
                        {
                            'bg-[#c4b5fd] shadow': item.value === selectValue,
                            'text-gray-500 opacity-50 pointer-events-none': item.disabled,
                        }
                        
                    )}
                >
                    {item.name}
                </button>
            ))
        }
        </div>
    )
} 