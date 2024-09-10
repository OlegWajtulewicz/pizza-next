
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import { findOrCreateCart } from "@/shared/lib/find-or-create-cart";
import { CreateCartItemValues } from "@/shared/services/dto/cart.dto";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";

export async function GET(req: NextRequest) {
    try {
        //const userId = 1;
        const token = req.cookies.get('cartToken')?.value;

        if (!token) {
            return NextResponse.json({ totalAmount: 0, items: [] });
        }

        const userCart = await prisma.cart.findFirst({
            where: {
                OR: [
                    
                    {
                        token,
                    },
                ],
            },
            include: {
                items: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        productItem: {
                            include: {
                                product: true,
                            },
                        },
                        ingredients: true,
                    },
                },
            },
        });
    
        return NextResponse.json( userCart );
    } catch (error) {
        console.error('[CART_GET] Server Error', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
    
}

export async function POST(req: NextRequest) {
    try {
        let token = req.cookies.get('cartToken')?.value;

        if (!token) {
            token = crypto.randomUUID();
        }

        const userCart = await findOrCreateCart(token);

        const data = await req.json() as CreateCartItemValues;

        //* Если нет в корзине то добавляем в корзину. Сортировка при добавлении
        const findCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: userCart.id,
                productItemId: data.productItemId,
                ingredients: { 
                    every: {
                        id: { in: data.ingredients },
                    },
                  //  some: {},
                },
            },
            include: {
                productItem: {
                    include: {
                        product: true,
                    },
                },
                ingredients: true,
            },
        });
        //* Если товар был найден делаем + 1
        if (findCartItem) {
            await prisma.cartItem.update({
                where: {
                    id: findCartItem.id,
                },
                data: {
                    quantity: findCartItem.quantity + 1,
                },
            });
        }  else {
            await prisma.cartItem.create({
                data: {
                    cartId: userCart.id,
                    productItemId: data.productItemId,
                    quantity: 1,
                    ingredients: { connect: data.ingredients?.map((id) => ({ id })) },
                },
            });
        }

        

        const updateUserCart = await updateCartTotalAmount(token);
        const resp = NextResponse.json(updateUserCart);
        resp.cookies.set('cartToken', token );
        return resp;

    }  catch (error) {
        console.error('[CART_POST Server Error', error);
        return NextResponse.json({ error: 'Dont have POST' }, { status: 500 });
    }   
}


