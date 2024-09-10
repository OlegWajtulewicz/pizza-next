'use client';

import Image from 'next/image';
import  React  from 'react';

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/shared/components/ui/sheet';
import Link from 'next/link';
import { Button } from '../ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CartDrawerItem } from './cart-drawer-item';
import { getCartItemDetails } from '@/shared/lib';
import { PizzaSize, PizzaType } from '@/shared/constants/pizza';
import { Title } from './title';
import { useCart } from '@/shared/hooks';

export const CartDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { totalAmount, items, updateItemQuantity, removeCartItem, loading } = useCart();
  const [ redirecting, setRedirecting ] = React.useState(false);
 

  const onClickCountButton = ( id: number, quantity: number, type: 'plus' | 'minus') => {
    const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  }

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
              <SheetContent className="flex flex-col justify-between pb-0 bg-[#f0eef4]">
              {totalAmount > 0 && (
                <SheetHeader>
                  <SheetTitle>
                    В корзине <span className="font-bold">{items.length} товара</span>
                  </SheetTitle>
                </SheetHeader> 
              )}

              {!totalAmount && (
                <div className="flex flex-col items-center justify-center w-full mx-auto h-full">
                  <Image src="/assets/images/empty-box.png" alt="Empty cart" width={120} height={120} />
                  <Title size="sm" text="Корзина пустая" className="text-center font-bold my-2" />
                  <p className="text-center text-neutral-500 mb-5">
                    Добавьте хотя бы одну пиццу, чтобы совершить заказ
                  </p>

                  <SheetClose>
                    <Button className="w-56 h-12 text-base" size="lg">
                      <ArrowLeft className="w-5 mr-2" />
                      Вернуться назад
                    </Button>
                  </SheetClose>
                </div>
              )}


              {totalAmount > 0 && (
                <>
                {/** items */}
                <div className="-mx-6 mt-5 overflow-auto scrollbar flex-1">
                    <div className="mb-2">
                    {
                      items.map(item => 
                        <CartDrawerItem 
                            key={item.id}
                            id={item.id}
                            imageUrl={item.imageUrl}
                            name={item.name}
                            details={getCartItemDetails(
                                item.ingredients,
                                item.pizzaType as PizzaType,
                                item.pizzaSize as PizzaSize
                              )}
                            disabled={item.disabled}  
                            price={item.price}
                            quantity={item.quantity} 
                            onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}   
                            onClickRemove={() => removeCartItem(item.id)}                   
                          />
                        )
                      }
                      </div>
                  </div>
                
                  <SheetFooter className="-mx-6 bg-white p-8">
                  <div className="w-full">
                      <div className="flex mb-4">
                          <span className="flex flex-1 text-lg text-neutral-500">
                            Итого
                            <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                          </span>

                          <span className="font-bold text-lg">{totalAmount} ₽</span>
                      </div>
                        <Link href="/checkout">
                          <Button
                          onClick={() => setRedirecting(true)}
                            loading={loading || redirecting}
                            type="submit"
                            className="w-full h-12 text-base">
                            Оформить заказ
                            <ArrowRight className="w-5 ml-2" />
                          </Button>
                        </Link>
                  </div>
                  </SheetFooter>
                </>
              )}
              </SheetContent>
        </Sheet>
    )
}


