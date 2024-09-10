'use client';

import { FormProvider, useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckoutSidebar, Container, Title } from "@/shared/components";
import { useCart } from "@/shared/hooks";
import { CheckoutAddressForm, CheckoutCart, CheckoutPersonalForm } from "@/shared/components";
import { CheckoutFormValues, checkoutFormSchema } from "@/shared/constants";
import { createOrder } from "@/app/actions";
import toast from "react-hot-toast";
import React from "react";
import { useSession } from "next-auth/react";
import { Api } from "@/shared/services/api-client";


export default function CheckoutPage() {
    const [submitting, setSubmitting] = React.useState(false);
    const { totalAmount, items, updateItemQuantity, removeCartItem, loading } = useCart();
    const { data: session } = useSession();

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
    });

    React.useEffect(() => {
        async function fetchUserInfo() {
            const data = await Api.auth.getMe();
            const [firstName, lastName] = data.fullName.split(' ');
            
            form.setValue('firstName', firstName);
            form.setValue('lastName', lastName);
            form.setValue('email', data.email);
        }

        if (session) {
            fetchUserInfo();
            }
        }, [session]);

        const VAT = 23;
        const DELIVERY_PRICE = 500;

        const vatPrice = (totalAmount * VAT) / 100;
        const deliveryPrice = totalAmount > 0 ? DELIVERY_PRICE : 0;
        const totalPrice = (totalAmount + vatPrice + deliveryPrice).toFixed(2);

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);
            const url = await createOrder(data);

            toast.success('Заказ успешно создан! 📝 Перейдите по ссылке...', {
                icon: '👏 ✅ ',
            });
            form.reset();

            if (url) {
                location.href = url;
            }

        } catch (error) {
            setSubmitting(false);
            console.error(error);
            toast.error('Не удалось создать заказ', {
                icon: '❌',
            });
        } 
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
                    <CheckoutSidebar 
                            totalAmount={totalAmount}
                            loading={loading || submitting} 
                           
                            />
                </div>
            </div>
            </form>
          </FormProvider>
        </Container>
    )
}