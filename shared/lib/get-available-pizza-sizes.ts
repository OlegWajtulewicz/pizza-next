import { ProductItem } from "@prisma/client";
import { PizzaSizes, PizzaType } from "../constants/pizza";
import { Variant } from "../components/shared/group-variants";

export const getAvailablePizzaSizes = ( type: PizzaType, items: ProductItem[] ): Variant[] => {
    // * хук доступных размеров
  const filteredPizzasByType = items.filter((item) => item.pizzaType === type);
  
  return PizzaSizes.map((item) => ({
    name: item.name,
    value: item.value,
    disabled: !filteredPizzasByType.some((pizza) => Number(pizza.size) === Number(item.value)),
  }));
  
}