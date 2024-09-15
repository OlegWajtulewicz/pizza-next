import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';


// Получение всех продуктов
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // Включаем связанные категории
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.error();
  }
}

// Создание нового продукта
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        category: {
          connect: { id: data.categoryId },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.error();
  }
}

// Обновление существующего продукта
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const product = await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        category: {
          connect: { id: data.categoryId },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.error();
  }
}

// Удаление продукта
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.error();
  }
}

