'use client'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ProductWithRelations } from '@/@types/prisma';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { ProductForm } from '../product-form';


interface Props {
    className?: string;
    product: ProductWithRelations;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
    const router = useRouter();

    return (
        <Dialog open={Boolean(product)} onOpenChange={() => router.back()} >
            
            <DialogContent 
                aria-describedby="dialog-description"
                className={cn(
                    "p-0 w-[1060px] max-w-[1060px] min-h-[520px] bg-white overflow-hidden", 
                    className,
                    )}>
                    <ProductForm 
                        product={product} 
                        onSubmit={() => router.back()}
                        imageUrl={''}
                        name={''}
                        price={0}  
                        />
                <VisuallyHidden.Root id="dialog-description">
                    <DialogTitle >{product.name}</DialogTitle>
                    <DialogDescription>{product.name}</DialogDescription> 
                </VisuallyHidden.Root>   
                
            </DialogContent>
        </Dialog>
    );
}