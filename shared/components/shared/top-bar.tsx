'use client';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Container } from './container';
import { Categories } from './categories';
import { SortPopup } from './sort-popup';
import { Category } from '@prisma/client';
import { CartButton } from './cart-button';
import  Link  from 'next/link';

interface Props {
  categories: Category[];
  className?: string;

}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
  const [cartVisible, setCartVisible] = React.useState(false);

  React.useEffect(() => {
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
    <div className={cn('transition-all',
                  !cartVisible ? 'sticky top-0 bdop py-5 shadow-lg shadow-black/5 z-50' : 'py-2 sticky top-0 bdop shadow-lg shadow-black/5 z-50',
                  className)
        }>
      <Container className="flex items-center justify-between ">
      <Link href="/" className={cn(
              'transition-all',
              !cartVisible ? 'invisible w-0 p-0 opacity-0 ' : 'visible ml-5 opacity-100 mr-5',
            )}>
        <Image src="/logo.png" width={35} height={35} alt="Logo" />
      </Link>
          
        <Categories items={categories} className='flex-1' />
        <div className="flex items-center">
          {/* <SortPopup  /> */}
          <CartButton
            className={cn(
              'transition-all',
              !cartVisible ? 'invisible w-0 p-0 opacity-0' : 'visible ml-5 opacity-100',
            )}
          />
        </div>
      </Container>
    </div>
  );
};
