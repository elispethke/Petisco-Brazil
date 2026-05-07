export type ProductCategory = 'salgado' | 'combo' | 'doce' | 'bolo';
export type PricingType = 'salgado' | 'doce' | 'combo' | 'bolo';

export interface LocalizedString {
  pt: string;
  en: string;
  de: string;
}

export interface PricingTier {
  qty: number;
  price: number; // EUR cents (total, not per unit)
  bestValue?: boolean;
}

export interface CatalogProduct {
  id: string;
  category: ProductCategory;
  pricingType: PricingType;
  image: number; // ReturnType of require()
  name: LocalizedString;
  description: LocalizedString;
}

export interface CartItem {
  product: CatalogProduct;
  qty: number;        // selected quantity from pricing tier
  totalPrice: number; // EUR cents from pricing table
}

export type OrderStatus = 'pending' | 'accepted' | 'delivering' | 'delivered';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  scheduledDate: string;
  scheduledTime: string;
  totalPrice: number;
  createdAt: string;
}

// Serializable item stored inside a Firestore order document
export interface OrderItem {
  id:       string;
  name:     string; // PT canonical name
  quantity: number;
  price:    number; // EUR cents (total for this line item)
}

export interface DeliveryAddress {
  street:  string;
  number:  string;
  city:    string;
  zipCode: string;
  country: string;
  lat:     number;
  lng:     number;
}

// Firestore document shape for the `orders` collection
export interface FirestoreOrder {
  id:                string;
  userId:            string;
  items:             OrderItem[];
  total:             number; // EUR cents
  status:            OrderStatus;
  deliveryDate?:     string;
  deliveryTime?:     string;
  assignedDriverId?: string;
  address?:          DeliveryAddress;
  createdAt:         unknown; // Firestore serverTimestamp
  deliveredAt?:      unknown; // serverTimestamp set on delivery completion
  deliveredBy?:      string;  // driver uid
  proofImageUrl?:    string;  // Firebase Storage URL
  // Location foundation — populated by future live-tracking feature
  driverLat?:           number;
  driverLng?:           number;
  locationUpdatedAt?:   unknown;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}

export type Language = 'pt' | 'en' | 'de';

export interface TimeSlot {
  label: string;
  value: string;
}
