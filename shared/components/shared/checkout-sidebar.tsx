import { ArrowRight, Package, Percent, Truck } from "lucide-react"
import { CheckoutItemDetails } from "./checkout-item-details"
import { WhiteBlock } from "./white-block"
import { Button, Skeleton } from "../ui"

interface Props {
    totalAmount: number;
    loading?: boolean;
    className?: string;
    submitting?: boolean;
    //totalPrice: number,
}

const VAT = 23;
const DELIVERY_PRICE = 500;

export const CheckoutSidebar: React.FC<Props> = ({ totalAmount, loading, submitting }) => {
    const vatPrice = (totalAmount * VAT) / 100;
    const deliveryPrice = totalAmount > 0 ? DELIVERY_PRICE : 0;
    const totalPrice = (totalAmount + vatPrice + deliveryPrice).toFixed(2);

    return (
        <WhiteBlock className="p-6 sticky top-4">
            <div className="flex flex-col gap-1">
                <span className="text-lg font-bold">Итого:</span> 
                {loading ? (
                    <Skeleton className="w-full h-9"></Skeleton>
                ) :(
                    <span className="text-[24px] font-extrabold"> {totalPrice} ₽</span>
                )}
            </div>

        <CheckoutItemDetails title={
            <div className="flex items-center white-space-nowrap">
            <Package className="mr-1 text-gray-400" size={16} />
            <span >Стоимость корзины:</span>
            </div>
            } 
            value={loading ? <Skeleton className="w-16 h-7"/> : `${totalAmount} ₽`}/>   
        <CheckoutItemDetails title={
            <div className="flex items-center">
            <Percent className="mr-1 text-gray-400" size={16} />
            <span>Налоги:</span>
            </div>
            } 
            value={loading ? <Skeleton className="w-16 h-7"/> : `${vatPrice} ₽`}/> 
        <CheckoutItemDetails title={
            <div className="flex items-center">
            <Truck className="mr-1 text-gray-400" size={16} />
            <span>Стоимость доставки:</span>
            </div>
            } 
            value={loading ? <Skeleton className="w-16 h-7"/> : `${deliveryPrice} ₽`}/>  
        <Button
            loading={loading}
            type="submit"
            disabled={!totalAmount || submitting}
            className="w-full h-14 rounded-lg mt-6 text-base font-bold">
            Оформить заказ
            <ArrowRight className="w-5 ml-2" />
        </Button>
        </WhiteBlock>
    )
}