import { PizzaType, PizzaSize } from "@/shared/constants/pizza";
import { getCartItemDetails } from "@/shared/lib";
import React from "react";
import { CheckoutItem } from "../checkout-item";
import { WhiteBlock } from "../white-block";
import { CartStateItem } from "@/shared/lib/get-cart-details";
import { CheckoutItemSkeleton } from "../checkout-item-skeleton";

interface Props {
    items: CartStateItem[];
    onClickCountButton: (id: number, quantity: number, type: 'plus' | 'minus') => void;
    removeCartItem: (id: number) => void;
    className?: string;
    loading?: boolean;
}
export const CheckoutCart: React.FC<Props> = ({ items, onClickCountButton, removeCartItem, className, loading }) => {

    return (
        <WhiteBlock title="1. Корзина" className={className}> 
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
        </WhiteBlock>
    )
}