import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';


// GET: Получить историю по ID вместе с её элементами
export async function GET(request: NextRequest) {
  // Получаем ID из пути URL
  const id = request.nextUrl?.pathname?.split('/').pop();
  const numericId = id ? parseInt(id, 10) : null;

  if (!numericId) {
    return NextResponse.json({ error: 'Неверный идентификатор' }, { status: 400 });
  }

  try {
    // Ищем историю по ID, включая связанные элементы (items)
    const story = await prisma.story.findUnique({
      where: { id: numericId },
      include: { items: true },  // Включаем элементы истории
    });

    if (!story) {
      return NextResponse.json({ error: 'История не найдена' }, { status: 404 });
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Ошибка при получении истории:', error);
    return NextResponse.json({ error: 'Ошибка при получении истории' }, { status: 500 });
  }
}
