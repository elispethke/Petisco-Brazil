'use client';

import { useState, useMemo } from 'react';
import { Order, OrderStatus } from '@/shared/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { cn } from '@/shared/utils/cn';

interface OrderListProps {
  orders: Order[];
}

const STATUS_FILTERS: Array<{ key: OrderStatus | 'all'; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'preparing', label: 'Preparando' },
  { key: 'delivered', label: 'Entregues' },
];

export function OrderList({ orders: initialOrders }: OrderListProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const statusOk = filter === 'all' || o.status === filter;
      const dateOk = !dateFilter || o.scheduledDate === dateFilter;
      return statusOk && dateOk;
    });
  }, [orders, filter, dateFilter]);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o)),
    );
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
                filter === f.key
                  ? 'bg-brand-terracotta border-brand-terracotta text-white'
                  : 'border-brand-gold/30 text-brand-gold hover:border-brand-gold',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-brand-green-light border border-brand-gold/20 text-white rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-brand-gold"
        />
        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="text-brand-gold/60 hover:text-brand-gold text-sm"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-brand-gold/15">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-gold/15 bg-brand-green-light">
              {['Pedido', 'Itens', 'Data Entrega', 'Horário', 'Total', 'Status', 'Ação'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-brand-gold uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/40">
                  Nenhum pedido encontrado
                </td>
              </tr>
            ) : (
              filtered.map((order, i) => (
                <tr
                  key={order.id}
                  className={cn(
                    'border-b border-brand-gold/10 hover:bg-brand-gold/5 transition-colors',
                    i % 2 === 0 ? 'bg-brand-green' : 'bg-brand-green-light/50',
                  )}
                >
                  <td className="px-4 py-3 text-sm font-mono text-white/80">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/70">
                    {order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/80">
                    {order.scheduledDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/80">
                    {order.scheduledTime}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-brand-gold">
                    €{(order.totalPrice / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="bg-brand-green border border-brand-gold/20 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-brand-gold"
                    >
                      <option value="pending">Pendente</option>
                      <option value="preparing">Preparando</option>
                      <option value="delivered">Entregue</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-white/30 text-xs mt-3">
        {filtered.length} pedido{filtered.length !== 1 ? 's' : ''} encontrado
        {filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
