import React, { useState } from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { OrderStatus } from '../../types';
import { 
  ChefHat, 
  Clock, 
  UtensilsCrossed, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  Flame, 
  PackageCheck,
  Bike
} from 'lucide-react';

export const KitchenDashboard: React.FC = () => {
  const { orders, updateOrderStatus, playOrderChime, addToast } = useCampusBite();

  const [filter, setFilter] = useState<'all' | 'pending' | 'cooking' | 'ready'>('cooking');

  // Filter orders active in kitchen
  const kitchenOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  const filteredOrders = kitchenOrders.filter(o => {
    if (filter === 'pending') return o.status === 'placed';
    if (filter === 'cooking') return o.status === 'accepted' || o.status === 'preparing';
    if (filter === 'ready') return o.status === 'ready';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header with Live KDS indicators & chime test */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Kitchen Display System (KDS)
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-medium">Head Chef Murugan</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 mt-0.5">
            Live Kitchen Cooking Queue
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Read customized spice levels, extra cheese, and removed ingredients to cook authentic batches.
          </p>
        </div>

        {/* Chime & Filter Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              playOrderChime();
              addToast('Order notification chime tested', 'info');
            }}
            className="px-3.5 py-2 bg-white border border-stone-200 hover:border-amber-400 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Volume2 className="w-4 h-4 text-amber-500" />
            <span>Sound Chime</span>
          </button>

          {/* Filter segment */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilter('cooking')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter === 'cooking' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'}`}
            >
              Cooking ({kitchenOrders.filter(o => o.status === 'accepted' || o.status === 'preparing').length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter === 'pending' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'}`}
            >
              New Placed ({kitchenOrders.filter(o => o.status === 'placed').length})
            </button>
            <button
              onClick={() => setFilter('ready')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${filter === 'ready' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'}`}
            >
              Ready ({kitchenOrders.filter(o => o.status === 'ready').length})
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ChefHat className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-lg text-stone-900">All Clear! No Pending Cooking Orders</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            The kitchen queue is completely caught up. New orders from students will appear here with an audible chime.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map(order => {
            const isPickup = order.type === 'pickup';

            return (
              <div
                key={order.id}
                className={`flex flex-col justify-between bg-white rounded-2xl border shadow-sm transition-all overflow-hidden ${
                  order.status === 'placed' 
                    ? 'border-amber-400 ring-2 ring-amber-400/20' 
                    : order.status === 'preparing'
                      ? 'border-[#F07832]'
                      : 'border-blue-400'
                }`}
              >
                
                {/* Ticket Top Strip */}
                <div className={`p-4 border-b flex items-center justify-between ${
                  order.status === 'placed' 
                    ? 'bg-amber-50 border-amber-200' 
                    : order.status === 'preparing'
                      ? 'bg-[#FFF0E4] border-[#F07832]/20'
                      : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-lg text-stone-900">
                      #{order.orderNumber}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      isPickup ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isPickup ? 'Counter Pickup' : 'Hostel Delivery'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-stone-800 block">
                      {order.type === 'pickup' ? order.pickupSlot : order.deliverySlot}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Ticket Body: Itemized Food with Customization Tags */}
                <div className="p-4 space-y-4 flex-1">
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                            <span className="font-heading font-bold text-sm text-stone-900">
                              {item.quantity}x {item.name}
                            </span>
                          </div>
                        </div>

                        {/* HIGH VISIBILITY KITCHEN BADGES */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {/* Spice badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            item.customization.spiceLevel === 'Extra Fiery' 
                              ? 'bg-red-600 text-white' 
                              : item.customization.spiceLevel === 'Spicy'
                                ? 'bg-orange-500 text-white'
                                : 'bg-stone-200 text-stone-800'
                          }`}>
                            <Flame className="w-3 h-3" />
                            <span>SPICE: {item.customization.spiceLevel.toUpperCase()}</span>
                          </span>

                          {/* Extra Cheese */}
                          {item.customization.extraCheese && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-amber-950">
                              + EXTRA CHEESE
                            </span>
                          )}

                          {/* Toppings */}
                          {item.customization.extraToppings.map(t => (
                            <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              + {t}
                            </span>
                          ))}

                          {/* Removed Ingredients - Danger Alert */}
                          {item.customization.removedIngredients.map(r => (
                            <span key={r} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700">
                              ✕ NO {r.toUpperCase()}
                            </span>
                          ))}
                        </div>

                        {/* Special Instructions */}
                        {item.customization.specialInstructions && (
                          <div className="mt-1 p-2 bg-amber-50/80 border border-amber-200 rounded-lg text-[11px] text-amber-900 font-medium">
                            <strong>Note:</strong> "{item.customization.specialInstructions}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Student Contact Info */}
                  <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span>Student: <strong>{order.studentName}</strong></span>
                    <span>Ph: {order.studentPhone}</span>
                  </div>
                </div>

                {/* Ticket Action Footers */}
                <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center gap-2">
                  {order.status === 'placed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'accepted')}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>Accept Order</span>
                    </button>
                  )}

                  {order.status === 'accepted' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="flex-1 py-2.5 bg-[#F07832] hover:bg-[#e06b25] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>Start Cooking</span>
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="flex-1 py-2.5 bg-[#16A36A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Mark Ready & Packed</span>
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <div className="w-full text-center py-2 text-xs font-bold text-blue-700 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isPickup ? 'Awaiting Counter Pickup' : 'Dispatched to Delivery Runner'}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
