import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface PaymentData {
  id: string;
  status: string;
  amount: Amount;
  description: string;
  recipient: Recipient;
  created_at: string;
  confirmation: Confirmation;
  test: boolean;
  paid: boolean;
  refundable: boolean;
  metadata: Metadata;
}

export interface Amount {
  value: string;
  currency: string;
}

export interface Recipient {
  account_id: string;
  gateway_id: string;
}

export interface Confirmation {
  type: string;
  confirmation_url: string;
}

export interface Metadata {
  order_id: string;

//  vatPrice: number;
//  deliveryPrice: number;
}


export async function createPayment(details: {
  description: string;
  orderId: number;
  amount: number;

//  vatPrice: number;
//  deliveryPrice: number;
}) {
  
  if (!process.env.YOOKASSA_API_KEY || !process.env.YOOKASSA_STORE_ID || !process.env.YOOKASSA_RETURN_URL) {
    throw new Error('Необходимо указать ключи YOOKASSA_API_KEY, YOOKASSA_STORE_ID и YOOKASSA_RETURN_URL');
  }
  
  
  try {
    const { data } = await axios.post<PaymentData>(
      'https://api.yookassa.ru/v3/payments',
      {
        amount: {
          value: details.amount,
          currency: 'RUB',
        },
        capture: true,
        description: details.description,
        metadata: {
          order_id: details.orderId,
          //* Добавляем НДС в метаданные
        //  vatPrice: details.vatPrice,       // Добавляем НДС в метаданные
        //  deliveryPrice: details.deliveryPrice, // Добавляем стоимость доставки
        },
        confirmation: {
          type: 'redirect',
          return_url: process.env.YOOKASSA_RETURN_URL,
        },
      },
      {
        auth: {
          username: process.env.YOOKASSA_STORE_ID as string,
          password: process.env.YOOKASSA_API_KEY as string,
        },
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': uuidv4(), 
        },
      },
    );
  
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка при создании платежа:', error.response?.data);
      throw new Error('Не удалось создать платеж');
    } else {
      console.error('Непредвиденная ошибка:', error);
      throw new Error('Произошла непредвиденная ошибка');
    }
  }
  
}


// export async function createPayment(details: {
//   description: string;
//   orderId: number;
//   amount: number;

// //  vatPrice: number;
// //  deliveryPrice: number;
// }) {
  
//   if (!process.env.YOOKASSA_API_KEY || !process.env.YOOKASSA_STORE_ID || !process.env.YOOKASSA_RETURN_URL) {
//     throw new Error('Необходимо указать ключи YOOKASSA_API_KEY, YOOKASSA_STORE_ID и YOOKASSA_RETURN_URL');
//   }
  
  
//   try {
//     const { data } = await axios.post<PaymentData>(
//       'https://api.yookassa.ru/v3/payments',
//       {
//         amount: {
//           value: details.amount.toString(),  //* Приводим к строке с двумя знаками после запятой .toFixed(2)
//           currency: 'RUB',
//         },
//         capture: true,
//         description: details.description,
//         metadata: {
//           order_id: details.orderId,
//         //  vatPrice: details.vatPrice,       // Добавляем НДС в метаданные
//         //  deliveryPrice: details.deliveryPrice, // Добавляем стоимость доставки
//         },
//         confirmation: {
//           type: 'redirect',
//           return_url: process.env.YOOKASSA_RETURN_URL,
//         },
//       },
//       {
//         auth: {
//           username: process.env.YOOKASSA_STORE_ID as string,
//           password: process.env.YOOKASSA_API_KEY as string,
//         },
//         headers: {
//           'Content-Type': 'application/json',
//           'Idempotence-Key': uuidv4(), 
//         },
//       },
//     );
  
//     return data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Ошибка при создании платежа:', error.response?.data);
//       throw new Error('Не удалось создать платеж');
//     } else {
//       console.error('Непредвиденная ошибка:', error);
//       throw new Error('Произошла непредвиденная ошибка');
//     }
//   }
  
// }
