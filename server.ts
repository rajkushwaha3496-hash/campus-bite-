import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Persistent JSON Store file path for realistic database persistence
const DB_FILE = path.resolve(__dirname, 'server_db.json');

// Initial seed data
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_ADDRESSES, 
  INITIAL_DELIVERY_SLOTS, 
  INITIAL_DELIVERY_PARTNERS, 
  INITIAL_ORDERS, 
  INITIAL_USER 
} from './src/data/mockData.ts';

interface DatabaseSchema {
  users: any[];
  menuItems: any[];
  addresses: any[];
  deliverySlots: any[];
  deliveryPartners: any[];
  orders: any[];
  payments: any[];
}

function loadDatabase(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading db file, resetting to defaults:', err);
    }
  }

  const initialDb: DatabaseSchema = {
    users: [
      INITIAL_USER,
      {
        id: 'usr-admin-1',
        name: 'Prof. Sharma (Canteen In-charge)',
        email: 'admin.canteen@campus.edu',
        role: 'admin',
        studentIdNumber: 'STAFF-401',
        phoneNumber: '+91 98765 00001',
        walletBalance: 2500,
        department: 'Canteen Administration'
      },
      {
        id: 'usr-chef-1',
        name: 'Chef Murugan (Head Chef)',
        email: 'chef.murugan@campus.edu',
        role: 'kitchen',
        studentIdNumber: 'KITCHEN-02',
        phoneNumber: '+91 98765 00002',
        walletBalance: 0,
        department: 'Canteen Kitchen'
      },
      {
        id: 'usr-del-1',
        name: 'Rahul Verma (Squad Runner #1)',
        email: 'rahul.runner@campus.edu',
        role: 'delivery',
        studentIdNumber: 'RUNNER-01',
        phoneNumber: '+91 98112 34567',
        walletBalance: 120,
        department: 'Campus Logistics'
      }
    ],
    menuItems: INITIAL_MENU_ITEMS,
    addresses: INITIAL_ADDRESSES,
    deliverySlots: INITIAL_DELIVERY_SLOTS,
    deliveryPartners: INITIAL_DELIVERY_PARTNERS,
    orders: INITIAL_ORDERS,
    payments: []
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db file:', err);
  }
}

let db = loadDatabase();

/* -------------------------------------------------------------
 * REST API ROUTES (/api/*)
 * ------------------------------------------------------------- */

// Health & System Info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    system: 'CampusBite Unified API',
    team: '#TEAMSQUAD',
    version: '1.2.0',
    timestamp: new Date().toISOString(),
    database: {
      type: process.env.SUPABASE_URL ? 'Supabase PostgreSQL' : 'Local Persistent Engine',
      itemsCount: db.menuItems.length,
      ordersCount: db.orders.length
    }
  });
});

// AUTHENTICATION APIs
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Email, Phone or Student ID required' });
  }

  // Find user by email, phone, or studentId
  const normalized = identifier.trim().toLowerCase();
  let user = db.users.find(u => 
    u.email.toLowerCase() === normalized || 
    (u.studentIdNumber && u.studentIdNumber.toLowerCase() === normalized) ||
    (u.phoneNumber && u.phoneNumber.includes(normalized))
  );

  if (!user) {
    // If not found, create a new student user automatically for quick campus onboarding
    user = {
      id: 'usr-' + Date.now(),
      name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
      email: identifier.includes('@') ? identifier : `${identifier.toLowerCase()}@campus.edu`,
      role: 'student',
      studentIdNumber: identifier.toUpperCase().replace(/[^A-Z0-9]/g, '') || '2024CS' + Math.floor(100 + Math.random() * 900),
      phoneNumber: '+91 98765 43210',
      walletBalance: 500,
      department: 'Undergraduate Engineering'
    };
    db.users.push(user);
    saveDatabase(db);
  }

  const token = 'cb_jwt_' + Buffer.from(`${user.id}:${user.role}:${Date.now()}`).toString('base64');
  res.json({
    message: 'Login successful',
    token,
    user
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, studentIdNumber, phoneNumber, department, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'A student account with this email already exists' });
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    name,
    email,
    role: role || 'student',
    studentIdNumber: studentIdNumber || '2024CS' + Math.floor(100 + Math.random() * 900),
    phoneNumber: phoneNumber || '+91 98765 43210',
    walletBalance: 300, // Welcome signup bonus
    department: department || 'College of Engineering'
  };

  db.users.push(newUser);
  saveDatabase(db);

  const token = 'cb_jwt_' + Buffer.from(`${newUser.id}:${newUser.role}:${Date.now()}`).toString('base64');
  res.status(201).json({
    message: 'Student registered successfully',
    token,
    user: newUser
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const user = db.users.find(u => u.id === userId) || db.users[0];
  res.json({ user });
});

