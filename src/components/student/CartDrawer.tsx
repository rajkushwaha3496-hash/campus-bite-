import React, { useState } from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Tag, 
  Wallet, 
  QrCode, 
  Banknote, 
  ChevronRight,
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    deliverySlots,
    user,
    topUpWallet,
    placeOrder,
    setStudentView,
    addToast
  } = useCampusBite();

  // Checkout Step: 'cart' | 'details' | 'payment'
  const [step, setStep] = useState<'cart' | 'details' | 'payment'>('cart');
  
  // Fulfillment Option
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('delivery');
  
  // Pickup details
  const [pickupSlot, setPickupSlot] = useState<string>('Ready in 15 mins (Express Counter #1)');
  
  // Delivery details
  const [selectedSlot, setSelectedSlot] = useState<string>(deliverySlots[0]?.timeWindow || '12:30 PM - 01:00 PM');
  
  // Promo code
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Wallet' | 'Cash'>('UPI');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isCartOpen) return null;

  const currentAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  // Fee calculation
  const deliveryFee = orderType === 'delivery' ? (cartSubtotal >= 149 ? 0 : 15) : 0;
  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const finalAmount = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'CAMPUS50') {
      if (cartSubtotal < 149) {
        addToast('CAMPUS50 requires minimum cart value of ₹149', 'warning');
        return;
      }
      setAppliedPromo({ code: 'CAMPUS50', discount: 50 });
      addToast('Promo CAMPUS50 applied! ₹50 saved', 'success');
    } else if (code === 'SQUAD20') {
      const disc = Math.round(cartSubtotal * 0.2);
      setAppliedPromo({ code: 'SQUAD20', discount: disc });
      addToast(`Promo SQUAD20 applied! ₹${disc} saved`, 'success');
    } else if (code === 'FIRSTBITE') {
      setAppliedPromo({ code: 'FIRSTBITE', discount: 30 });
      addToast('Promo FIRSTBITE applied! ₹30 saved', 'success');
    } else {
      addToast('Invalid or expired coupon code', 'error');
    }
  };

  const handleConfirmOrder = () => {
    if (orderType === 'delivery' && !currentAddress) {
      addToast('Please select or add a hostel delivery address', 'warning');
      return;
    }

    if (paymentMethod === 'Wallet' && user.walletBalance < finalAmount) {
      addToast('Insufficient wallet balance. Top up or select UPI.', 'warning');
      return;
    }

    setIsPlacing(true);
    setTimeout(() => {
      try {
        const order = placeOrder({
          type: orderType,
          paymentMethod,
          pickupSlot: orderType === 'pickup' ? pickupSlot : undefined,
          deliverySlot: orderType === 'delivery' ? selectedSlot : undefined,
          hostelAddress: orderType === 'delivery' ? currentAddress : undefined,
          discount: discountAmount,
          promoCodeApplied: appliedPromo?.code
        });

        setIsPlacing(false);
        setStep('cart');
        setStudentView('track');
      } catch (err: any) {
        setIsPlacing(false);
        addToast(err.message || 'Failed to place order', 'error');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FFF9F3]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#F07832]" />
            <h3 className="font-heading font-bold text-base text-[#242424]">
              {step === 'cart' && 'Your Campus Tray'}
              {step === 'details' && 'Booking & Delivery Slot'}
              {step === 'payment' && 'Select Payment Mode'}
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF0E4] text-[#F07832] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8 stroke-1" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-stone-900">Your tray is empty</h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Add fresh burgers, dosa, rolls, pizza, or cold coffee from the canteen menu to pre-order.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setStudentView('menu');
                    }}
                    className="mt-2 px-4 py-2 bg-[#F07832] text-white rounded-xl text-xs font-semibold hover:bg-[#e06b25] transition-colors"
                  >
                    Browse Food Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Items list */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div 
                        key={item.cartItemId} 
                        className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${item.menuItem.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                              <h5 className="font-heading font-semibold text-xs sm:text-sm text-stone-900 leading-snug">
                                {item.menuItem.name}
                              </h5>
                            </div>
                            <span className="text-xs font-bold text-[#F07832] tabular-nums mt-0.5 block">
                              ₹{item.unitPriceWithCustomizations} each
                            </span>
                          </div>

                          {/* Stepper & Trash */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5 shadow-xs">
                              <button
                                onClick={() => updateCartQuantity(item.cartItemId, -1)}
                                className="p-1 text-stone-600 hover:text-stone-900"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-1.5 tabular-nums text-stone-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.cartItemId, 1)}
                                className="p-1 text-stone-600 hover:text-stone-900"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Customization Details Summary */}
                        <div className="text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-100 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span>Spice: <strong>{item.customization.spiceLevel}</strong></span>
                            {item.customization.extraCheese && (
                              <span className="text-[#F07832] font-semibold">+Extra Cheese</span>
                            )}
                          </div>
                          {item.customization.extraToppings.length > 0 && (
                            <p className="text-stone-500">
                              + Toppings: {item.customization.extraToppings.join(', ')}
                            </p>
                          )}
                          {item.customization.removedIngredients.length > 0 && (
                            <p className="text-red-500">
                              ✕ No: {item.customization.removedIngredients.join(', ')}
                            </p>
                          )}
                          {item.customization.specialInstructions && (
                            <p className="text-stone-500 italic">
                              "{item.customization.specialInstructions}"
                            </p>
                          )}
                        </div>

                        <div className="text-right text-xs font-bold text-stone-900 tabular-nums">
                          Item Subtotal: ₹{item.totalPrice}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Input */}
                  <div className="pt-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          placeholder="Coupon (e.g. CAMPUS50)"
                          className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-200 uppercase outline-none focus:border-[#F07832]"
                        />
                      </div>
                      <button
                        onClick={handleApplyPromo}
                        className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {appliedPromo && (
                      <div className="mt-2 text-xs flex items-center justify-between bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <span>Code <strong>{appliedPromo.code}</strong> applied (-₹{appliedPromo.discount})</span>
                        <button onClick={() => setAppliedPromo(null)} className="text-emerald-900 font-bold hover:underline">
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </>
          )}

          {/* STEP 2: BOOKING OPTIONS (PICKUP VS HOSTEL ROOM DELIVERY) */}
          {step === 'details' && (
            <div className="space-y-5">
              
              {/* Option Selector: Pickup vs Delivery */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    orderType === 'pickup'
                      ? 'bg-white text-[#F07832] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Canteen Pickup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    orderType === 'delivery'
                      ? 'bg-white text-[#F07832] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Hostel Delivery</span>
                </button>
              </div>

              {/* PICKUP DETAILS */}
              {orderType === 'pickup' && (
                <div className="space-y-4">
                  <div className="bg-[#FFF0E4]/60 p-3.5 rounded-xl border border-[#F07832]/20 text-xs space-y-1">
                    <p className="font-heading font-semibold text-stone-900">
                      Express Canteen Counter Pickup
                    </p>
                    <p className="text-stone-600">
                      Show your generated order QR code at Express Counter #1 (Ground Floor Food Court) when your status turns <strong>Ready for Pickup</strong>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-900">
                      Choose Pickup Time Window
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                    >
                      <option value="Ready in 15 mins (Express Counter #1)">Ready in 15 mins (Immediate Cook)</option>
                      <option value="12:45 PM (Post-Lecture Break)">12:45 PM (Post-Lecture Break)</option>
                      <option value="01:15 PM (Lunch Hour)">01:15 PM (Lunch Hour)</option>
                      <option value="04:30 PM (Evening Break)">04:30 PM (Evening Break)</option>
                      <option value="08:15 PM (Dinner)">08:15 PM (Dinner)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* HOSTEL DELIVERY DETAILS */}
              {orderType === 'delivery' && (
                <div className="space-y-4">
                  
                  {/* Select saved address */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-stone-900">
                        Deliver to Hostel Room
                      </label>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          setStudentView('addresses');
                        }}
                        className="text-[11px] text-[#F07832] hover:underline font-semibold"
                      >
                        + Manage Rooms
                      </button>
                    </div>

                    {addresses.length === 0 ? (
                      <div className="p-3 border border-dashed rounded-xl text-center text-xs text-stone-500">
                        No saved hostel addresses found.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {addresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <div
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-[#F07832] bg-[#FFF0E4]/40 shadow-xs'
                                  : 'border-stone-200 hover:border-stone-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-stone-900">{addr.label}</span>
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#F07832]" />}
                              </div>
                              <p className="text-stone-700 font-medium mt-0.5">
                                {addr.hostelName} · {addr.roomNumber} ({addr.floorNumber})
                              </p>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                {addr.buildingName} · Phone: {addr.studentPhoneNumber}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Delivery Slot Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-900">
                      Select Available Delivery Slot
                    </label>
                    <div className="space-y-1.5">
                      {deliverySlots.filter(s => s.isActive).map(slot => (
                        <label
                          key={slot.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                            selectedSlot === slot.timeWindow
                              ? 'border-[#F07832] bg-[#FFF0E4]/50 font-medium'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="deliverySlot"
                              checked={selectedSlot === slot.timeWindow}
                              onChange={() => setSelectedSlot(slot.timeWindow)}
                              className="text-[#F07832] focus:ring-[#F07832]"
                            />
                            <span>{slot.timeWindow}</span>
                          </div>
                          <span className="text-[10px] text-stone-400">
                            {slot.type} · {slot.bookedCount}/{slot.maxCapacity} slots
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Free delivery badge */}
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                    <span>Hostel Room Delivery Fee:</span>
                    <span className="font-bold tabular-nums">
                      {cartSubtotal >= 149 ? 'FREE (Orders > ₹149)' : '₹15 (Add ₹' + (149 - cartSubtotal) + ' for Free)'}
                    </span>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-900">
                  Select Payment Option
                </label>
                
                {/* 1. UPI */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI' ? 'border-[#F07832] bg-[#FFF0E4]/40 shadow-xs' : 'border-stone-200 hover:border-stone-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-0.5 text-[#F07832] focus:ring-[#F07832]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">College UPI / QR Pay</span>
                      <QrCode className="w-4 h-4 text-[#F07832]" />
                    </div>
                    <p className="text-stone-500 mt-0.5">
                      GPay, PhonePe, Paytm, or BHIM direct fast settlement. Instant booking confirmation.
                    </p>
                  </div>
                </label>

                {/* 2. Campus Student Wallet */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Wallet' ? 'border-[#F07832] bg-[#FFF0E4]/40 shadow-xs' : 'border-stone-200 hover:border-stone-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Wallet'}
                    onChange={() => setPaymentMethod('Wallet')}
                    className="mt-0.5 text-[#F07832] focus:ring-[#F07832]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">Campus Student Wallet</span>
                      <Wallet className="w-4 h-4 text-[#F07832]" />
                    </div>
                    <p className="text-stone-500 mt-0.5">
                      Available Balance: <strong className="text-stone-800">₹{user.walletBalance}</strong>
                    </p>
                    {user.walletBalance < finalAmount && (
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[11px] text-red-600 font-medium">Insufficient balance</span>
                        <button
                          type="button"
                          onClick={() => topUpWallet(200)}
                          className="text-[11px] font-bold text-[#F07832] hover:underline"
                        >
                          + Top Up ₹200
                        </button>
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. Cash on Delivery / Counter */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash' ? 'border-[#F07832] bg-[#FFF0E4]/40 shadow-xs' : 'border-stone-200 hover:border-stone-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash'}
                    onChange={() => setPaymentMethod('Cash')}
                    className="mt-0.5 text-[#F07832] focus:ring-[#F07832]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">
                        {orderType === 'pickup' ? 'Pay at Counter' : 'Cash on Delivery (Hostel)'}
                      </span>
                      <Banknote className="w-4 h-4 text-stone-500" />
                    </div>
                    <p className="text-stone-500 mt-0.5">
                      Pay cash to canteen cashier or delivery runner upon receiving order.
                    </p>
                  </div>
                </label>

              </div>

              {/* Order Summary Box */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Type:</span>
                  <span className="font-semibold text-stone-900 capitalize">
                    {orderType === 'pickup' ? 'Counter Pickup' : 'Hostel Room Delivery'}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Timing Slot:</span>
                  <span className="font-medium text-stone-900">
                    {orderType === 'pickup' ? pickupSlot : selectedSlot}
                  </span>
                </div>
                {orderType === 'delivery' && currentAddress && (
                  <div className="flex justify-between text-stone-600">
                    <span>Hostel:</span>
                    <span className="font-medium text-stone-900 truncate max-w-[200px]">
                      {currentAddress.hostelName} ({currentAddress.roomNumber})
                    </span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footer with Price Breakdown and CTA Buttons */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-[#FFF9F3] space-y-3">
            
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="tabular-nums">₹{cartSubtotal}</span>
              </div>
              
              {orderType === 'delivery' && (
                <div className="flex justify-between text-stone-600">
                  <span>Hostel Delivery Fee</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}
                  </span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedPromo?.code})</span>
                  <span className="tabular-nums">-₹{discountAmount}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-200/80 flex justify-between font-heading font-bold text-base text-stone-900">
                <span>Total Amount</span>
                <span className="tabular-nums text-[#F07832]">₹{finalAmount}</span>
              </div>
            </div>

            {/* Stepper Buttons */}
            {step === 'cart' && (
              <button
                onClick={() => setStep('details')}
                className="w-full py-3 bg-[#F07832] hover:bg-[#e06b25] text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-[#F07832]/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Proceed to Pickup / Delivery Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'details' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 border border-stone-300 hover:bg-stone-100 rounded-xl text-xs font-semibold text-stone-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('payment')}
                  className="flex-1 py-3 bg-[#F07832] hover:bg-[#e06b25] text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-[#F07832]/25 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('details')}
                  className="px-4 py-3 border border-stone-300 hover:bg-stone-100 rounded-xl text-xs font-semibold text-stone-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={isPlacing}
                  className="flex-1 py-3 bg-[#16A36A] hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-[#16A36A]/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
                >
                  {isPlacing ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Pre-Book (₹{finalAmount})</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
