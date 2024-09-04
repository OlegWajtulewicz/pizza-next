'use server';

import second from 'resend';
import { prisma } from "@/prisma/prisma-client";
import { CheckoutFormValues } from "@/shared/constants";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { createPayment, sendEmail } from '@/shared/lib';
import { PayOrderTemplate } from '@/shared/components/shared/email-templates';

export async function createOrder(data: CheckoutFormValues) {
    try {
        const cookieStore = cookies();
        const cartToken = cookieStore.get('cartToken')?.value;

        if (!cartToken) {
            throw new Error('No token');
        }
        //* находим корзину по токену
        const useCart = await prisma.cart.findFirst({
            include: {
                user: true,
                items : {
                    include: {
                        ingredients: true,
                        productItem: {
                            include: {
                                product: true,
                            },
                        }, 
                    },
                },
            },
            where: {
                token: cartToken,
            },
        });

        //* если корзина не найдена возвращаем ошибку
        if (!useCart) {
            throw new Error('Cart not found');
        }

        //* если корзина пустая возвращаем ошибку
        if (useCart?.totalAmount === 0) {
            throw new Error('Cart is empty');
        }

        //* создаем заказ
        const order = await prisma.order.create({
            data: {
              //  token: cartToken,
                fullName: data.firstName + ' ' + data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                comment: data.comment,
                totalAmount: useCart.totalAmount,
                status: OrderStatus.PENDING,
                items: JSON.stringify(useCart.items),
            },
        });

        //* очищаем стоимость корзины
        await prisma.cart.update({
            where: {
                id: useCart.id,
            },
            data: {
                totalAmount: 0,
            },
        });
        
        //* очищаем корзину от товаров
        await prisma.cartItem.deleteMany({
            where: {
                cartId: useCart.id,
            },
        });

        // TODO: создание ссылки на страницу успешного оформления заказа

        const paymentData = await createPayment({
            amount: order.totalAmount,
            orderId: order.id,
            description: 'Оплата заказа #' + order.id,
        });

        if (!paymentData) {
            throw new Error('Payment data not found');
        }

        await prisma.order.update({
            where: {
                id: order.id,
            },
            data: {
                paymentId: paymentData.id,
            },
        });

        const paymentUrl = paymentData.confirmation.confirmation_url;

        await sendEmail(
            data.email, 
            "Pizza Next | Оплатите заказ #" + order.id, 
            PayOrderTemplate({
                orderId: order.id,
                totalAmount: order.totalAmount,
                paymentUrl,
            }));

        return paymentUrl;
    } catch (error) {
        console.log('[actions.ts:createOrder] Server error', error);
    }
}