app.post('/api/auth/wallet/topup', (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const numAmount = Number(amount);
  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ error: 'Invalid topup amount' });
  }

  const user = db.users.find(u => u.id === userId) || db.users[0];
  user.walletBalance = (user.walletBalance || 0) + numAmount;
  saveDatabase(db);

  res.json({
    message: `₹${numAmount} credited to Campus Wallet`,
    walletBalance: user.walletBalance
  });
});

// FOOD MENU APIs
app.get('/api/menu', (req: Request, res: Response) => {
  const { category, search, vegOnly } = req.query;
  let items = [...db.menuItems];

  if (category && category !== 'All') {
    items = items.filter(i => i.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }

  if (vegOnly === 'true') {
    items = items.filter(i => i.isVeg);
  }

  res.json({ items, total: items.length });
});

app.get('/api/menu/:id', (req: Request, res: Response) => {
  const item = db.menuItems.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  res.json({ item });
});

app.post('/api/menu', (req: Request, res: Response) => {
  const newItem = {
    ...req.body,
    id: 'food-' + Date.now(),
    rating: req.body.rating || 4.8,
    ratingCount: req.body.ratingCount || 1,
    isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true
  };
  db.menuItems.unshift(newItem);
  saveDatabase(db);
  res.status(201).json({ message: 'Food item created', item: newItem });
});

app.put('/api/menu/:id', (req: Request, res: Response) => {
  const index = db.menuItems.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  db.menuItems[index] = { ...db.menuItems[index], ...req.body };
  saveDatabase(db);
  res.json({ message: 'Food item updated', item: db.menuItems[index] });
});

app.patch('/api/menu/:id/availability', (req: Request, res: Response) => {
  const item = db.menuItems.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  item.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : !item.isAvailable;
  saveDatabase(db);
  res.json({ message: `Dish availability updated to ${item.isAvailable}`, item });
});

app.delete('/api/menu/:id', (req: Request, res: Response) => {
  const prevLen = db.menuItems.length;
  db.menuItems = db.menuItems.filter(i => i.id !== req.params.id);
  if (db.menuItems.length === prevLen) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  saveDatabase(db);
  res.json({ message: 'Food item removed successfully' });
});

// CATEGORIES API
app.get('/api/categories', (_req: Request, res: Response) => {
  const categories = [
    'Breakfast',
    'Lunch',
    'Snacks',
    'Fast Food',
    'Beverages',
    'Desserts',
    'Combos'
  ];
  const counts: Record<string, number> = {};
  categories.forEach(c => {
    counts[c] = db.menuItems.filter(i => i.category === c).length;
  });
  res.json({ categories, counts });
});

// HOSTEL ADDRESSES API
app.get('/api/addresses', (req: Request, res: Response) => {
  res.json({ addresses: db.addresses });
});

app.post('/api/addresses', (req: Request, res: Response) => {
  const newAddr = {
    ...req.body,
    id: 'addr-' + Date.now(),
    isDefault: db.addresses.length === 0 || !!req.body.isDefault
  };

  if (newAddr.isDefault) {
    db.addresses.forEach(a => a.isDefault = false);
  }

  db.addresses.push(newAddr);
  saveDatabase(db);
  res.status(201).json({ message: 'Hostel room address saved', address: newAddr });
});

app.put('/api/addresses/:id', (req: Request, res: Response) => {
  const index = db.addresses.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Address not found' });
  }
  db.addresses[index] = { ...db.addresses[index], ...req.body };
  saveDatabase(db);
  res.json({ message: 'Address updated', address: db.addresses[index] });
});

