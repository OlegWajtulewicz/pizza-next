import { prisma } from "@/prisma/prisma-client";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);
        const data = (await req.json()) as { quantity: number };
        const token = req.cookies.get('cartToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "No token" }, { status: 401 });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id,
            }
        });

        if (!cartItem) {
            return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
        }

        await prisma.cartItem.update({
            where: {
                id,
            },
            data: {
                quantity: data.quantity
            },
        });

        const updateUserCart = await updateCartTotalAmount(token);

        return NextResponse.json(updateUserCart);
} catch (error) {
        console.log("Something went wrong", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);
        const token = req.cookies.get('cartToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "No token" }, { status: 401 });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: Number(params.id),
            }
        });

        if (!cartItem) {
            return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
        }

        await prisma.cartItem.delete({
            where: {
                id: Number(params.id),
            }
        });

        const updateUserCart = await updateCartTotalAmount(token);

        return NextResponse.json(updateUserCart);

} catch (error) {
        console.log("Something went wrong", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
