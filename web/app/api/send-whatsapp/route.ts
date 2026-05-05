import { NextRequest, NextResponse } from 'next/server';

function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export async function POST(req: NextRequest) {
  const { customer_name, customer_phone, total } = await req.json();

  const message = `Pedido confirmado ✅\nNome: ${customer_name}\nTotal: €${(total / 100).toFixed(2)}\nEstamos preparando seu pedido 🇧🇷`;

  const apiKey = process.env.WHATSAPP_API_KEY;

  if (!apiKey) {
    console.log('[send-whatsapp] MOCK MODE —', message);
    return NextResponse.json({ sent: false, mode: 'mock' });
  }

  const phone = sanitizePhone(customer_phone);

  const res = await fetch('https://api.twilio.com/2010-04-01/Accounts/send-message', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to: `whatsapp:+${phone}`, body: message }),
  });

  return NextResponse.json({ sent: res.ok });
}
