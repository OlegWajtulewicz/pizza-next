'use client';

import { FormProvider, useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckoutSidebar, Container, Title } from "@/shared/components";
import { useCart } from "@/shared/hooks";
import { CheckoutAddressForm, CheckoutCart, CheckoutPersonalForm } from "@/shared/components";
import { CheckoutFormValues, checkoutFormSchema } from "@/shared/constants";
import { createOrder } from "@/app/actions";
import toast from "react-hot-toast";
import { Icon } from "lucide-react";


export default function CheckoutPage() {
    const { totalAmount, items, updateItemQuantity, removeCartItem, loading } = useCart();

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            comment: '',
        }
    })

    const onSubmit = async (data: CheckoutFormValues) => {
        try {

            const url = await createOrder(data);

        } catch (error) {
            toast.error('Не удалось создать заказ', {
                icon: 'x',
            });
            
        };
    };

    const onClickCountButton = ( id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity);
    }

   
    return (
        <Container className="my-10">
          <Title text="Оформление заказа" size="lg" className="font-extrabold mb-8" /> 
          <FormProvider {...form}> 
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-10">
                <div className="flex flex-col gap-10 flex-1 mb-20 ">  {/* w-[70%] */}
                    <CheckoutCart 
                        items={items} 
                        onClickCountButton={onClickCountButton} 
                        removeCartItem={removeCartItem} 
                        className="flex-1" 
                        loading={loading}
                        />
                    <CheckoutPersonalForm className={loading ? "opacity-50 pointer-events-none" : ""} />
                    <CheckoutAddressForm className={loading ? "opacity-50 pointer-events-none" : ""} />
                </div>
                <div className="w-[30%]">
                    <CheckoutSidebar totalAmount={totalAmount} loading={loading} />
                </div>
            </div>
            </form>
          </FormProvider>
        </Container>
    )
}