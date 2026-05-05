-- Petisco Brazil — Supabase DDL
-- Run this in your Supabase SQL editor

-- Users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Products (combos only)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  type text not null check (type in ('salgado', 'doce', 'misto', 'pao_de_queijo')),
  quantity integer not null,  -- minimum order quantity
  price integer not null,     -- EUR cents
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'preparing', 'delivered')),
  scheduled_date date not null,
  scheduled_time time not null,
  total_price integer not null,  -- EUR cents
  notes text,
  created_at timestamptz not null default now()
);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null,
  unit_price integer not null  -- price at time of order
);

-- Indexes
create index if not exists idx_orders_scheduled_date on public.orders(scheduled_date);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- RLS (Row Level Security)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.products enable row level security;

-- Policies: users see their own orders
create policy "Users see own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Admins see all orders (via service role in production)
create policy "Products are publicly readable"
  on public.products for select
  using (active = true);
