import { OrderStatus } from '@/shared/types';
import { cn } from '@/shared/utils/cn';

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  preparing: {
    label: 'Preparando',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  delivered: {
    label: 'Entregue',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border',
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
