import React, { useState, useMemo } from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { MenuItem, FoodCategory, OrderStatus } from '../../types';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  Bike, 
  Filter, 
  BarChart3, 
  Calendar,
  AlertCircle,
  Eye,
  Sliders,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    toggleItemAvailability,
    orders, 
    updateOrderStatus,
    deliverySlots,
    toggleDeliverySlot,
    deliveryPartners,
    assignDeliveryPartner,
    addToast
  } = useCampusBite();

  // Active Admin Sub-Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'food' | 'orders' | 'slots' | 'analytics'>('overview');

  // Food Form Modal State
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Fast Food');
  const [price, setPrice] = useState<number>(120);
  const [originalPrice, setOriginalPrice] = useState<number>(140);
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(10);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/src/assets/images/hero_campus_combo_1793819593119.jpg');
  const [isSpecial, setIsSpecial] = useState(false);

  // Order filters
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedPartnerForOrder, setSelectedPartnerForOrder] = useState<Record<string, string>>({});

  // KPIs
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.finalAmount, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const totalStudents = 1420; // College student base
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Filtered orders
  const displayedOrders = useMemo(() => {
    if (orderFilter === 'active') {
      return orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
    }
    if (orderFilter === 'completed') {
      return orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');
    }
    return orders;
  }, [orders, orderFilter]);

  const handleOpenAddFood = () => {
    setEditingItem(null);
    setName('');
    setCategory('Fast Food');
    setPrice(120);
    setOriginalPrice(140);
    setIsVeg(true);
    setIsAvailable(true);
    setPrepTimeMinutes(10);
    setDescription('Delicious freshly prepared campus favorite made with quality ingredients.');
    setImage('/src/assets/images/food_cheese_pizza_1793819594606.jpg');
    setIsSpecial(false);
    setIsFoodModalOpen(true);
  };

  const handleOpenEditFood = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price);
    setOriginalPrice(item.originalPrice || item.price);
    setIsVeg(item.isVeg);
    setIsAvailable(item.isAvailable);
    setPrepTimeMinutes(item.prepTimeMinutes);
    setDescription(item.description);
    setImage(item.image);
    setIsSpecial(item.isSpecial || false);
    setIsFoodModalOpen(true);
  };

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name,
        category,
        price,
        originalPrice,
        isVeg,
        isAvailable,
        prepTimeMinutes,
        description,
        image,
        isSpecial
      });
    } else {
      addMenuItem({
        name,
        category,
        price,
        originalPrice,
        isVeg,
        isAvailable,
        rating: 4.8,
        ratingCount: 1,
        prepTimeMinutes,
        description,
        image,
        isSpecial,
        isPopular: false,
        isRecommended: true,
        availableToppings: [
          { name: 'Extra Cheese', price: 25 },
          { name: 'Extra Dip', price: 15 }
        ],
        removableIngredients: ['Onions', 'Chillies']
      });
    }
    setIsFoodModalOpen(false);
  };

  const handleAssignPartner = (orderId: string, partnerId: string) => {
    assignDeliveryPartner(orderId, partnerId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Central Management System
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-medium">Developed by #TEAMSQUAD</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 mt-0.5">
            CampusBite Admin Console
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Real-time management for canteen catalog, live orders, hostel delivery dispatch & analytics.
          </p>
        </div>

        {/* Tab Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Overview & KPIs
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'food' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Food & Stock ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Orders & Dispatch ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'slots' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Delivery Slots
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Reports
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                <span>Total Campus Orders</span>
                <ShoppingBag className="w-4 h-4 text-[#F07832]" />
              </div>
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 tabular-nums">
                {totalOrdersCount}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">↑ +18% from last week</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                <span>Canteen Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 tabular-nums">
                ₹{totalRevenue}
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Avg Order: ₹{averageOrderValue}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                <span>Active Kitchen Orders</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-blue-600 tabular-nums">
                {activeOrdersCount}
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Currently in kitchen / transit</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                <span>Registered Students</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 tabular-nums">
                {totalStudents}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">Active across 6 hostel wings</p>
            </div>

          </div>

          {/* Quick Action Strip & Live Rush Alert */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Rush hour status */}
            <div className="bg-gradient-to-br from-[#FFF0E4] to-white p-6 rounded-2xl border border-[#F07832]/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F07832] uppercase">
                <Clock className="w-4 h-4" />
                <span>Peak Rush Window</span>
              </div>
              <h4 className="font-heading font-bold text-lg text-stone-900">
                Lunch Break Rush (12:30 – 1:45 PM)
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pre-orders reduce canteen counter wait by 78%. Kitchen staff currently handling {activeOrdersCount} batch orders.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2 bg-[#F07832] text-white rounded-xl text-xs font-semibold hover:bg-[#e06b25] transition-colors"
                >
                  Manage Live Orders
                </button>
              </div>
            </div>

            {/* Delivery Fleet Quick Stats */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-stone-900">
                  Campus Delivery Fleet
                </h4>
                <Bike className="w-4 h-4 text-[#16A36A]" />
              </div>
              <div className="space-y-2 text-xs">
                {deliveryPartners.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0">
                    <div>
                      <p className="font-semibold text-stone-800">{p.name}</p>
                      <p className="text-[10px] text-stone-400">{p.phone}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      p.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Inventory Alert */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-stone-900">
                  Canteen Stock Health
                </h4>
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-600">Dishes in Stock:</span>
                  <span className="font-bold text-emerald-700">
                    {menuItems.filter(i => i.isAvailable).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Dishes Sold Out:</span>
                  <span className="font-bold text-red-600">
                    {menuItems.filter(i => !i.isAvailable).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Today's Specials:</span>
                  <span className="font-bold text-stone-900">
                    {menuItems.filter(i => i.isSpecial).length}
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('food')}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  Manage Food Catalog
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: FOOD MANAGEMENT & STOCK */}
      {activeTab === 'food' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Canteen Food Items & Instant Stock Control
              </h3>
              <p className="text-xs text-stone-500">
                Update prices, ingredients, availability, and add new recipes to the campus menu.
              </p>
            </div>
            <button
              onClick={handleOpenAddFood}
              className="px-4 py-2.5 bg-[#F07832] hover:bg-[#e06b25] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Menu Items Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Dish</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Prep Time</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {menuItems.map(item => (
                    <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-stone-900">
                              <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                              <span>{item.name}</span>
                            </div>
                            <span className="text-[10px] text-stone-400 line-clamp-1 max-w-xs">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-600">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900 tabular-nums">
                        ₹{item.price}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {item.prepTimeMinutes} mins
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleItemAvailability(item.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                            item.isAvailable 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          }`}
                          title="Click to toggle In Stock / Out of Stock instantly"
                        >
                          {item.isAvailable ? '● In Stock' : '✕ Sold Out'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        ★ {item.rating} ({item.ratingCount})
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditFood(item)}
                            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                            title="Edit dish"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Delete dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT & DELIVERY ASSIGNMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Campus Orders & Hostel Partner Dispatch
              </h3>
              <p className="text-xs text-stone-500">
                Track order preparation status, dispatch hostel deliveries, and view student instructions.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${orderFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'}`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter('active')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${orderFilter === 'active' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'}`}
              >
                Active Kitchen ({activeOrdersCount})
              </button>
              <button
                onClick={() => setOrderFilter('completed')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${orderFilter === 'completed' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'}`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Orders Cards List */}
          <div className="space-y-3">
            {displayedOrders.map(order => (
              <div 
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-extrabold text-base text-stone-900">
                      #{order.orderNumber}
                    </span>
                    <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-md ${
                      order.status === 'delivered' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : order.status === 'ready'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-[#FFF0E4] text-[#F07832]'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-stone-500">
                      {order.type === 'pickup' ? 'Counter Pickup' : 'Hostel Delivery'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">Placed:</span>
                    <span className="text-xs font-medium text-stone-800">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs font-bold text-stone-900 tabular-nums">
                      ₹{order.finalAmount} ({order.paymentMethod})
                    </span>
                  </div>
                </div>

                {/* Items & Student Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Items */}
                  <div className="space-y-1.5">
                    <p className="font-semibold text-stone-500 text-[11px] uppercase">Food Ordered:</p>
                    {order.items.map(i => (
                      <div key={i.id} className="p-2 bg-stone-50 rounded-lg">
                        <div className="flex justify-between font-medium text-stone-900">
                          <span>{i.quantity}x {i.name}</span>
                          <span className="tabular-nums">₹{i.subtotal}</span>
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5 space-x-2">
                          <span>Spice: <strong>{i.customization.spiceLevel}</strong></span>
                          {i.customization.extraCheese && <span className="text-[#F07832]">+Cheese</span>}
                          {i.customization.removedIngredients.length > 0 && (
                            <span className="text-red-500">No {i.customization.removedIngredients.join(',')}</span>
                          )}
                        </div>
                        {i.customization.specialInstructions && (
                          <p className="text-[10px] text-stone-500 italic mt-0.5">"{i.customization.specialInstructions}"</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Student & Delivery Assignment */}
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-stone-500 text-[11px] uppercase">Student Customer:</p>
                      <p className="font-bold text-stone-900">{order.studentName} ({order.studentId})</p>
                      <p className="text-stone-600">Phone: {order.studentPhone}</p>
                      {order.type === 'delivery' && order.hostelAddress && (
                        <p className="text-stone-700 mt-1">
                          Room: {order.hostelAddress.hostelName} · {order.hostelAddress.roomNumber} ({order.hostelAddress.floorNumber})
                        </p>
                      )}
                    </div>

                    {/* Delivery Partner Assignment Dropdown if Delivery type */}
                    {order.type === 'delivery' && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-800">Assigned Runner:</span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            PIN: {order.deliveryPin || '4829'}
                          </span>
                        </div>
                        <select
                          value={order.deliveryPartnerId || 'dp-1'}
                          onChange={(e) => handleAssignPartner(order.id, e.target.value)}
                          className="w-full p-2 rounded-lg border border-stone-200 bg-white outline-none text-xs"
                        >
                          {deliveryPartners.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.status} - {p.phone})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Status Override */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-stone-500 text-[11px]">Set Status:</span>
                      {(['placed', 'accepted', 'preparing', 'ready', 'delivered'] as OrderStatus[]).map(st => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(order.id, st)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                            order.status === st ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: DELIVERY SLOTS MANAGEMENT */}
      {activeTab === 'slots' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-stone-900">
              Hostel Delivery Slots & Capacity
            </h3>
            <p className="text-xs text-stone-500">
              Manage canteen delivery windows to avoid kitchen overload during exam & meal rushes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliverySlots.map(slot => (
              <div 
                key={slot.id} 
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{slot.timeWindow}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    slot.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {slot.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <p>Meal Type: <strong>{slot.type}</strong></p>
                  <p>Max Capacity: <strong>{slot.maxCapacity} orders</strong></p>
                  <p>Booked: <strong>{slot.bookedCount} slots filled</strong></p>
                </div>

                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#F07832] h-full rounded-full"
                    style={{ width: `${Math.min(100, (slot.bookedCount / slot.maxCapacity) * 100)}%` }}
                  />
                </div>

                <button
                  onClick={() => toggleDeliverySlot(slot.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                    slot.isActive 
                      ? 'border border-red-200 text-red-600 hover:bg-red-50' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {slot.isActive ? 'Disable Slot' : 'Enable Slot'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS & REPORTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-stone-900">
              Canteen Sales & Demand Analytics
            </h3>
            <p className="text-xs text-stone-500">
              Insights on student meal patterns, top selling dishes, and peak rush distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top 5 Dishes */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h4 className="font-heading font-bold text-sm text-stone-900">
                Top Selling Campus Dishes
              </h4>
              <div className="space-y-3">
                {[
                  { name: 'Campus Artisan Cold Coffee & Brownie', count: 610, percent: 88 },
                  { name: 'Butter Paneer Tikka Kathi Roll', count: 512, percent: 74 },
                  { name: 'Cheesy Veggie Delight Pan Pizza', count: 420, percent: 62 },
                  { name: 'Royal Chicken Biryani Thali', count: 388, percent: 55 },
                  { name: 'Campus Jumbo Burger Combo', count: 342, percent: 49 },
                ].map(dish => (
                  <div key={dish.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-stone-800">{dish.name}</span>
                      <span className="font-bold text-stone-900 tabular-nums">{dish.count} orders</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#F07832] h-full rounded-full" style={{ width: `${dish.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Rush Hours Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h4 className="font-heading font-bold text-sm text-stone-900">
                Hourly Canteen Order Distribution
              </h4>
              <div className="space-y-3">
                {[
                  { time: '08:30 AM - 10:30 AM (Breakfast Dosa / Chai)', percent: 65, orders: 184 },
                  { time: '12:30 PM - 02:00 PM (Lunch Thali & Biryani)', percent: 95, orders: 412 },
                  { time: '04:30 PM - 06:00 PM (Evening Kathi Rolls & Shakes)', percent: 70, orders: 230 },
                  { time: '08:00 PM - 09:30 PM (Dinner Rush)', percent: 80, orders: 310 },
                  { time: '10:30 PM - 11:30 PM (Night Owl Canteen Snacks)', percent: 85, orders: 284 },
                ].map(rush => (
                  <div key={rush.time} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-700">{rush.time}</span>
                      <span className="font-bold text-stone-900 tabular-nums">{rush.orders}</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${rush.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add / Edit Food Modal */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                {editingItem ? 'Edit Canteen Dish' : 'Add New Food Item'}
              </h3>
              <button onClick={() => setIsFoodModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Dish Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832] bg-white"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Combos">Combos</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Prep Time (mins)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Original Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVeg}
                    onChange={(e) => setIsVeg(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="font-medium text-stone-800">Vegetarian Dish</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 text-[#F07832] rounded"
                  />
                  <span className="font-medium text-stone-800">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSpecial}
                    onChange={(e) => setIsSpecial(e.target.checked)}
                    className="w-4 h-4 text-[#F07832] rounded"
                  />
                  <span className="font-medium text-stone-800">Today's Special</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFoodModalOpen(false)}
                  className="flex-1 py-2.5 border border-stone-300 text-stone-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#F07832] text-white font-semibold rounded-xl hover:bg-[#e06b25]"
                >
                  Save Food Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
