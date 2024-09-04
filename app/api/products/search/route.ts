
import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  
  //const params = getSearchParams<GetSearchParams>(req.url);
  const query = req.nextUrl.searchParams.get('query') || '';
//console.log(req.nextUrl);
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    take: 5,
  });

  return NextResponse.json(products);
}