import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ received: true, mode: 'mock' });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' as any });
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const db = createServiceClient();

      const { data: order } = await db
        .from('orders')
        .select('id, customer_name, customer_phone, total')
        .eq('stripe_session_id', session.id)
        .single();

      if (order) {
        await db.from('orders').update({ status: 'paid' }).eq('id', order.id);

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            total: order.total,
          }),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[stripe-webhook]', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
