// /Users/elispethke/Desktop/PetiscoBrazilApp/web/app/admin/page.tsx
'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { signOut, isAdminEmail } from '@/lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus =
  | 'pending'
  | 'paid'
  | 'in_preparation'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products: { name: string } | null;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_date: string;
  delivery_time: string;
  status: OrderStatus;
  total: number;
  stripe_session_id: string | null;
  created_at: string;
  delivered_at: string | null;
  notes: string | null;
}

interface Product {
  id: string;
  name: string;
  category: 'salgado' | 'doce' | 'combo' | 'bolo';
  price: number;
  stock_quantity: number;
  unit: string;
}

interface Profile {
  id: string;
  firebase_uid: string;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'production' | 'delivery' | 'customer';
  created_at: string;
}

type Tab = 'pedidos' | 'financeiro' | 'estoque' | 'equipe';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  in_preparation: 'Em preparo',
  ready: 'Pronto',
  out_for_delivery: 'Em entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  paid: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  in_preparation: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  ready: 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30',
  out_for_delivery: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  delivered: 'bg-green-500/20 text-green-300 border border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-300 border border-red-500/30',
};

const CATEGORY_LABELS: Record<Product['category'], string> = {
  salgado: 'Salgado',
  doce: 'Doce',
  combo: 'Combo',
  bolo: 'Bolo',
};

const ROLE_LABELS: Record<Profile['role'], string> = {
  admin: 'Admin',
  production: 'Produção',
  delivery: 'Entrega',
  customer: 'Cliente',
};

