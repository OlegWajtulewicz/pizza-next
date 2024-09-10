'use client';
import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import React from 'react';

interface Props {
  orderId: number;
  items: CartItemDTO[];
// totalAmount: number;
// totalPrice: number;
// vatPrice: number;
// deliveryPrice: number;
 
}

export const OrderSuccessTemplate: React.FC<Props> = ({
    orderId,
    items,
  // totalPrice,
  // vatPrice,
  // deliveryPrice,
  // totalAmount,
   
}) => (
  
  <div>
    <h1>Спасибо за покупку!</h1>

    <p>Ваш заказ #{orderId} оплачен. Список товаров:</p>
      
    <hr />
  
    <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.productItem.product.name} | {item.productItem.price} ₽ x {item.quantity} шт. ={' '} 
            {item.productItem.price * item.quantity} ₽
          </li>
        ))}

        {/* ${items.map((item) => {
            return `<li>${item.productItem.product.name} | (${item.productItem.price}₽ x ${item.quantity} шт.)</li>`;
          })
          .join('')} */}
    </ul>
    <hr />
    {/* <p>Итоговая стоимость корзины: {(totalPrice && vatPrice && deliveryPrice) ? (totalPrice - vatPrice - deliveryPrice).toFixed(2) : 0 } ₽</p>
     <p>Налоги (НДС): {vatPrice || 0} ₽</p>
    <p>Стоимость доставки: {deliveryPrice || 0} ₽</p>
    <p><strong>Общая сумма к оплате: {totalPrice || 0} ₽</strong></p> 

    <p>Спасибо за покупку и надеемся увидеть вас снова!</p> */}
  </div>  
);
