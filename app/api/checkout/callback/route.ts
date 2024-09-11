import { PaymentCallbackData } from "@/@types/payment-callback";
import { prisma } from "@/prisma/prisma-client";
import { OrderSuccessTemplate } from "@/shared/components/shared/email-templates/order-success";
import { useCart } from "@/shared/hooks";
import { sendEmail } from "@/shared/lib";
import { CartItemDTO } from "@/shared/services/dto/cart.dto";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


// export async function POST(req: NextRequest) {
//   try {
//   //  console.log('Received request');
//     const body = (await req.json()) as PaymentCallbackData;

//   //  console.log('Parsed body:', body);

//     if (!body || !body.object || !body.object.metadata?.order_id) {
//       return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
//     }

//     const order = await prisma.order.findFirst({
//       where: {
//         id: Number(body.object.metadata.order_id),
//       },
//     });

//   //  console.log('Fetched order:', order);

//     if (!order) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//     }

//     const isSucceeded = body?.object?.status === 'succeeded';

//     await prisma.order.update({
//       where: {
//         id: order.id,
//       },
//       data: {
//         status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
//       },
//     });

//  //   console.log('Order status updated');

//     const items = JSON.parse(order?.items as string) as CartItemDTO[];
    
//   //  console.log('Parsed items:', items);

//     if (isSucceeded) {
//       try {
//         await sendEmail(
//           order.email,
//           `Next Pizza | Заказ оплачен!`,
//           OrderSuccessTemplate({ orderId: order.id, items })
//         );
//     //    console.log('Email sent');
//       } catch (emailError) {
//         console.error('Error sending email:', emailError);
//       }
//     }

//     return NextResponse.json({ message: 'Payment processed successfully' });

//   } catch (error) {
//     console.error('[checkout/callback] error', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

export async function POST(req: NextRequest) {
  try {
    console.log('Полученный запрос');
    const body = (await req.json()) as PaymentCallbackData;

    console.log('Разобранное тело:', body);

    if (!body || !body.object || !body.object.metadata?.order_id) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: Number(body.object.metadata.order_id),
      },
    });

    console.log('Body status:', body.object.status);
    console.log('Order ID from metadata:', body.object.metadata.order_id);

    console.log('Полученный заказ:', order);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isSucceeded = body?.object?.status === 'succeeded';

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
      },
    });

    console.log('Обновление статуса заказа');

    const items = JSON.parse(order?.items as string) as CartItemDTO[];
    
    console.log('Разобранные элементы:', items);

    

    if (isSucceeded) {
      try {
        // await sendEmail(
        //   order.email,
        //   `Next Pizza | Заказ оплачен!`,
        //   OrderSuccessTemplate({
        //     orderId: order.id, 
        //     items,
        //   //  totalAmount: useCart.totalAmount,
        //   //  totalPrice: order.totalAmount,
        //   //  vatPrice: order.vatAmount,
        //   //  deliveryPrice: order.deliveryAmount,
        //    // paymentUrl: "",
        //  }
        // );
              //  );
      const html = `
      <h1>Спасибо за покупку! 🎉</h1>

      <p>Ваш заказ #${order?.id} оплачен. Список товаров:</p>
        
      <hr />
    
      <ul>
      ${items
        .map((item) => {
          return `<li>${item.productItem.product.name} | (${item.productItem.price}₽ x ${item.quantity} шт.)</li>`;
        })
        .join('')}
      </ul> `;
  
      await sendEmail(
        order.email, 
        `Next Pizza | Заказ #${order?.id} оплачен!`, 
        html
      );


        console.log('Электронная почта отправлена');
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    }

    return NextResponse.json({ message: 'Платеж успешно обработан' });

  } catch (error) {
    console.error('[checkout/callback] error', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

////////////////////////////////////$Recycle.Bin
// export async function POST(req: NextRequest) {
//   console.log("POST /checkout route hit");
//   try {
//     console.log('Полученный запрос');

//       //* получаем данные от платежа
//       const body = (await req.json()) as PaymentCallbackData;
//       console.log('Разобранное тело:', body);

//       //* получаем данные о заказе
//       const order = await prisma.order.findFirst({
//           where: {
//             id: Number(body.object.metadata.order_id),
//           },

//         });
//         console.log('Полученный заказ:', order);

//         //* если заказ не найден
//       if (!order) {
//           return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//       }

//       //* ответ сервера о платеже
//       const isSucceeded = body.object.status === 'succeeded';

//       //* обновляем статус заказа
//       await prisma.order.update({
//           where: {
//           id: order.id,
//           },
//           data: {
//           status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
//           },
//       });
//       console.log('Обновление статуса заказа');

//           //* находим товары 
//       const items = JSON.parse(order?.items as string) as CartItemDTO[];
//       console.log('Разобранные элементы:', items);
      
//           //* отправляем письмо с данными о заказе
//       if (isSucceeded) {
//           await sendEmail(
//               order.email, 
//               'Next Pizza | Заказ оплачен!',
//               OrderSuccessTemplate({ orderId: order.id, items })
//           );
//       }
//       console.log('Электронная почта отправлена');
//   } catch (error) {
//       console.log('[checkout/callback] error', error);
//       return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }


// }


