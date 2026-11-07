export type FoodCategory = 
  | 'Breakfast'
  | 'Lunch'
  | 'Snacks'
  | 'Fast Food'
  | 'Beverages'
  | 'Desserts'
  | 'Combos';

export interface CustomizationOptions {
  spiceLevel: 'Mild' | 'Medium' | 'Spicy' | 'Extra Fiery';
  extraCheese: boolean;
  extraToppings: string[];
  removedIngredients: string[];
  specialInstructions: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  originalPrice?: number;
  isVeg: boolean;
  isAvailable: boolean;
  rating: number;
  ratingCount: number;
  prepTimeMinutes: number;
  description: string;
  image: string;
  isSpecial?: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
  availableToppings?: { name: string; price: number }[];
  removableIngredients?: string[];
  calories?: number;
}

export interface CartItem {
  cartItemId: string; // unique for item + customization combination
  menuItem: MenuItem;
  quantity: number;
  customization: CustomizationOptions;
  unitPriceWithCustomizations: number;
  totalPrice: number;
}

export interface HostelAddress {
  id: string;
  label: string; // e.g. "My Room", "Study Room"
  hostelName: string;
  buildingName: string;
  block: string;
  floorNumber: string;
  roomNumber: string;
  studentPhoneNumber: string;
  deliveryInstructions: string;
  isDefault?: boolean;
}

export type OrderType = 'pickup' | 'delivery';

export type OrderStatus = 
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready' // Ready for Pickup OR Out for Delivery
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  customization: CustomizationOptions;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "CB-8492"
  createdAt: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  itemTotal: number;
  deliveryFee: number;
  discount: number;
  promoCodeApplied?: string;
  finalAmount: number;
  studentName: string;
  studentPhone: string;
  studentId: string;
  // Delivery specific
  hostelAddress?: HostelAddress;
  deliverySlot?: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  deliveryPin?: string;
  // Pickup specific
  pickupSlot?: string;
  pickupCounter?: string;
  pickupQrCode?: string;
  // Timestamps
  estimatedTime: string;
  acceptedAt?: string;
  preparedAt?: string;
  deliveredAt?: string;
  paymentMethod: 'UPI' | 'Wallet' | 'Cash';
  paymentStatus: 'Paid' | 'Pending';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'kitchen' | 'delivery';
  studentIdNumber?: string;
  phoneNumber?: string;
  walletBalance: number;
  department?: string;
}

export interface DeliverySlot {
  id: string;
  timeWindow: string; // e.g. "12:30 PM - 01:00 PM"
  type: 'Lunch' | 'Snacks' | 'Dinner' | 'Night Canteen' | 'Breakfast';
  maxCapacity: number;
  bookedCount: number;
  isActive: boolean;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  activeOrdersCount: number;
  rating: number;
  status: 'Available' | 'On Delivery' | 'Off Duty';
}
