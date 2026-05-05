// Delivery: Wed(3), Thu(4), Fri(5), Sat(6), Sun(0)
// Order deadline: until Wednesday (inclusive)

export const DELIVERY_DAYS = [0, 3, 4, 5, 6] as const;
export const ORDER_DEADLINE_DAY = 3; // Wednesday

export const TIME_SLOTS = [
  { label: '12:00 - 14:00', value: '12:00' },
  { label: '14:00 - 16:00', value: '14:00' },
  { label: '16:00 - 18:00', value: '16:00' },
  { label: '18:00 - 20:00', value: '18:00' },
];

export function isDeliveryDay(date: Date): boolean {
  return (DELIVERY_DAYS as readonly number[]).includes(date.getDay());
}

export function canPlaceOrder(now: Date = new Date()): boolean {
  const day = now.getDay();
  // Mon(1), Tue(2), Wed(3) are valid → day <= 3 and day >= 1
  // Sun(0) is NOT valid for placing orders
  return day >= 1 && day <= ORDER_DEADLINE_DAY;
}

export function getAvailableDeliveryDates(from: Date = new Date()): Date[] {
  const dates: Date[] = [];
  const cursor = new Date(from);
  cursor.setDate(cursor.getDate() + 1);

  for (let i = 0; i < 14; i++) {
    if (isDeliveryDay(cursor)) {
      dates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  });
}
