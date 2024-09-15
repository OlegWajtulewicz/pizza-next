'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { Container } from './container';
import { SearchInput } from './search-input';
import Link from 'next/link';
import { CartButton } from './cart-button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProfileButton } from './profile-button';
import { AuthModal } from './modals/auth-modal/auth-modal';
import { DashboardFormHeader } from './dashboard/dashboard-form-header';
import { DeleteButton } from './dashboard/delete-button';


interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({ className, hasSearch = true, hasCart = true }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [openAuthModal, setOpenAuthModal] = React.useState(false);
  const searchParams = useSearchParams();
  const isAdminPage = pathname.startsWith('/dashboard');

  
  React.useEffect(() => {
    let toastMessage: string = '';

    if (searchParams.has('paid')) {
      toastMessage = 'Заказ успешно оплачен! Информация отправлена на почту.';
    }

    if (searchParams.has('verified')) {
      toastMessage = 'Почта успешно подтверждена!';
    }

    if (toastMessage) {
      setTimeout(() => {
        router.replace('/');
        toast.success(toastMessage, {
          duration: 3000,
        });
      }, 1000);
    }
  },  []); 


  return (
        <header className={cn('border-b ', className)}>
          <Container className="flex items-center justify-between py-8">
            {!isAdminPage ? (<Link href="/">
              <div className="flex items-center gap-4">
                <Image src="/logo.png" width={35} height={35} alt="Logo" />
                <div>
                  <h1 className="text-2xl uppercase font-black">Pizza Next </h1>
                  <p className="text-sm text-gray-400 leading-3">вкусней уже некуда</p>
                </div>
              </div>
            </Link>) : (<Link href="/dashboard">
              <div className="flex items-center gap-4">
                <Image src="/logo.png" width={35} height={35} alt="Logo" />
                <div>
                  <h1 className="text-2xl uppercase font-black">DASHBOARD </h1>
                  <p className="text-sm text-gray-400 leading-3 text-center">управляй мечтой</p>
                </div>
              </div>
            </Link>) }
            
            {hasSearch && !isAdminPage && (
                <div className="mx-10 flex-1">
                     <SearchInput /> 
                </div>
            )}
            {/* dashboard-button */}
            {/* {isAdminPage && 
            <div className="flex  gap-3">
              <DashboardFormHeader />
              <DeleteButton id={0} type={'user'} />
            </div>} */}
            {/* prawo */}
            <div className="flex items-center gap-3">
            <AuthModal open={openAuthModal}  onClose={() => setOpenAuthModal(false)} />
              <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} /> 
                
             {hasCart && !isAdminPage &&  <CartButton />}
            </div>
          </Container>
        </header>
      );
    };