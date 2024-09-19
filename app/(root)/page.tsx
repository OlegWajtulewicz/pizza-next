import { ProductsGroupList } from "@/shared/components/shared/products-group-list";
import { Title, Container, TopBar, Filters, Stories } from "../../shared/components/shared";
import { Suspense } from "react";
import { findPizzas, GetSearchParams } from "@/shared/lib/find-pizzas";
import { Pagination } from "@/shared/components/shared/pagination";


export default async function Home({ searchParams } : { searchParams: GetSearchParams }) {
  const [categoryProducts, meta] = await findPizzas(searchParams);
  
  return (
    <>
      <Container className="mt-5">
        <Title text="Все пиццы" size="lg" className="font-extrabold" />

     </Container>
     <TopBar categories={categoryProducts.filter((category) => category.products.length > 0)}  />
      <Stories/>
     <Container className="pb-14 mt-10" >
     <div className="flex gap-[60px]">
        <div className="w-[250px]">
        <Suspense> <Filters/></Suspense> 
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-16">
            {categoryProducts.map(
              (category) =>
                category.products.length > 0 && (
                  <><ProductsGroupList
                    key={category.id}
                    title={category.name}
                    categoryId={category.id}
                    items={category.products}
                    products={category.products} />
                    <div className="flex items-center gap-6 mt-12">
                      <Pagination pageCount={meta.pageCount} currentPage={meta.currentPage} />
                      <span className="text-sm text-gray-400">5 из 65</span>
                    </div></>
                ),
            )}
            
          </div>
          
        </div>
     </div>
     </Container>
    </>
  )
}
