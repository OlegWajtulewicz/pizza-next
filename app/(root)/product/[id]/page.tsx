import { Container, ProductImage, Title, GroupVariants } from "@/components/shared";
import { prisma } from "@/prisma/prisma-client"
import { notFound } from "next/navigation";

export default async function ProductPage({ params: { id } }: { params: { id: string } }) {
    const product = await prisma.product.findFirst({ where: { id: Number(id) } });

    if (!product) {
        return notFound();
    }

    return (
        <Container className='flex flex-col my-10'>
            <div className="flex flex-1">
            <ProductImage imageUrl={product.imageUrl} size={30} />

                <div className="w-[490px] bg-[#eeecec5e] p-7 flex flex-col gap-3">
                    <Title text={product.name} size="md" className="font-extrabold mb-1" />
                    <p className="text-sm text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem maxime i similique nam reiciendis. Itaque, fugiat.</p>

                    <GroupVariants 
                        selectValue="2"
                        items={[
                            { name: 'Маленькая', value: '1', },
                            { name: 'Средняя', value: '2', },
                            { name: 'Большая', value: '3', },
                        ]}            
                        />
                </div>

            </div>
            
        </Container>
    );
}