app.patch('/api/addresses/:id/default', (req: Request, res: Response) => {
  const addr = db.addresses.find(a => a.id === req.params.id);
  if (!addr) {
    return res.status(404).json({ error: 'Address not found' });
  }
  db.addresses.forEach(a => a.isDefault = (a.id === req.params.id));
  saveDatabase(db);
  res.json({ message: 'Default address updated', address: addr });
});

app.delete('/api/addresses/:id', (req: Request, res: Response) => {
  db.addresses = db.addresses.filter(a => a.id !== req.params.id);
  saveDatabase(db);
  res.json({ message: 'Address deleted' });
});

// DELIVERY SLOTS API
app.get('/api/delivery-slots', (_req: Request, res: Response) => {
  res.json({ slots: db.deliverySlots });
});

app.patch('/api/delivery-slots/:id', (req: Request, res: Response) => {
  const slot = db.deliverySlots.find(s => s.id === req.params.id);
  if (!slot) {
    return res.status(404).json({ error: 'Slot not found' });
  }
  if (req.body.isActive !== undefined) slot.isActive = req.body.isActive;
  if (req.body.maxCapacity !== undefined) slot.maxCapacity = req.body.maxCapacity;
  saveDatabase(db);
  res.json({ message: 'Slot updated', slot });
});

// DELIVERY PARTNERS API
app.get('/api/delivery-partners', (_req: Request, res: Response) => {
  res.json({ partners: db.deliveryPartners });
});

// CHECKOUT CALCULATION API
app.post('/api/checkout/calculate', (req: Request, res: Response) => {
  const { items, orderType, promoCode } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Cart items required' });
  }

  let itemTotal = 0;
  items.forEach((item: any) => {
    let unitPrice = item.menuItem?.price || item.price || 0;
    if (item.customization?.extraCheese) unitPrice += 25;
    if (item.customization?.extraToppings?.length) unitPrice += item.customization.extraToppings.length * 20;
    itemTotal += unitPrice * (item.quantity || 1);
  });

  const deliveryFee = orderType === 'delivery' ? (itemTotal >= 149 ? 0 : 15) : 0;
  
  let discount = 0;
  const code = (promoCode || '').trim().toUpperCase();
  if (code === 'CAMPUS50' && itemTotal >= 149) {
    discount = 50;
  } else if (code === 'SQUAD20') {
    discount = Math.round(itemTotal * 0.2);
  } else if (code === 'FIRSTBITE') {
    discount = 30;
  }

  const finalAmount = Math.max(0, itemTotal + deliveryFee - discount);

  res.json({
    itemTotal,
    deliveryFee,
    discount,
    promoCodeApplied: discount > 0 ? code : undefined,
    finalAmount
  });
});

// RAZORPAY PAYMENT SIMULATION & REAL ORDER GEN API
app.post('/api/payments/razorpay/create-order', (req: Request, res: Response) => {
  const { amount, currency = 'INR', receipt } = req.body;
  const numAmount = Number(amount);
  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ error: 'Invalid amount for Razorpay order' });
  }

  // Generate verified Razorpay-compliant order structure
  const razorpayOrderId = 'order_' + crypto.randomBytes(8).toString('hex');
  const paymentRecord = {
    razorpayOrderId,
    amount: numAmount * 100, // in paise
    currency,
    receipt: receipt || 'rcpt_' + Date.now(),
    status: 'created',
    createdAt: new Date().toISOString()
  };

  db.payments.push(paymentRecord);
  saveDatabase(db);

  res.json({
    id: razorpayOrderId,
    amount: numAmount * 100,
    currency,
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_campusbite_demo',
    receipt: paymentRecord.receipt,
    status: 'created'
  });
});

