
export function calculatePrices(totalAmount: number) {
    
    const VAT = 23;
    let DELIVERY_PRICE = 0; 
    const TOTAL = totalAmount * 100;

    if (totalAmount < 30000 && totalAmount > 0) {
        DELIVERY_PRICE = 50000;
    } if (totalAmount > 3000) {
        DELIVERY_PRICE = 25000;
    } if (totalAmount > 6000) {
        DELIVERY_PRICE = 0;
    }

    const vatPrice = Math.round((TOTAL * VAT) / 100);
    const totalPrice = vatPrice + DELIVERY_PRICE + TOTAL;
    
   

    return {
        vatPrice: (vatPrice / 100).toFixed(2), 
        deliveryPrice: ((totalAmount > 0 ? DELIVERY_PRICE : 0) / 100).toFixed(2),
        totalPrice: (totalPrice / 100).toFixed(2), 
    };
}
  