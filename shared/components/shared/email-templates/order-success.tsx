import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import React from 'react';

interface Props {
  orderId: number;
  items: CartItemDTO[];
 // totalAmount: number;
 // paymentUrl: string;
}

export const OrderSuccessTemplate: React.FC<Props> = ({
    orderId,
    items,
  //  totalAmount,
   // paymentUrl,
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
  </div>
);