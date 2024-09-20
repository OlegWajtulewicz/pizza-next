import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  const id = request.nextUrl?.pathname?.split('/').pop();
  const numericId = id ? parseInt(id, 10) : null;

  if (numericId) {
    const data = await request.json();
    console.log('Полученные данные для обновления:', data);

    try {
      const updatedProductItem = await prisma.productItem.update({
        where: { id: numericId },
        data: {
          price: data.price,
          size: data.size,
          pizzaType: data.pizzaType,
          productId: data.productId,
        },
      });

      console.log('Обновленный элемент продукта:', updatedProductItem);
      return NextResponse.json(updatedProductItem);
    } catch (error) {
      console.error('Ошибка при обновлении товара:', error);
      return NextResponse.json({ error: 'Ошибка при обновлении товара' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Неверный идентификатор' }, { status: 400 });
  }
}



export async function GET(request: NextRequest) {
  const id = request.nextUrl?.pathname?.split('/').pop();
  const numericId = id ? parseInt(id, 10) : null;

  if (numericId) {
    try {
      const productItem = await prisma.productItem.findUnique({
        where: { id: numericId },
      });
      if (productItem) {
        return NextResponse.json(productItem);
      } else {
        return NextResponse.json({ error: 'Товар не найден' }, { status: 404 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Ошибка при получении товара' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Неверный идентификатор' }, { status: 400 });
  }
}
