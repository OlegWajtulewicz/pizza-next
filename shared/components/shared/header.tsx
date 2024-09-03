'use client';

import React from 'react';
import Image from 'next/image';

import { Container } from './container';
import { SearchInput } from './search-input';
import { cn } from '@/shared/lib/utils';
import { User } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

//import { AuthModal } from './modals/auth-modal';
//import { ProfileButton } from './profile-button';
import { CartButton } from './cart-button';
//import toast from 'react-hot-toast';

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({ className, hasSearch = true, hasCart = true }) => {
    return (
        <header className={cn('border-b ', className)}>
          <Container className="flex items-center justify-between py-8">
            <Link href="/">
              <div className="flex items-center gap-4">
                <Image src="/logo.png" width={35} height={35} alt="Logo" />
                <div>
                  <h1 className="text-2xl uppercase font-black">Pizza Next </h1>
                  <p className="text-sm text-gray-400 leading-3">вкусней уже некуда</p>
                </div>
              </div>
            </Link>
           
            {hasSearch && (
                <div className="mx-10 flex-1">
                     <SearchInput /> 
                </div>
            )}
    
            {/* prawo */}
    
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-1">
                <User size={16} />
                Войти
              </Button> 
            
             {hasCart && ( <CartButton />)}
            </div>
          </Container>
        </header>
      );
    };