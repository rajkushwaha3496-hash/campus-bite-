import React, { useState } from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { Order, OrderStatus } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Bike, 
  QrCode, 
  Phone, 
  UtensilsCrossed, 
  AlertCircle, 
  ChevronRight, 
  ChefHat,
  PackageCheck,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';

export const OrderTracker: React.FC = () => {
  const { orders, trackedOrderId, setTrackedOrderId, cancelOrder, updateOrderStatus, setStudentView, addToast } = useCampusBite();

  // Find currently selected order
  const currentOrder = orders.find(o => o.id === trackedOrderId) || orders[0];

  const [showQrModal, setShowQrModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF0E4] text-[#F07832] flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="font-heading font-bold text-xl text-stone-900">No Orders Found</h3>
        <p className="text-sm text-stone-500">
          You haven't placed any food pre-orders yet. Browse our canteen menu to get started!
        </p>
        <button
          onClick={() => setStudentView('menu')}
          className="px-5 py-2.5 bg-[#F07832] text-white rounded-xl text-sm font-semibold hover:bg-[#e06b25] transition-colors"
        >
          Explore Food Menu
        </button>
      </div>
    );
  }

  // 5 Status Stages
  const stages: { key: OrderStatus; label: string; sub: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'placed', label: 'Order Placed', sub: 'Received at canteen system', icon: Clock },
    { key: 'accepted', label: 'Order Accepted', sub: 'Confirmed by kitchen desk', icon: ChefHat },
    { key: 'preparing', label: 'Preparing Meal', sub: 'Cooking fresh to your spice level', icon: UtensilsCrossed },
    { 
      key: 'ready', 
      label: currentOrder.type === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery', 
      sub: currentOrder.type === 'pickup' ? 'At Express Counter #1' : 'En route to your hostel room', 
      icon: currentOrder.type === 'pickup' ? PackageCheck : Bike 
    },
    { key: 'delivered', label: 'Delivered', sub: 'Enjoy your meal!', icon: CheckCircle2 }
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 0;
      case 'accepted': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'delivered': return 4;
      default: return -1;
    }
  };

  const currentStageIndex = getStageIndex(currentOrder.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F07832] uppercase tracking-wider">
              Live Order Status
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs font-medium text-stone-500">
              Placed {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#242424] mt-0.5">
            Order #{currentOrder.orderNumber}
          </h2>
        </div>

        {/* Order Selector Dropdown if multiple */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">Switch Order:</span>
            <select
              value={currentOrder.id}
              onChange={(e) => setTrackedOrderId(e.target.value)}
              className="text-xs font-medium p-2 rounded-xl border border-stone-200 bg-white outline-none focus:border-[#F07832]"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  #{o.orderNumber} ({o.status.toUpperCase()} - ₹{o.finalAmount})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Visual Tracker Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-8">
        
        {/* Estimated Time & Status Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FFF9F3] p-4 sm:p-5 rounded-xl border border-[#F07832]/15">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Estimated Timing
            </span>
            <div className="font-heading font-extrabold text-xl sm:text-2xl text-[#F07832]">
              {currentOrder.estimatedTime}
            </div>
            <p className="text-xs text-stone-600">
              {currentOrder.type === 'pickup' 
                ? `Counter Pickup Slot: ${currentOrder.pickupSlot || 'Ready in 15 mins'}` 
                : `Hostel Delivery Slot: ${currentOrder.deliverySlot || 'Standard Slot'}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentOrder.type === 'pickup' ? (
              <button
                onClick={() => setShowQrModal(true)}
                className="px-3.5 py-2 bg-white border border-stone-300 hover:border-[#F07832] rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-2 shadow-xs transition-colors"
              >
                <QrCode className="w-4 h-4 text-[#F07832]" />
                <span>Show Counter QR</span>
              </button>
            ) : (
              <div className="bg-white px-3.5 py-2 rounded-xl border border-stone-200 text-xs shadow-xs">
                <span className="text-stone-400 block text-[10px]">Hostel Delivery PIN</span>
                <span className="font-heading font-bold text-base text-stone-900 tracking-wider">
                  {currentOrder.deliveryPin || '4829'}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowCallModal(true)}
              className="px-3.5 py-2 bg-[#F07832]/10 hover:bg-[#F07832]/20 border border-[#F07832]/20 rounded-xl text-xs font-semibold text-[#F07832] flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Canteen</span>
            </button>
          </div>
        </div>

        {/* 5-Step Visual Tracker Bar */}
        <div className="space-y-6">
          <h4 className="font-heading font-bold text-sm text-stone-800">
            Order Progress Tracker
          </h4>

          {/* Stepper Grid */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-6 right-6 h-1 bg-stone-200 -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {stages.map((stg, idx) => {
                const Icon = stg.icon;
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div 
                    key={stg.key}
                    className={`flex md:flex-col items-center md:text-center gap-3 p-3 rounded-xl transition-all ${
                      isCurrent 
                        ? 'bg-[#FFF0E4] border border-[#F07832]/30 shadow-xs' 
                        : isPassed 
                          ? 'bg-stone-50 border border-stone-200' 
                          : 'bg-white border border-stone-100 opacity-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isCurrent 
                        ? 'bg-[#F07832] text-white shadow-md shadow-[#F07832]/30' 
                        : isPassed 
                          ? 'bg-[#16A36A] text-white' 
                          : 'bg-stone-200 text-stone-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="text-left md:text-center">
                      <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-[#F07832]' : isPassed ? 'text-stone-900' : 'text-stone-500'}`}>
                        {stg.label}
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                        {stg.sub}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Simulation Controls (Allows user to test transitions directly from Tracker!) */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-600">
            <span className="font-semibold text-stone-800">Demo Status Simulator:</span>
            <span>Test progression:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => updateOrderStatus(currentOrder.id, 'placed')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border ${currentOrder.status === 'placed' ? 'bg-[#F07832] text-white border-[#F07832]' : 'bg-white text-stone-700'}`}
            >
              1. Placed
            </button>
            <button
              onClick={() => updateOrderStatus(currentOrder.id, 'accepted')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border ${currentOrder.status === 'accepted' ? 'bg-[#F07832] text-white border-[#F07832]' : 'bg-white text-stone-700'}`}
            >
              2. Accepted
            </button>
            <button
              onClick={() => updateOrderStatus(currentOrder.id, 'preparing')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border ${currentOrder.status === 'preparing' ? 'bg-[#F07832] text-white border-[#F07832]' : 'bg-white text-stone-700'}`}
            >
              3. Preparing
            </button>
            <button
              onClick={() => updateOrderStatus(currentOrder.id, 'ready')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border ${currentOrder.status === 'ready' ? 'bg-[#F07832] text-white border-[#F07832]' : 'bg-white text-stone-700'}`}
            >
              4. Ready
            </button>
            <button
              onClick={() => updateOrderStatus(currentOrder.id, 'delivered')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border ${currentOrder.status === 'delivered' ? 'bg-[#16A36A] text-white border-[#16A36A]' : 'bg-white text-stone-700'}`}
            >
              5. Delivered
            </button>
          </div>
        </div>

      </div>

      {/* Order Itemized Summary & Delivery Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Col 1 & 2: Food Items & Customizations */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-heading font-bold text-sm text-stone-900">
              Food Items in this Pre-Order ({currentOrder.items.length})
            </h4>
            <span className="text-xs text-stone-500">
              Paid via {currentOrder.paymentMethod}
            </span>
          </div>

          <div className="space-y-3 divide-y divide-stone-100">
            {currentOrder.items.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                    <span className="font-medium text-xs sm:text-sm text-stone-900">
                      {item.quantity}x {item.name}
                    </span>
                  </div>
                  <span className="font-heading font-bold text-xs sm:text-sm text-stone-900 tabular-nums">
                    ₹{item.subtotal}
                  </span>
                </div>

                {/* Customizations tags */}
                <div className="pl-4 text-[11px] text-stone-500 space-y-0.5">
                  <p>Spice Level: <strong className="text-stone-700">{item.customization.spiceLevel}</strong></p>
                  {item.customization.extraCheese && (
                    <p className="text-[#F07832]">+ Extra Cheese Added</p>
                  )}
                  {item.customization.extraToppings.length > 0 && (
                    <p>+ Extra Toppings: {item.customization.extraToppings.join(', ')}</p>
                  )}
                  {item.customization.removedIngredients.length > 0 && (
                    <p className="text-red-500">✕ Excluded: {item.customization.removedIngredients.join(', ')}</p>
                  )}
                  {item.customization.specialInstructions && (
                    <p className="italic text-stone-600">Note: "{item.customization.specialInstructions}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-stone-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Item Total</span>
              <span className="tabular-nums">₹{currentOrder.itemTotal}</span>
            </div>
            {currentOrder.deliveryFee > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Delivery Fee</span>
                <span className="tabular-nums">₹{currentOrder.deliveryFee}</span>
              </div>
            )}
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({currentOrder.promoCodeApplied || 'Offer'})</span>
                <span className="tabular-nums">-₹{currentOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-heading font-bold text-sm text-stone-900 pt-2 border-t border-stone-100">
              <span>Final Total Paid</span>
              <span className="tabular-nums text-[#F07832]">₹{currentOrder.finalAmount}</span>
            </div>
          </div>
        </div>

        {/* Col 3: Delivery/Pickup Info */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-xs">
          <h4 className="font-heading font-bold text-sm text-stone-900 border-b border-stone-100 pb-3">
            {currentOrder.type === 'pickup' ? 'Pickup Details' : 'Hostel Room Details'}
          </h4>

          {currentOrder.type === 'pickup' ? (
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-stone-400 text-[10px] uppercase font-bold">Counter</p>
                <p className="text-stone-800 font-semibold mt-0.5">{currentOrder.pickupCounter || 'Express Counter #1'}</p>
                <p className="text-stone-500">Central Food Court, Ground Floor</p>
              </div>

              <div>
                <p className="text-stone-400 text-[10px] uppercase font-bold">Pickup Slot</p>
                <p className="text-stone-800 font-semibold mt-0.5">{currentOrder.pickupSlot}</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                <p className="font-bold text-stone-800">Instructions:</p>
                <p className="text-stone-600 text-[11px]">
                  When order is Ready, show your QR code to the cashier at Counter #1 to collect without queuing.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-stone-400 text-[10px] uppercase font-bold">Destination Hostel</p>
                <p className="text-stone-900 font-bold mt-0.5">
                  {currentOrder.hostelAddress?.hostelName || 'Aryabhatta Hostel'}
                </p>
                <p className="text-stone-700">
                  {currentOrder.hostelAddress?.roomNumber} · {currentOrder.hostelAddress?.floorNumber}
                </p>
                <p className="text-stone-500">
                  {currentOrder.hostelAddress?.buildingName}
                </p>
              </div>

              <div>
                <p className="text-stone-400 text-[10px] uppercase font-bold">Assigned Runner</p>
                <p className="text-stone-800 font-semibold mt-0.5">
                  {currentOrder.deliveryPartnerName || 'Rahul Verma (#TEAMSQUAD Delivery)'}
                </p>
                <p className="text-stone-500">
                  Contact: {currentOrder.deliveryPartnerPhone || '+91 98112 34567'}
                </p>
              </div>

              {currentOrder.hostelAddress?.deliveryInstructions && (
                <div className="p-3 bg-[#FFF0E4]/60 rounded-xl border border-[#F07832]/20">
                  <p className="font-semibold text-stone-800 text-[11px]">Delivery Note:</p>
                  <p className="text-stone-600 text-[11px] mt-0.5">
                    "{currentOrder.hostelAddress.deliveryInstructions}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cancellation allowed only if placed and not yet accepted */}
          {currentOrder.status === 'placed' && (
            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={() => cancelOrder(currentOrder.id)}
                className="w-full py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel Order
              </button>
            </div>
          )}

        </div>

      </div>

      {/* QR Code Modal for Pickup Counter */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 border border-stone-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <span className="font-heading font-bold text-sm text-stone-900">Pickup Counter QR Pass</span>
              <button onClick={() => setShowQrModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Generated QR Box */}
            <div className="p-5 bg-stone-50 border-2 border-dashed border-[#F07832]/40 rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div className="w-44 h-44 bg-white p-3 rounded-xl border border-stone-200 shadow-xs flex items-center justify-center">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900">
                  <rect width="100" height="100" fill="white" />
                  {/* Outer markers */}
                  <rect x="10" y="10" width="25" height="25" fill="currentColor" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="18" y="18" width="9" height="9" fill="currentColor" />

                  <rect x="65" y="10" width="25" height="25" fill="currentColor" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="73" y="18" width="9" height="9" fill="currentColor" />

                  <rect x="10" y="65" width="25" height="25" fill="currentColor" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="18" y="73" width="9" height="9" fill="currentColor" />

                  {/* Data matrices */}
                  <rect x="42" y="12" width="5" height="5" fill="currentColor" />
                  <rect x="50" y="12" width="5" height="10" fill="currentColor" />
                  <rect x="42" y="24" width="12" height="6" fill="currentColor" />
                  <rect x="12" y="42" width="6" height="14" fill="currentColor" />
                  <rect x="24" y="42" width="8" height="6" fill="currentColor" />
                  <rect x="36" y="38" width="16" height="16" fill="#F07832" />
                  <rect x="58" y="42" width="10" height="6" fill="currentColor" />
                  <rect x="72" y="42" width="16" height="6" fill="currentColor" />
                  <rect x="42" y="60" width="14" height="6" fill="currentColor" />
                  <rect x="62" y="60" width="6" height="18" fill="currentColor" />
                  <rect x="72" y="54" width="16" height="10" fill="currentColor" />
                  <rect x="42" y="72" width="14" height="16" fill="currentColor" />
                  <rect x="62" y="82" width="26" height="6" fill="currentColor" />
                </svg>
              </div>

              <div className="font-heading font-extrabold text-lg text-stone-900 tracking-wider">
                {currentOrder.orderNumber}
              </div>
              <p className="text-[11px] text-stone-500">
                Scan at Counter #1 Scanner to verify pickup
              </p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-[#F07832] text-white rounded-xl text-xs font-semibold hover:bg-[#e06b25]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Contact Canteen Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 border border-stone-200 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0E4] text-[#F07832] flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-stone-900">Campus Canteen Helpdesk</h4>
              <p className="text-xs text-stone-500 mt-1">
                Order #{currentOrder.orderNumber} Inquiry
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl text-xs text-left space-y-2 border border-stone-200">
              <div className="flex justify-between">
                <span className="text-stone-500">Kitchen Counter:</span>
                <span className="font-semibold text-stone-800">Ext 4402 (+91 98765 43210)</span>
              </div>
              {currentOrder.deliveryPartnerPhone && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Runner ({currentOrder.deliveryPartnerName}):</span>
                  <span className="font-semibold text-stone-800">{currentOrder.deliveryPartnerPhone}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  addToast('Simulating call to Canteen Kitchen...', 'info');
                  setShowCallModal(false);
                }}
                className="flex-1 py-2.5 bg-[#16A36A] text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
              >
                Call Desk Now
              </button>
              <button
                onClick={() => setShowCallModal(false)}
                className="px-4 py-2.5 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
