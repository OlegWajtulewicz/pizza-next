'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { CheckboxFiltersGroup } from '@/components/shared/checkbox-filters-group';
import { Title } from './title';
import { RangeSlider } from '../ui/range-slider';
import { useIngedients, useFilters, useQueryFilters } from '@/hooks';


interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { ingredients, loading,  } = useIngedients();
  const filters = useFilters();

  useQueryFilters(filters);
  
  const items = ingredients.map((item) => ({ value: String(item.id), text: item.name }));

  const updatePrices = (prices: number[]) => {
    filters.setPrices('priceFrom', prices[0]);
    filters.setPrices( 'priceTo', prices[1]);
  };

 
  return (
        <div className={className}>
          <Title
            text="Фильтрация"
            size="sm"
            className="mb-5 font-bold pb-4 border-b border-b-neutral-100"
          />
          {/* //! Верхние чекбоксы */}
          <CheckboxFiltersGroup
            title="Тип теста"
            name="pizzaTypes"
            className="mb-5"
            onClickCheckbox={filters.setPizzaTypes}
            selectedIngredients={filters.pizzaTypes}
            items={[
              { text: 'Тонкое', value: '1' },
              { text: 'Традиционное', value: '2' },
            ]}
          /> 

        <div className="flex flex-col gap-4">
          <CheckboxFiltersGroup
            title="Размеры"
            name="sizes"
            className="mb-5"
            onClickCheckbox={filters.setSizes}
            selectedIngredients={filters.sizes}
            items={[
              { text: '20 см', value: '20' },
              { text: '30 см', value: '30' },
              { text: '40 см', value: '40' },
            ]}
        />
        </div>
          
            {/* //! Фильтр цен */}
        <div className="mt-10 pb-7">
         <p className="font-bold mb-3">Цена от и до:</p>
          <div className="flex gap-3 mb-5">
            <Input
              type="number"
              placeholder="0"
              min={0}
              max={1000}
              value={String(filters.prices.priceFrom)}
              onChange={(e) => filters.setPrices('priceFrom', Number(e.target.value))}
            />
              <Input
                type="number"
                min={100}
                max={1000}
                placeholder="1000"
                value={String(filters.prices.priceTo)}
                onChange={(e) => filters.setPrices('priceTo', Number(e.target.value))}
              />
            </div>
            <RangeSlider
              min={0}
              max={1000}
              step={10}
              value={[filters.prices.priceFrom || 0, filters.prices.priceTo || 1000]}
              onValueChange={updatePrices}
             
            />
          </div>
          <CheckboxFiltersGroup
            title="Ингредиенты"
            name="ingredients"
            className="mt-5"
            limit={6}
            defaultItems={items.slice(0, 6)}
            items={items}
            loading={ingredients.length === 0}
            onClickCheckbox={filters.setSelectedIngredients}
            selectedIngredients={filters.selectedIngredients}
          />
        </div>
  )
}

