import { PizzaType, PizzaSize } from "@/shared/constants/pizza";
import { getCartItemDetails } from "@/shared/lib";
import React from "react";
import { CheckoutItem } from "../checkout-item";
import { WhiteBlock } from "../white-block";
import { CartStateItem } from "@/shared/lib/get-cart-details";
import { CheckoutItemSkeleton } from "../checkout-item-skeleton";
import { Trash2 } from "lucide-react";

interface Props {
    items: CartStateItem[];
    onClickCountButton: (id: number, quantity: number, type: 'plus' | 'minus') => void;
    removeCartItem: (id: number) => void;
    className?: string;
    loading?: boolean;
    
}
export const CheckoutCart: React.FC<Props> = ({ items, onClickCountButton, removeCartItem, className, loading }) => {

    return (
        <WhiteBlock 
            title="1. Корзина" 
            className={className}
            // endAdornment={
            //     totalAmount > 0 && (
            //       <button type="button" className="flex items-center gap-3 text-gray-400 hover:text-gray-600">
            //         <Trash2 size={16} />
            //         Очистить корзину
            //       </button>
            //     )
            //   }
            > 
            <div className="flex flex-col gap-5">
            {loading 
            ? [...Array(4)].map((_, index) => <CheckoutItemSkeleton key={index} />)
            : items.map((item) => (
                    <CheckoutItem
                        id={item.id}
                        key={item.id}
                        name={item.name}
                        price={item.price}
                        imageUrl={item.imageUrl}
                        quantity={item.quantity} 
                        details={getCartItemDetails(
                            item.ingredients,
                            item.pizzaType as PizzaType,
                            item.pizzaSize as PizzaSize
                        )}
                        disabled={item.disabled}
                        onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}   
                        onClickRemove={() => removeCartItem(item.id)} 
                    />
                ))}
            
            </div>
            {/* {!totalAmount && <p className="text-center text-gray-400 p-10">Корзина пустая</p>} */}
        </WhiteBlock>
    )
}