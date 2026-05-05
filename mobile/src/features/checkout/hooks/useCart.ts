import { useCartStore } from '@/shared/store/cartStore';
import { getAvailableDeliveryDates, TIME_SLOTS, formatDate } from '@/features/schedule/utils/dateValidation';
import { useState } from 'react';

export function useCart() {
  const store = useCartStore();
  const availableDates = getAvailableDeliveryDates();
  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates.length > 0 ? formatDate(availableDates[0]) : '',
  );
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[0].value);

  return {
    items: store.items,
    totalPrice: store.totalPrice(),
    totalItems: store.totalItems(),
    selectedDate,
    selectedTime,
    availableDates,
    timeSlots: TIME_SLOTS,
    setSelectedDate,
    setSelectedTime,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
  };
}
