import React from 'react';

interface Props {
  orderId: number;
  totalAmount: number;
  paymentUrl: string;
 // totalPrice: number;
//  vatPrice: number;
 // deliveryPrice: number;
}

export const PayOrderTemplate: React.FC<Props> = ({
    orderId,
    totalAmount,
    paymentUrl,
   
}) => (
  <div>
    <h1>Заказ  #{orderId}!</h1>

    <p>Оплатите заказ на сумму <b>{totalAmount} ₽!</b> Перейдите {''} <a href={paymentUrl}>по этой ссылке</a>  для оплаты.</p>
  </div>
);