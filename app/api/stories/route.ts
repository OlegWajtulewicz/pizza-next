import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';


// GET: Получить все истории с их элементами
export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      include: {
        items: true, // Включаем элементы историй
      },
    });
    return NextResponse.json(stories, { status: 200 });
  } catch (error) {
    console.error('Ошибка получения историй:', error);
    return NextResponse.json({ error: 'Не удалось получить истории' }, { status: 500 });
  }
}

// POST: Создать новую историю с элементами
export async function POST(request: Request) {
  try {
    const { previewImageUrl, items } = await request.json();  // Получаем данные из запроса

    if (!previewImageUrl || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Некорректные данные для создания истории' }, { status: 400 });
    }

    const newStory = await prisma.story.create({
      data: {
        previewImageUrl,
        items: {
          create: items.map((item: { sourceUrl: string }) => ({
            sourceUrl: item.sourceUrl,
          })),
        },
      },
      include: {
        items: true,  // Включаем созданные элементы в ответ
      },
    });

    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания истории:', error);
    return NextResponse.json({ error: 'Не удалось создать историю' }, { status: 500 });
  }
}

// DELETE: Удалить историю по ID
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const storyId = searchParams.get('id');  // Извлекаем ID истории из query-параметров

  if (!storyId) {
    return NextResponse.json({ error: 'ID истории не предоставлен' }, { status: 400 });
  }

  try {
    const deletedStory = await prisma.story.delete({
      where: { id: Number(storyId) },
      include: { items: true },  // Удаляем историю вместе с элементами
    });

    return NextResponse.json({ message: 'История успешно удалена', deletedStory }, { status: 200 });
  } catch (error) {
    console.error('Ошибка удаления истории:', error);
    return NextResponse.json({ error: 'Не удалось удалить историю' }, { status: 500 });
  }
}

// export async function GET() {
//   const stories = await prisma.story.findMany({
//     include: {
//       items: true,
//     },
//   });

//   return NextResponse.json(stories);
// }


