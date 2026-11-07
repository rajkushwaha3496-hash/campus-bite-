import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MenuItem, 
  CartItem, 
  HostelAddress, 
  Order, 
  OrderStatus, 
  DeliverySlot, 
  DeliveryPartner, 
  UserProfile, 
  CustomizationOptions 
} from '../types';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_ADDRESSES, 
  INITIAL_DELIVERY_SLOTS, 
  INITIAL_DELIVERY_PARTNERS, 
  INITIAL_ORDERS, 
  INITIAL_USER 
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface CampusBiteContextType {
  // Role & User
  role: 'student' | 'admin' | 'kitchen' | 'delivery';
  setRole: (role: 'student' | 'admin' | 'kitchen' | 'delivery') => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  topUpWallet: (amount: number) => void;
  
  // Navigation / View
  studentView: 'home' | 'menu' | 'addresses' | 'orders' | 'about' | 'track';
  setStudentView: (view: 'home' | 'menu' | 'addresses' | 'orders' | 'about' | 'track') => void;
  trackedOrderId: string | null;
  setTrackedOrderId: (orderId: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  customizingItem: MenuItem | null;
  setCustomizingItem: (item: MenuItem | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isPresentationOpen: boolean;
  setIsPresentationOpen: (open: boolean) => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  
  // Menu Management
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  toggleItemAvailability: (id: string) => void;
  deleteMenuItem: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, customization?: CustomizationOptions, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Hostel Addresses
  addresses: HostelAddress[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  addAddress: (address: Omit<HostelAddress, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<HostelAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    type: 'pickup' | 'delivery';
    paymentMethod: 'UPI' | 'Wallet' | 'Cash';
    pickupSlot?: string;
    deliverySlot?: string;
    hostelAddress?: HostelAddress;
    discount?: number;
    promoCodeApplied?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  assignDeliveryPartner: (orderId: string, partnerId: string) => void;
  cancelOrder: (orderId: string) => void;

  // Slots & Partners
  deliverySlots: DeliverySlot[];
  deliveryPartners: DeliveryPartner[];
  toggleDeliverySlot: (slotId: string) => void;

  // Toasts & Audio
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  playOrderChime: () => void;
}

const CampusBiteContext = createContext<CampusBiteContextType | undefined>(undefined);

export const CampusBiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent or initial state
  const [role, setRoleState] = useState<'student' | 'admin' | 'kitchen' | 'delivery'>(() => {
    return (localStorage.getItem('cb_role') as any) || 'student';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cb_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('cb_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [addresses, setAddresses] = useState<HostelAddress[]>(() => {
    const saved = localStorage.getItem('cb_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const defaultAddr = INITIAL_ADDRESSES.find(a => a.isDefault);
    return defaultAddr ? defaultAddr.id : INITIAL_ADDRESSES[0]?.id || '';
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cb_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>(() => {
    const saved = localStorage.getItem('cb_slots');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERY_SLOTS;
  });

  const [deliveryPartners] = useState<DeliveryPartner[]>(INITIAL_DELIVERY_PARTNERS);

  // UI state
  const [studentView, setStudentView] = useState<'home' | 'menu' | 'addresses' | 'orders' | 'about' | 'track'>('home');
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(orders[0]?.id || null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cb_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('cb_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cb_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('cb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cb_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('cb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cb_slots', JSON.stringify(deliverySlots));
  }, [deliverySlots]);

  // Audio chime synthesizer
  const playOrderChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.24);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev.slice(-4), { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setRole = (newRole: 'student' | 'admin' | 'kitchen' | 'delivery') => {
    setRoleState(newRole);
    setUser(prev => ({
      ...prev,
      role: newRole,
      name: newRole === 'admin' 
        ? 'Prof. Sharma (Canteen Admin)' 
        : newRole === 'kitchen' 
          ? 'Chef Murugan (Head Chef)' 
          : newRole === 'delivery' 
            ? 'Rahul Verma (Squad Runner #1)' 
            : 'Aarav Sharma'
    }));
    addToast(`Switched to ${newRole.toUpperCase()} Dashboard`, 'info');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    addToast('Profile updated', 'success');
  };

  const topUpWallet = (amount: number) => {
    setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + amount }));
    addToast(`₹${amount} added to Campus Wallet successfully!`, 'success');
  };

  // Cart calculations
  const defaultCustomization: CustomizationOptions = {
    spiceLevel: 'Medium',
    extraCheese: false,
    extraToppings: [],
    removedIngredients: [],
    specialInstructions: ''
  };

  const addToCart = (menuItem: MenuItem, customization = defaultCustomization, quantity = 1) => {
    let unitPrice = menuItem.price;
    if (customization.extraCheese) unitPrice += 25;
    if (customization.extraToppings && customization.extraToppings.length > 0) {
      unitPrice += customization.extraToppings.length * 20;
    }

    const customizationKey = `${menuItem.id}-${customization.spiceLevel}-${customization.extraCheese}-${customization.extraToppings.sort().join(',')}-${customization.removedIngredients.sort().join(',')}-${customization.specialInstructions.trim()}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === customizationKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId: customizationKey,
            menuItem,
            quantity,
            customization,
            unitPriceWithCustomizations: unitPrice,
            totalPrice: unitPrice * quantity
          }
        ];
      }
    });

    addToast(`Added "${menuItem.name}" to tray`, 'success');
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 
              ? { ...item, quantity: newQty, totalPrice: newQty * item.unitPriceWithCustomizations }
              : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Addresses
  const addAddress = (address: Omit<HostelAddress, 'id'>) => {
    const newId = 'addr-' + Date.now();
    const newAddr: HostelAddress = { ...address, id: newId };
    setAddresses(prev => [...prev, newAddr]);
    setSelectedAddressId(newId);
    addToast('Hostel room address saved', 'success');
  };

  const updateAddress = (id: string, updates: Partial<HostelAddress>) => {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    addToast('Hostel address updated', 'success');
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddressId === id) {
      const remaining = addresses.filter(a => a.id !== id);
      setSelectedAddressId(remaining[0]?.id || '');
    }
    addToast('Address deleted', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    setSelectedAddressId(id);
    addToast('Default delivery address updated', 'success');
  };

  // Orders
  const placeOrder = ({
    type,
    paymentMethod,
    pickupSlot,
    deliverySlot,
    hostelAddress,
    discount = 0,
    promoCodeApplied
  }: {
    type: 'pickup' | 'delivery';
    paymentMethod: 'UPI' | 'Wallet' | 'Cash';
    pickupSlot?: string;
    deliverySlot?: string;
    hostelAddress?: HostelAddress;
    discount?: number;
    promoCodeApplied?: string;
  }): Order => {
    const orderNum = 'CB-' + Math.floor(1000 + Math.random() * 9000);
    const deliveryFee = type === 'delivery' ? (cartSubtotal >= 149 ? 0 : 15) : 0;
    const finalAmount = Math.max(0, cartSubtotal + deliveryFee - discount);

    if (paymentMethod === 'Wallet') {
      if (user.walletBalance < finalAmount) {
        throw new Error('Insufficient wallet balance. Please top up or choose UPI.');
      }
      setUser(prev => ({ ...prev, walletBalance: prev.walletBalance - finalAmount }));
    }

    const orderItems = cart.map(item => ({
      id: 'oi-' + Math.random().toString(36).substring(2, 7),
      menuItemId: item.menuItem.id,
      name: item.menuItem.name,
      price: item.unitPriceWithCustomizations,
      quantity: item.quantity,
      isVeg: item.menuItem.isVeg,
      customization: item.customization,
      subtotal: item.totalPrice
    }));

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      type,
      status: 'placed',
      items: orderItems,
      itemTotal: cartSubtotal,
      deliveryFee,
      discount,
      promoCodeApplied,
      finalAmount,
      studentName: user.name,
      studentPhone: user.phoneNumber || '+91 98765 43210',
      studentId: user.studentIdNumber || '2024CS084',
      hostelAddress: type === 'delivery' ? hostelAddress : undefined,
      deliverySlot: type === 'delivery' ? deliverySlot : undefined,
      pickupSlot: type === 'pickup' ? pickupSlot : undefined,
      pickupCounter: type === 'pickup' ? 'Express Canteen Counter #1' : undefined,
      pickupQrCode: `CAMPUSBITE-${orderNum}-VERIFIED`,
      deliveryPin: type === 'delivery' ? Math.floor(1000 + Math.random() * 9000).toString() : undefined,
      deliveryPartnerId: type === 'delivery' ? 'dp-1' : undefined,
      deliveryPartnerName: type === 'delivery' ? 'Rahul Verma' : undefined,
      deliveryPartnerPhone: type === 'delivery' ? '+91 98112 34567' : undefined,
      estimatedTime: type === 'pickup' ? '15-20 mins' : '25-30 mins',
      paymentMethod,
      paymentStatus: 'Paid'
    };

    setOrders(prev => [newOrder, ...prev]);
    setTrackedOrderId(newOrder.id);
    clearCart();
    setIsCartOpen(false);
    playOrderChime();
    addToast(`Order ${orderNum} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updates: Partial<Order> = { status: newStatus };
        if (newStatus === 'accepted') updates.acceptedAt = new Date().toISOString();
        if (newStatus === 'preparing') updates.estimatedTime = '10-15 mins';
        if (newStatus === 'ready') {
          updates.preparedAt = new Date().toISOString();
          updates.estimatedTime = o.type === 'pickup' ? 'Ready for Pickup now!' : 'Out for delivery to hostel';
        }
        if (newStatus === 'delivered') {
          updates.deliveredAt = new Date().toISOString();
          updates.estimatedTime = 'Delivered';
        }
        return { ...o, ...updates };
      }
      return o;
    }));
    playOrderChime();
    addToast(`Order status updated to: ${newStatus.toUpperCase()}`, 'info');
  };

  const assignDeliveryPartner = (orderId: string, partnerId: string) => {
    const partner = deliveryPartners.find(p => p.id === partnerId);
    if (!partner) return;
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          deliveryPartnerId: partner.id,
          deliveryPartnerName: partner.name,
          deliveryPartnerPhone: partner.phone
        };
      }
      return o;
    }));
    addToast(`Assigned ${partner.name} to order`, 'success');
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'cancelled' };
      }
      return o;
    }));
    addToast('Order cancelled', 'warning');
  };

  // Menu Admin Operations
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: 'food-' + Date.now()
    };
    setMenuItems(prev => [newItem, ...prev]);
    addToast(`Added "${newItem.name}" to menu`, 'success');
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    addToast('Menu item updated', 'success');
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.isAvailable;
        addToast(`${item.name} marked as ${nextState ? 'In Stock' : 'Out of Stock'}`, 'info');
        return { ...item, isAvailable: nextState };
      }
      return item;
    }));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    addToast('Item removed from menu', 'warning');
  };

  const toggleDeliverySlot = (slotId: string) => {
    setDeliverySlots(prev => prev.map(s => s.id === slotId ? { ...s, isActive: !s.isActive } : s));
  };

  return (
    <CampusBiteContext.Provider
      value={{
        role,
        setRole,
        user,
        updateUser,
        topUpWallet,
        studentView,
        setStudentView,
        trackedOrderId,
        setTrackedOrderId,
        isCartOpen,
        setIsCartOpen,
        customizingItem,
        setCustomizingItem,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isPresentationOpen,
        setIsPresentationOpen,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        menuItems,
        addMenuItem,
        updateMenuItem,
        toggleItemAvailability,
        deleteMenuItem,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        placeOrder,
        updateOrderStatus,
        assignDeliveryPartner,
        cancelOrder,
        deliverySlots,
        deliveryPartners,
        toggleDeliverySlot,
        toasts,
        addToast,
        removeToast,
        playOrderChime
      }}
    >
      {children}
    </CampusBiteContext.Provider>
  );
};

export const useCampusBite = () => {
  const context = useContext(CampusBiteContext);
  if (!context) {
    throw new Error('useCampusBite must be used within a CampusBiteProvider');
  }
  return context;
};
