import React from 'react';
import { useController, Control } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  name: string;
  options: Option[];
  control: Control<any>; // Используем Control из react-hook-form
  required?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({ name, options, control, required }) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error }
  } = useController({ name, control });

  return (
    <div className="mb-4">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        className={`mt-1 block w-full border rounded-md p-2 ${error ? 'border-red-500' : ''}`}
      >
        <option value="">Выберите категорию</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};
