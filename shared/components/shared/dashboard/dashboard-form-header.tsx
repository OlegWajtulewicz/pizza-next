import { Button } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
  isEdit?: boolean;
  loading?: boolean;
  className?: string;
}

export const DashboardFormHeader: React.FC<Props> = ({ isEdit, loading, className }) => {
  return (
    <div className={cn('flex justify-between items-center gap-3', className)}>
      <h1 className="font-extrabold text-xl">{isEdit ? 'Редактирование' : 'Создание'}</h1>
      <Button loading={loading}>Сохранить</Button>
    </div>
  );
};
