import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';


// Обрабатываем GET-запрос для получения всех категорий
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true, // Включаем связанные продукты
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.log('Error [GET_CATEGORIES]', error);
    return NextResponse.error();
  }
}
