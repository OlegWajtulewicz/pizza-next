"use client"; 

import { useState, useEffect } from "react";
import { TopBar } from "@/shared/components/shared";
import { cn } from "@/shared/lib/utils";
import { Category } from "@prisma/client";

interface ProductPageTopBarProps {
  categories: Category[]; 
}
export default function ProductPageTopBar({ categories }: ProductPageTopBarProps) {
  const [cartVisible, setCartVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setCartVisible(true);
      } else {
        setCartVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
      <TopBar 
        categories={categories}  
        className={cn(
          'transition-all',
          !cartVisible ? 'w-full p-0 opacity-0 absolute h-0 left-0 py-2 top-[-100%]' : 'opacity-100 py-2 w-full ml-0 top-0'
        )}     
        />
  );
}