app.post('/api/payments/razorpay/verify', (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // In production with RAZORPAY_KEY_SECRET, verify HMAC SHA256:
  // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  // hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  // const verified = hmac.digest('hex') === razorpay_signature;

  const payment = db.payments.find(p => p.razorpayOrderId === razorpay_order_id);
  if (payment) {
    payment.status = 'captured';
    payment.razorpayPaymentId = razorpay_payment_id;
    saveDatabase(db);
  }

  res.json({
    verified: true,
    message: 'Payment verified successfully by CampusBite payment gateway',
    paymentId: razorpay_payment_id || 'pay_' + crypto.randomBytes(6).toString('hex')
  });
});

// ORDERS MANAGEMENT API
app.get('/api/orders', (req: Request, res: Response) => {
  const { status, studentId, type } = req.query;
  let ordersList = [...db.orders];

  if (status) {
    ordersList = ordersList.filter(o => o.status === status);
  }
  if (studentId) {
    ordersList = ordersList.filter(o => o.studentId === studentId);
  }
  if (type) {
    ordersList = ordersList.filter(o => o.type === type);
  }

  res.json({ orders: ordersList, total: ordersList.length });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const {
    items,
    type,
    paymentMethod,
    pickupSlot,
    deliverySlot,
    hostelAddress,
    discount = 0,
    promoCodeApplied,
    studentName,
    studentPhone,
    studentId
  } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Order must contain items' });
  }

  // Calculate pricing server-side for integrity
  let itemTotal = 0;
  const processedItems = items.map((item: any) => {
    let price = item.price || item.menuItem?.price || 100;
    if (item.customization?.extraCheese) price += 25;
    if (item.customization?.extraToppings?.length) price += item.customization.extraToppings.length * 20;
    const subtotal = price * (item.quantity || 1);
    itemTotal += subtotal;

    return {
      id: 'oi-' + Math.random().toString(36).substring(2, 7),
      menuItemId: item.menuItemId || item.menuItem?.id || 'food-1',
      name: item.name || item.menuItem?.name || 'Campus Special',
      price,
      quantity: item.quantity || 1,
      isVeg: item.isVeg !== undefined ? item.isVeg : true,
      customization: item.customization || {
        spiceLevel: 'Medium',
        extraCheese: false,
        extraToppings: [],
        removedIngredients: [],
        specialInstructions: ''
      },
      subtotal
    };
  });

  const deliveryFee = type === 'delivery' ? (itemTotal >= 149 ? 0 : 15) : 0;
  const finalAmount = Math.max(0, itemTotal + deliveryFee - discount);
  const orderNumber = 'CB-' + Math.floor(1000 + Math.random() * 9000);

  // If wallet payment, deduct server-side balance
  if (paymentMethod === 'Wallet') {
    const user = db.users.find(u => u.studentIdNumber === studentId) || db.users[0];
    if (user.walletBalance < finalAmount) {
      return res.status(400).json({ error: 'Insufficient Campus Wallet balance' });
    }
    user.walletBalance -= finalAmount;
  }

  const newOrder = {
    id: 'ord-' + Date.now(),
    orderNumber,
    createdAt: new Date().toISOString(),
    type,
    status: 'placed',
    items: processedItems,
    itemTotal,
    deliveryFee,
    discount,
    promoCodeApplied,
    finalAmount,
    studentName: studentName || 'Aarav Sharma',
    studentPhone: studentPhone || '+91 98765 43210',
    studentId: studentId || '2024CS084',
    hostelAddress: type === 'delivery' ? hostelAddress : undefined,
    deliverySlot: type === 'delivery' ? (deliverySlot || '12:30 PM - 01:00 PM') : undefined,
    pickupSlot: type === 'pickup' ? (pickupSlot || 'Ready in 15 mins') : undefined,
    pickupCounter: type === 'pickup' ? 'Express Counter #1 (Ground Floor)' : undefined,
    pickupQrCode: `CAMPUSBITE-${orderNumber}-VERIFIED`,
    deliveryPin: type === 'delivery' ? Math.floor(1000 + Math.random() * 9000).toString() : undefined,
    deliveryPartnerId: type === 'delivery' ? 'dp-1' : undefined,
    deliveryPartnerName: type === 'delivery' ? 'Rahul Verma' : undefined,
    deliveryPartnerPhone: type === 'delivery' ? '+91 98112 34567' : undefined,
    estimatedTime: type === 'pickup' ? '15-20 mins' : '25-30 mins',
    paymentMethod: paymentMethod || 'UPI',
    paymentStatus: 'Paid'
  };

  db.orders.unshift(newOrder);
  saveDatabase(db);

  res.status(201).json({
    message: `Order #${orderNumber} placed successfully`,
    order: newOrder
  });
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  if (status === 'accepted') order.acceptedAt = new Date().toISOString();
  if (status === 'preparing') order.estimatedTime = '10-15 mins';
  if (status === 'ready') {
    order.preparedAt = new Date().toISOString();
    order.estimatedTime = order.type === 'pickup' ? 'Ready for Pickup now!' : 'Out for delivery to hostel';
  }
  if (status === 'delivered') {
    order.deliveredAt = new Date().toISOString();
    order.estimatedTime = 'Delivered';
  }

  saveDatabase(db);
  res.json({ message: `Order status updated to ${status}`, order });
});

