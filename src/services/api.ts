import { MenuItem, HostelAddress, Order, OrderStatus, DeliverySlot, DeliveryPartner, UserProfile } from '../types';

const API_BASE = '/api';

export const api = {
  // Health
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Auth
  auth: {
    login: async (identifier: string) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
      return res.json();
    },
    register: async (data: Partial<UserProfile>) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Registration failed');
      return res.json();
    },
    getMe: async (userId?: string) => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: userId ? { 'x-user-id': userId } : {}
      });
      return res.json();
    },
    topupWallet: async (userId: string, amount: number) => {
      const res = await fetch(`${API_BASE}/auth/wallet/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Topup failed');
      return res.json();
    }
  },

  // Menu
  menu: {
    getAll: async (params?: { category?: string; search?: string; vegOnly?: boolean }): Promise<MenuItem[]> => {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.vegOnly) query.set('vegOnly', 'true');
      const res = await fetch(`${API_BASE}/menu?${query.toString()}`);
      const data = await res.json();
      return data.items || [];
    },
    create: async (item: Omit<MenuItem, 'id'>) => {
      const res = await fetch(`${API_BASE}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      return res.json();
    },
    update: async (id: string, updates: Partial<MenuItem>) => {
      const res = await fetch(`${API_BASE}/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return res.json();
    },
    toggleAvailability: async (id: string, isAvailable?: boolean) => {
      const res = await fetch(`${API_BASE}/menu/${id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable })
      });
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE}/menu/${id}`, { method: 'DELETE' });
      return res.json();
    }
  },

  // Addresses
  addresses: {
    getAll: async (): Promise<HostelAddress[]> => {
      const res = await fetch(`${API_BASE}/addresses`);
      const data = await res.json();
      return data.addresses || [];
    },
    create: async (address: Omit<HostelAddress, 'id'>) => {
      const res = await fetch(`${API_BASE}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address)
      });
      return res.json();
    },
    update: async (id: string, updates: Partial<HostelAddress>) => {
      const res = await fetch(`${API_BASE}/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return res.json();
    },
    setDefault: async (id: string) => {
      const res = await fetch(`${API_BASE}/addresses/${id}/default`, {
        method: 'PATCH'
      });
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE}/addresses/${id}`, { method: 'DELETE' });
      return res.json();
    }
  },

  // Delivery Slots
  slots: {
    getAll: async (): Promise<DeliverySlot[]> => {
      const res = await fetch(`${API_BASE}/delivery-slots`);
      const data = await res.json();
      return data.slots || [];
    },
    toggle: async (id: string, isActive: boolean) => {
      const res = await fetch(`${API_BASE}/delivery-slots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });
      return res.json();
    }
  },

  // Checkout & Pricing
  checkout: {
    calculate: async (payload: { items: any[]; orderType: string; promoCode?: string }) => {
      const res = await fetch(`${API_BASE}/checkout/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return res.json();
    }
  },

  // Razorpay Payments
  payments: {
    createRazorpayOrder: async (amount: number, receipt?: string) => {
      const res = await fetch(`${API_BASE}/payments/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, receipt })
      });
      if (!res.ok) throw new Error('Failed to create Razorpay payment order');
      return res.json();
    },
    verifyRazorpayPayment: async (verificationData: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      const res = await fetch(`${API_BASE}/payments/razorpay/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationData)
      });
      return res.json();
    }
  },

  // Orders
  orders: {
    getAll: async (params?: { status?: string; studentId?: string }): Promise<Order[]> => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.studentId) query.set('studentId', params.studentId);
      const res = await fetch(`${API_BASE}/orders?${query.toString()}`);
      const data = await res.json();
      return data.orders || [];
    },
    create: async (orderPayload: any): Promise<{ message: string; order: Order }> => {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to place order');
      }
      return res.json();
    },
    updateStatus: async (orderId: string, status: OrderStatus): Promise<{ message: string; order: Order }> => {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.json();
    },
    assignPartner: async (orderId: string, partnerId: string): Promise<{ message: string; order: Order }> => {
      const res = await fetch(`${API_BASE}/orders/${orderId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId })
      });
      return res.json();
    },
    cancel: async (orderId: string): Promise<{ message: string; order: Order }> => {
      const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
        method: 'POST'
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to cancel order');
      }
      return res.json();
    }
  },

  // Analytics
  analytics: {
    getReports: async () => {
      const res = await fetch(`${API_BASE}/analytics`);
      return res.json();
    }
  }
};
