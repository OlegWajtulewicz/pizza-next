import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const productItems = await prisma.productItem.findMany({
      include: {
        product: true, // Включите связанные продукты
      },
    });
    return NextResponse.json(productItems);
  } catch (error) {
    console.error('Ошибка получения элементов продуктов:', error);
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const productItem = await prisma.productItem.create({
      data: {
        price: data.price,
        size: data.size,
        pizzaType: data.pizzaType,
        productId: data.productId,
      },
    });
    return NextResponse.json(productItem);
  } catch (error) {
    console.error('Ошибка создания элемента продукта:', error);
    return NextResponse.error();
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const productItem = await prisma.productItem.update({
      where: { id: data.id },
      data: {
        price: data.price,
        size: data.size,
        pizzaType: data.pizzaType,
        productId: data.productId,
      },
    });
    return NextResponse.json(productItem);
  } catch (error) {
    console.error('Ошибка обновления элемента продукта:', error);
    return NextResponse.error();
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.productItem.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Элемент продукта успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления элемента продукта:', error);
    return NextResponse.error();
  }
}


