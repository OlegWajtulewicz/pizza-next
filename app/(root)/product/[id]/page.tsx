
import { Container, ProductForm, ProductsGroupList, TopBar } from "@/shared/components/shared";
import { prisma } from "@/prisma/prisma-client"
import { notFound } from "next/navigation";
import ProductPageTopBar from "@/shared/components/shared/product-page-top-bar";


export default async function ProductPage({ params: { id } }: { params: { id: string } }) {
  
    const categories = await prisma.category.findMany();
    const product = await prisma.product.findFirst({ where: { id: Number(id) }, include: { 
        ingredients: true, 
        category: {
            include: {
                products: {
                    include: {
                        items: true,
                        ingredients: true,
                    },
                },
            },
        },
        items: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              product: {
                include: {
                  items: true,
                },
              },
            },
          },
        }, 
        
    });

    if (!product) {
        return notFound();
    }


    return (
        <div className="w-full">
          <ProductPageTopBar categories={categories} />
            <Container className='flex flex-col my-10'>
              <ProductForm
                product={product}
                imageUrl={product.imageUrl}
                name={product.name}
                price={0}
                loading={false} />
              <ProductsGroupList
                className="mt-20"
                listClassName="grid-cols-4"
                key={product.category.id}
                title="Рекомендации"
                categoryId={product.category.id}
                products={product.category.products}
                items={product.category.products} />
          </Container>
      </div>
      
       
        
    );
}