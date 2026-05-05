import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json();
    if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 });

    const db = createServiceClient();

    const { data: items, error } = await db
      .from('order_items')
      .select('*, products(name, price)')
      .eq('order_id', order_id);

    if (error || !items?.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const total = items.reduce((sum, i) => sum + i.quantity * (i.unit_price ?? i.products?.price ?? 0), 0);

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      await db.from('orders').update({ status: 'pending_payment' }).eq('id', order_id);
      return NextResponse.json({ url: `/mock-checkout-success?order_id=${order_id}` });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' as any });

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        unit_amount: Math.round((item.unit_price ?? item.products?.price ?? 0) * 100),
        product_data: { name: item.products?.name ?? 'Produto' },
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'paypal'],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?order_id=${order_id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel?order_id=${order_id}`,
      metadata: { order_id },
    });

    await db.from('orders').update({ stripe_session_id: session.id }).eq('id', order_id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