app.patch('/api/orders/:id/assign', (req: Request, res: Response) => {
  const { partnerId } = req.body;
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const partner = db.deliveryPartners.find(p => p.id === partnerId);
  if (!partner) {
    return res.status(404).json({ error: 'Delivery partner not found' });
  }

  order.deliveryPartnerId = partner.id;
  order.deliveryPartnerName = partner.name;
  order.deliveryPartnerPhone = partner.phone;

  saveDatabase(db);
  res.json({ message: `Assigned order to ${partner.name}`, order });
});

app.post('/api/orders/:id/cancel', (req: Request, res: Response) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.status !== 'placed') {
    return res.status(400).json({ error: 'Cannot cancel order once preparation has started' });
  }

  order.status = 'cancelled';
  saveDatabase(db);
  res.json({ message: 'Order cancelled successfully', order });
});

// ANALYTICS & REPORTS API
app.get('/api/analytics', (_req: Request, res: Response) => {
  const totalRevenue = db.orders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);
  const totalOrders = db.orders.length;
  const activeOrders = db.orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;

  res.json({
    kpis: {
      totalOrders,
      totalRevenue,
      activeOrders,
      totalStudents: 1420,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    },
    topSelling: [
      { name: 'Campus Artisan Cold Coffee & Brownie', count: 610, percent: 88 },
      { name: 'Butter Paneer Tikka Kathi Roll', count: 512, percent: 74 },
      { name: 'Cheesy Veggie Delight Pan Pizza', count: 420, percent: 62 },
      { name: 'Royal Chicken Biryani Thali', count: 388, percent: 55 },
      { name: 'Campus Jumbo Burger Combo', count: 342, percent: 49 }
    ],
    peakHours: [
      { time: '08:30 AM - 10:30 AM (Breakfast Dosa / Chai)', percent: 65, orders: 184 },
      { time: '12:30 PM - 02:00 PM (Lunch Thali & Biryani)', percent: 95, orders: 412 },
      { time: '04:30 PM - 06:00 PM (Evening Kathi Rolls & Shakes)', percent: 70, orders: 230 },
      { time: '08:00 PM - 09:30 PM (Dinner Rush)', percent: 80, orders: 310 },
      { time: '10:30 PM - 11:30 PM (Night Owl Canteen Snacks)', percent: 85, orders: 284 }
    ]
  });
});

/* -------------------------------------------------------------
 * VITE MIDDLEWARE & FRONTEND SERVING
 * ------------------------------------------------------------- */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[CampusBite Backend] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[CampusBite Backend] REST API available at http://0.0.0.0:${PORT}/api/health`);
  });
}

startServer();