const ROLE_COLORS: Record<Profile['role'], string> = {
  admin: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  production: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  delivery: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  customer: 'bg-white/10 text-white/60 border border-white/10',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'EUR' });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function RoleBadge({ role }: { role: Profile['role'] }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        accent
          ? 'bg-[#C5A059]/10 border border-[#C5A059]/20'
          : 'bg-[#004433] border border-white/5'
      }`}
    >
      <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">{label}</p>
      <p
        className={`text-3xl font-bold font-serif ${accent ? 'text-[#C5A059]' : 'text-white'}`}
      >
        {value}
      </p>
      {sub && <p className="text-white/40 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderModal({
  order,
  items,
  loadingItems,
  onClose,
}: {
  order: Order;
  items: OrderItem[];
  loadingItems: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#003322] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">Pedido</p>
            <h2 className="text-white font-serif text-xl font-bold">
              #{order.id.slice(0, 8).toUpperCase()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm">Status</span>
            <StatusBadge status={order.status} />
          </div>

          {/* Client info */}
          <div className="bg-[#004433] rounded-2xl p-4 space-y-2.5">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Cliente</p>
            <div className="flex justify-between">
              <span className="text-white/60 text-sm">Nome</span>
              <span className="text-white text-sm font-medium">{order.customer_name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 text-sm">Telefone</span>
              <span className="text-white text-sm font-medium">{order.customer_phone || '—'}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/60 text-sm shrink-0">Endereço</span>
              <span className="text-white text-sm font-medium text-right">
                {order.delivery_address || '—'}
              </span>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-[#004433] rounded-2xl p-4 space-y-2.5">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Entrega</p>
            <div className="flex justify-between">
              <span className="text-white/60 text-sm">Data</span>
              <span className="text-white text-sm font-medium">{formatDate(order.delivery_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 text-sm">Hora</span>
              <span className="text-white text-sm font-medium">{order.delivery_time || '—'}</span>
            </div>
          </div>

          {/* Items */}
          <div className="bg-[#004433] rounded-2xl p-4">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Itens</p>
            {loadingItems ? (
              <div className="flex items-center gap-2 py-2">
                <div className="w-4 h-4 border border-[#C5A059]/40 border-t-[#C5A059] rounded-full animate-spin" />
                <span className="text-white/30 text-sm">Carregando...</span>
              </div>
            ) : items.length === 0 ? (
              <p className="text-white/30 text-sm">Nenhum item encontrado</p>
            ) : (
              <div className="space-y-2.5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[#C5A059] text-xs font-bold w-6 shrink-0">
                        {item.quantity}×
                      </span>
                      <span className="text-white text-sm">
                        {item.products?.name ?? `Produto #${item.product_id.slice(0, 6)}`}
                      </span>
                    </div>
                    <span className="text-white/70 text-sm">
                      {formatCents(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-[#B35C37]/10 border border-[#B35C37]/20 rounded-2xl p-4">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">
                Observações
              </p>
              <p className="text-white/80 text-sm">{order.notes}</p>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-white font-bold text-lg">Total</span>
            <span className="text-[#C5A059] font-bold text-xl font-serif">
              {formatCents(order.total)}
            </span>
          </div>

          {/* Meta dates */}
          <div className="text-white/25 text-xs space-y-1">
            <p>Criado: {new Date(order.created_at).toLocaleString('pt-BR')}</p>
            {order.delivered_at && (
              <p>Entregue: {new Date(order.delivered_at).toLocaleString('pt-BR')}</p>
            )}
            {order.stripe_session_id && (
              <p className="font-mono truncate">Stripe: {order.stripe_session_id}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Pedidos ─────────────────────────────────────────────────────────────

function TabPedidos({
  orders,
  isAdmin,
  onStatusChange,
}: {
  orders: Order[];
  isAdmin: boolean;
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>;
}) {
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const today = todayISO();

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    in_preparation: orders.filter((o) => o.status === 'in_preparation').length,
    delivered_today: orders.filter(
      (o) => o.status === 'delivered' && o.delivered_at?.slice(0, 10) === today
    ).length,
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const filterPills: { key: OrderStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Pendente' },
    { key: 'paid', label: 'Pago' },
    { key: 'in_preparation', label: 'Em preparo' },
    { key: 'ready', label: 'Pronto' },
    { key: 'out_for_delivery', label: 'Em entrega' },
    { key: 'delivered', label: 'Entregue' },
    { key: 'cancelled', label: 'Cancelado' },
  ];

  async function openOrder(order: Order) {
    setSelectedOrder(order);
    setLoadingItems(true);
    setOrderItems([]);
    const { data } = await supabase
      .from('order_items')
      .select('*, products(name)')
      .eq('order_id', order.id);
    setOrderItems(data ?? []);
    setLoadingItems(false);
  }

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    await onStatusChange(orderId, status);
    setUpdatingId(null);
  }

  const statusOptions: OrderStatus[] = [
    'pending',
    'paid',
    'in_preparation',
    'ready',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ];

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de pedidos" value={stats.total} />
        <StatCard
          label="Aguard. pagamento"
          value={stats.pending}
          sub={stats.pending > 0 ? 'Aguardando confirmação' : undefined}
        />
        <StatCard label="Em preparo" value={stats.in_preparation} />
        <StatCard
          label="Entregues hoje"
          value={stats.delivered_today}
          accent
        />
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {filterPills.map((pill) => {
          const count =
            pill.key === 'all'
              ? orders.length
              : orders.filter((o) => o.status === pill.key).length;
          return (
            <button
              key={pill.key}
              onClick={() => setFilter(pill.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === pill.key
                  ? 'bg-[#C5A059] text-[#003322]'
                  : 'bg-[#004433] text-white/60 hover:text-white hover:bg-[#005544]'
              }`}
            >
              {pill.label}
              <span className="ml-1.5 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Orders table */}
      <div className="bg-[#004433] rounded-2xl overflow-hidden border border-white/5">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-white/20 text-5xl mb-4">📋</p>
            <p className="text-white/40 font-medium">Nenhum pedido encontrado</p>
            <p className="text-white/25 text-sm mt-1">
              {filter !== 'all' ? 'Tente outro filtro' : 'Aguardando novos pedidos'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    #ID
                  </th>
                  <th className="text-left py-4 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Cliente
                  </th>
                  <th className="text-left py-4 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest hidden md:table-cell">
                    Telefone
                  </th>
                  <th className="text-left py-4 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest hidden lg:table-cell">
                    Data entrega
                  </th>
                  <th className="text-left py-4 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Valor
                  </th>
                  <th className="text-left py-4 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Status
                  </th>
                  {isAdmin && (
                    <th className="text-left py-4 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                      Ações
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={`border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                      idx % 2 !== 0 ? 'bg-white/[0.02]' : ''
                    }`}
                    onClick={() => openOrder(order)}
                  >
                    <td className="py-3.5 px-4">
                      <span className="text-[#C5A059] text-xs font-mono font-bold">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white text-sm font-medium">
                        {order.customer_name || '—'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="text-white/60 text-sm">{order.customer_phone || '—'}</span>
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      <span className="text-white/60 text-sm">
                        {formatDate(order.delivery_date)}
                        {order.delivery_time ? ` · ${order.delivery_time}` : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white text-sm font-semibold">
                        {formatCents(order.total)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    {isAdmin && (
                      <td
                        className="py-3.5 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {updatingId === order.id ? (
                          <span className="text-white/30 text-xs">Salvando...</span>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="bg-[#003322] border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/40 cursor-pointer"
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_LABELS[s]}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          items={orderItems}
          loadingItems={loadingItems}
          onClose={() => {
            setSelectedOrder(null);
            setOrderItems([]);
          }}
        />
      )}
    </div>
  );
}

// ─── Tab: Financeiro ──────────────────────────────────────────────────────────

function TabFinanceiro({ orders }: { orders: Order[] }) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const delivered = orders.filter((o) => o.status === 'delivered');
  const inProgress = orders.filter((o) =>
    ['paid', 'in_preparation', 'ready', 'out_for_delivery'].includes(o.status)
  );
  const allRevenueOrders = orders.filter((o) =>
    ['paid', 'in_preparation', 'ready', 'out_for_delivery', 'delivered'].includes(o.status)
  );

  const totalRevenue = delivered.reduce((sum, o) => sum + o.total, 0);
  const pendingTotal = inProgress.reduce((sum, o) => sum + o.total, 0);

  const thisMonthOrders = allRevenueOrders.filter(
    (o) => o.created_at?.slice(0, 7) === currentMonth
  );
  const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + o.total, 0);

  const tableOrders = [...allRevenueOrders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Receita total (entregues)"
          value={formatCents(totalRevenue)}
          sub={`${delivered.length} pedido(s) entregue(s)`}
          accent
        />
        <StatCard
          label="A receber (em andamento)"
          value={formatCents(pendingTotal)}
          sub={`${inProgress.length} pedido(s)`}
        />
        <StatCard
          label={`Este mês · ${currentMonth}`}
          value={formatCents(thisMonthRevenue)}
          sub={`${thisMonthOrders.length} pedido(s)`}
        />
      </div>

      {/* Table */}
      <div className="bg-[#004433] rounded-2xl overflow-hidden border border-white/5">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-white font-semibold text-base">Histórico financeiro</h3>
          <p className="text-white/40 text-xs mt-0.5">Todos os pedidos com pagamento confirmado</p>
        </div>
        {tableOrders.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-white/20 text-5xl mb-4">💰</p>
            <p className="text-white/40 font-medium">Nenhum pedido pago ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    #ID
                  </th>
                  <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Data
                  </th>
                  <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Cliente
                  </th>
                  <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Status
                  </th>
                  <th className="text-right py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      idx % 2 !== 0 ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span className="text-[#C5A059] text-xs font-mono font-bold">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white/60 text-sm">{formatDate(order.created_at)}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white text-sm">{order.customer_name || '—'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-white font-semibold text-sm">
                        {formatCents(order.total)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/20 bg-white/5">
                  <td colSpan={4} className="py-4 px-4 text-white/50 text-sm font-semibold">
                    Total · {tableOrders.length} pedido(s)
                  </td>
                  <td className="py-4 px-4 text-right text-[#C5A059] font-bold text-base">
                    {formatCents(tableOrders.reduce((s, o) => s + o.total, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Estoque ─────────────────────────────────────────────────────────────

function TabEstoque() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('category')
        .order('name');
      setProducts(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  function handleQtyChange(productId: string, value: string) {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setEditing((prev) => ({ ...prev, [productId]: num }));
    }
  }

  async function saveStock(productId: string) {
    const newQty = editing[productId];
    if (newQty === undefined) return;
    setSaving(productId);
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: newQty })
      .eq('id', productId);
    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock_quantity: newQty } : p))
      );
      setSaved(productId);
      setTimeout(() => setSaved(null), 2500);
      setEditing((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
    setSaving(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-white/30 text-center">
          <div className="w-8 h-8 border-2 border-[#C5A059]/40 border-t-[#C5A059] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Carregando estoque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#004433] rounded-2xl overflow-hidden border border-white/5">
      <div className="p-5 border-b border-white/10">
        <h3 className="text-white font-semibold text-base">Controle de Estoque</h3>
        <p className="text-white/40 text-xs mt-0.5">
          Clique na quantidade para editar · itens com ≤ 5 unidades aparecem em vermelho
        </p>
      </div>
      {products.length === 0 ? (
        <div className="p-16 text-center">
          <p className="text-white/20 text-5xl mb-4">📦</p>
          <p className="text-white/40 font-medium">Nenhum produto cadastrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                  Produto
                </th>
                <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest hidden sm:table-cell">
                  Categoria
                </th>
                <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest hidden md:table-cell">
                  Preço
                </th>
                <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest hidden md:table-cell">
                  Unidade
                </th>
                <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                  Estoque
                </th>
                <th className="py-3.5 px-4 w-20" />
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => {
                const isEditing = product.id in editing;
                const currentQty = isEditing ? editing[product.id] : product.stock_quantity;
                const isLow = product.stock_quantity <= 5;
                return (
                  <tr
                    key={product.id}
                    className={`border-b border-white/5 transition-colors ${
                      idx % 2 !== 0 ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span className="text-white text-sm font-medium">{product.name}</span>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className="text-white/60 text-sm">
                        {CATEGORY_LABELS[product.category]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="text-white/80 text-sm">{formatCents(product.price)}</span>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="text-white/60 text-sm">{product.unit}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={currentQty}
                          onChange={(e) => handleQtyChange(product.id, e.target.value)}
                          className={`w-20 bg-[#003322] border rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:ring-1 focus:ring-[#C5A059]/40 transition-colors ${
                            isLow && !isEditing
                              ? 'border-red-500/40 text-red-300'
                              : 'border-white/10'
                          }`}
                        />
                        {isLow && !isEditing && (
                          <span className="text-red-400 text-xs font-semibold">Baixo</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {saved === product.id ? (
                        <span className="text-green-400 text-xs font-semibold">Salvo ✓</span>
                      ) : isEditing ? (
                        <button
                          onClick={() => saveStock(product.id)}
                          disabled={saving === product.id}
                          className="bg-[#C5A059] hover:bg-[#b8943e] disabled:opacity-60 text-[#003322] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {saving === product.id ? '...' : 'Salvar'}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Equipe ──────────────────────────────────────────────────────────────

function TabEquipe() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'production' | 'delivery'>('production');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState('');

  async function loadProfiles() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'customer')
      .order('created_at', { ascending: false });
    setProfiles(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleRole(profile: Profile) {
    if (profile.role === 'admin') return;
    const newRole: Profile['role'] =
      profile.role === 'production' ? 'delivery' : 'production';
    setUpdatingId(profile.id);
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', profile.id);
    if (!error) {
      setProfiles((prev) =>
        prev.map((p) => (p.id === profile.id ? { ...p, role: newRole } : p))
      );
    }
    setUpdatingId(null);
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteError('');
    const trimmedEmail = inviteEmail.trim();
    if (!trimmedEmail) return;

    const exists = profiles.some((p) => p.email === trimmedEmail);
    if (exists) {
      setInviteError('Este e-mail já está cadastrado na equipe.');
      return;
    }

    setInviting(true);
    const { error } = await supabase.from('profiles').insert({
      firebase_uid: 'pending',
      email: trimmedEmail,
      name: trimmedEmail.split('@')[0],
      phone: '',
      role: inviteRole,
    });

    if (error) {
      setInviteError('Erro ao adicionar funcionário. Tente novamente.');
    } else {
      setInviteSuccess(true);
      setInviteEmail('');
      setTimeout(() => setInviteSuccess(false), 3000);
      await loadProfiles();
    }
    setInviting(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-white/30 text-center">
          <div className="w-8 h-8 border-2 border-[#C5A059]/40 border-t-[#C5A059] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Carregando equipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team table */}
      <div className="bg-[#004433] rounded-2xl overflow-hidden border border-white/5">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-white font-semibold text-base">Membros da Equipe</h3>
          <p className="text-white/40 text-xs mt-0.5">
            {profiles.length} funcionário(s) cadastrado(s)
          </p>
        </div>
        {profiles.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-white/20 text-5xl mb-4">👥</p>
            <p className="text-white/40 font-medium">Nenhum funcionário cadastrado</p>
            <p className="text-white/25 text-sm mt-1">Use o formulário abaixo para convidar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Nome
                  </th>
                  <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    E-mail
                  </th>
                  <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest hidden md:table-cell">
                    Telefone
                  </th>
                  <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Função
                  </th>
                  <th className="text-left py-3.5 px-4 text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile, idx) => (
                  <tr
                    key={profile.id}
                    className={`border-b border-white/5 ${
                      idx % 2 !== 0 ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="text-white text-sm font-medium">{profile.name || '—'}</span>
                        {profile.firebase_uid === 'pending' && (
                          <span className="ml-2 text-yellow-400/80 text-xs font-medium">
                            pendente
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white/70 text-sm">{profile.email}</span>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="text-white/60 text-sm">{profile.phone || '—'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <RoleBadge role={profile.role} />
                    </td>
                    <td className="py-3.5 px-4">
                      {profile.role !== 'admin' && (
                        <button
                          onClick={() => toggleRole(profile)}
                          disabled={updatingId === profile.id}
                          className="text-xs text-white/40 hover:text-[#C5A059] disabled:opacity-40 underline underline-offset-2 transition-colors"
                        >
                          {updatingId === profile.id
                            ? 'Salvando...'
                            : profile.role === 'production'
                            ? '→ Entrega'
                            : '→ Produção'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite section */}
      <div className="bg-[#004433] rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-semibold text-base mb-1">Convidar Funcionário</h3>
        <p className="text-white/40 text-xs mb-5">
          Adicione um novo membro à equipe por e-mail. Eles poderão acessar o sistema após fazer
          login com esse e-mail.
        </p>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="funcionario@email.com"
            required
            className="flex-1 bg-[#003322] border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/40"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as 'production' | 'delivery')}
            className="bg-[#003322] border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059]/40"
          >
            <option value="production">Produção</option>
            <option value="delivery">Entrega</option>
          </select>
          <button
            type="submit"
            disabled={inviting}
            className="bg-[#C5A059] hover:bg-[#b8943e] disabled:opacity-60 text-[#003322] font-bold text-sm px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            {inviting ? 'Adicionando...' : 'Convidar'}
          </button>
        </form>
        {inviteSuccess && (
          <p className="text-green-400 text-sm mt-3 font-medium">
            Funcionário adicionado com sucesso!
          </p>
        )}
        {inviteError && (
          <p className="text-red-400 text-sm mt-3 font-medium">{inviteError}</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('pedidos');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace('/login');
        return;
      }

      // Admin email always gets full access
      if (isAdminEmail(firebaseUser.email)) {
        setUser(firebaseUser);
        setAuthChecked(true);
        return;
      }

      // Otherwise check role in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('firebase_uid', firebaseUser.uid)
        .maybeSingle();

      const hasAccess =
        profile?.role === 'admin' || profile?.role === 'production' || profile?.role === 'delivery';

      if (!hasAccess) {
        router.replace('/login');
        return;
      }

      setUser(firebaseUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [router]);

  // ── Load orders ───────────────────────────────────────────────────────────
  const loadOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data ?? []);
    setOrdersLoading(false);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    loadOrders();
  }, [authChecked, loadOrders]);

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!authChecked) return;

    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new as Order, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === (payload.new as Order).id ? (payload.new as Order) : o
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) =>
              prev.filter((o) => o.id !== (payload.old as Partial<Order>).id)
            );
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [authChecked]);

  // ── Status update ─────────────────────────────────────────────────────────
  const handleStatusChange = useCallback(async (orderId: string, status: OrderStatus) => {
    const updates: Partial<Order> = { status };
    if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
    await supabase.from('orders').update(updates).eq('id', orderId);
  }, []);

  // ── Sign out ──────────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const isAdmin = isAdminEmail(user?.email);

  const tabs: { key: Tab; label: string; adminOnly: boolean }[] = [
    { key: 'pedidos', label: 'Pedidos', adminOnly: false },
    { key: 'financeiro', label: 'Financeiro', adminOnly: false },
    { key: 'estoque', label: 'Estoque', adminOnly: true },
    { key: 'equipe', label: 'Equipe', adminOnly: true },
  ];

  const visibleTabs = tabs.filter((t) => !t.adminOnly || isAdmin);

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#003322] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/30 text-sm tracking-wide">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003322]">
      {/* ── Header ── */}
      <header className="bg-[#002218] border-b border-white/8 sticky top-0 z-30 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          {/* Left: logo + realtime dot */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-white font-serif text-xl font-bold leading-none">
                Petisco <span className="text-[#C5A059]">Brazil</span>
              </h1>
              <p className="text-white/25 text-[10px] mt-0.5 tracking-[3px] uppercase">
                Dashboard
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-medium hidden sm:inline">Ao vivo</span>
            </div>
          </div>

          {/* Right: user info + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-white/60 text-xs truncate max-w-[180px]">{user?.email}</p>
              {isAdmin && (
                <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest">
                  Administradora
                </p>
              )}
            </div>
            {isAdmin && (
              <span className="bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/20 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider hidden sm:inline-flex">
                Admin
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="bg-white/8 hover:bg-white/15 text-white/60 hover:text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors border border-white/5"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab nav */}
        <nav className="flex gap-1 mb-8 bg-[#002218] rounded-2xl p-1.5 w-fit border border-white/5">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                activeTab === tab.key
                  ? 'bg-[#C5A059] text-[#003322] shadow-lg shadow-[#C5A059]/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        {(activeTab === 'pedidos' || activeTab === 'financeiro') && ordersLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#C5A059]/40 border-t-[#C5A059] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-white/30 text-sm">Carregando dados...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'pedidos' && (
              <TabPedidos
                orders={orders}
                isAdmin={isAdmin}
                onStatusChange={handleStatusChange}
              />
            )}
            {activeTab === 'financeiro' && <TabFinanceiro orders={orders} />}
            {activeTab === 'estoque' && isAdmin && <TabEstoque />}
            {activeTab === 'equipe' && isAdmin && <TabEquipe />}
          </>
        )}
      </main>
    </div>
  );
}
