import React, { useState } from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { Order } from '../../types';
import { 
  Bike, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building, 
  Navigation, 
  ShieldCheck, 
  DollarSign,
  X,
  MessageSquare
} from 'lucide-react';

export const DeliveryDashboard: React.FC = () => {
  const { orders, updateOrderStatus, addToast } = useCampusBite();

  // Selected order for call/contact
  const [contactOrder, setContactOrder] = useState<Order | null>(null);
  
  // PIN verification state
  const [pinInputs, setPinInputs] = useState<Record<string, string>>({});

  // Filter delivery orders assigned
  const deliveryOrders = orders.filter(o => o.type === 'delivery');
  const activeDeliveries = deliveryOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedDeliveries = deliveryOrders.filter(o => o.status === 'delivered');

  const handleVerifyPinAndDeliver = (order: Order) => {
    const inputPin = pinInputs[order.id]?.trim();
    const correctPin = order.deliveryPin || '4829';

    if (!inputPin) {
      addToast('Please enter the 4-digit student delivery PIN', 'warning');
      return;
    }

    if (inputPin === correctPin) {
      updateOrderStatus(order.id, 'delivered');
      addToast(`Order #${order.orderNumber} delivered to ${order.hostelAddress?.roomNumber}!`, 'success');
    } else {
      addToast('Incorrect delivery PIN! Ask student for verification code.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Runner Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#16A36A] uppercase tracking-wider">
              Campus Runner Dispatch
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-medium">Rahul Verma (Partner #1)</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 mt-0.5">
            Hostel Delivery Tasks
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Deliver warm meals directly to hostel rooms with doorstep PIN verification.
          </p>
        </div>

        {/* Runner Shift Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 font-bold uppercase">Today's Runs</p>
              <p className="font-heading font-bold text-sm text-stone-900">
                {completedDeliveries.length} Delivered
              </p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 font-bold uppercase">Earned Stipend</p>
              <p className="font-heading font-bold text-sm text-stone-900">
                ₹{completedDeliveries.length * 35}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Orders Section */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-stone-900">
          Active Assigned Orders ({activeDeliveries.length})
        </h3>

        {activeDeliveries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-heading font-bold text-base text-stone-900">No active delivery orders</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              You have completed all assigned hostel room runs. New delivery requests from students will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeDeliveries.map(order => {
              const addr = order.hostelAddress;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-extrabold text-lg text-stone-900">
                            #{order.orderNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            order.status === 'ready' 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {order.status === 'ready' ? 'Packed & Ready for Run' : order.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Slot: {order.deliverySlot} · Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <button
                        onClick={() => setContactOrder(order)}
                        className="px-3 py-1.5 bg-[#F07832]/10 hover:bg-[#F07832]/20 text-[#F07832] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Student</span>
                      </button>
                    </div>

                    {/* Destination Room Box */}
                    <div className="p-4 bg-[#FFF9F3] rounded-xl border border-[#F07832]/20 space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#F07832] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-heading font-bold text-sm text-stone-900">
                            {addr?.hostelName || 'Aryabhatta Boys Hostel (H-4)'}
                          </p>
                          <p className="text-xs font-semibold text-stone-800 mt-0.5">
                            {addr?.roomNumber || 'Room 314'} ({addr?.floorNumber || '3rd Floor'}) · {addr?.buildingName || 'Block B'}
                          </p>
                        </div>
                      </div>

                      {addr?.deliveryInstructions && (
                        <div className="pl-6 text-[11px] text-stone-600 italic">
                          "{addr.deliveryInstructions}"
                        </div>
                      )}
                    </div>

                    {/* Food Items & Payment Info */}
                    <div className="text-xs space-y-1.5 text-stone-600">
                      <p className="font-semibold text-stone-800">
                        Items: {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                      <div className="flex justify-between text-stone-500 text-[11px] pt-1">
                        <span>Payment Status: <strong className="text-stone-800">{order.paymentStatus} ({order.paymentMethod})</strong></span>
                        <span>Amount: <strong className="text-stone-900">₹{order.finalAmount}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Action Workflow: Pick Up -> Out for Delivery -> Deliver with PIN */}
                  <div className="pt-3 border-t border-stone-100 space-y-3">
                    
                    {order.status !== 'ready' && order.status !== 'delivered' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Bike className="w-4 h-4" />
                        <span>Picked Up from Canteen Kitchen (Out for Delivery)</span>
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="Enter 4-Digit Student PIN"
                            value={pinInputs[order.id] || ''}
                            onChange={(e) => setPinInputs({ ...pinInputs, [order.id]: e.target.value })}
                            className="flex-1 p-2.5 text-xs text-center tracking-widest font-bold border border-stone-300 rounded-xl outline-none focus:border-[#16A36A]"
                          />
                          <button
                            onClick={() => handleVerifyPinAndDeliver(order)}
                            className="px-4 py-2.5 bg-[#16A36A] hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap"
                          >
                            Verify & Deliver
                          </button>
                        </div>
                        <p className="text-[10px] text-stone-400 text-center">
                          Demo Hint: Student PIN is <strong className="text-stone-700">{order.deliveryPin || '4829'}</strong>
                        </p>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Deliveries History */}
      {completedDeliveries.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h3 className="font-heading font-bold text-base text-stone-900">
            Completed Hostel Runs Today
          </h3>
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
            {completedDeliveries.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                  <div>
                    <span className="font-heading font-bold text-stone-900">#{order.orderNumber}</span>
                    <span className="text-stone-500 ml-2">
                      {order.hostelAddress?.hostelName} · {order.hostelAddress?.roomNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-stone-500">
                  <span>₹{order.finalAmount}</span>
                  <span className="text-emerald-700 font-semibold">+₹35 Delivery Credit</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Student Modal */}
      {contactOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 border border-stone-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <span className="font-heading font-bold text-sm text-stone-900">Student Contact Card</span>
              <button onClick={() => setContactOrder(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#FFF0E4] text-[#F07832] flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-stone-900">
                {contactOrder.studentName}
              </h4>
              <p className="text-xs text-stone-500">
                Student ID: {contactOrder.studentId}
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl text-xs text-left space-y-2 border border-stone-200">
              <div className="flex justify-between">
                <span className="text-stone-500">Hostel Room:</span>
                <span className="font-semibold text-stone-800">
                  {contactOrder.hostelAddress?.roomNumber} ({contactOrder.hostelAddress?.hostelName})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Phone:</span>
                <span className="font-semibold text-stone-800">{contactOrder.studentPhone}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  addToast(`Calling ${contactOrder.studentName} at ${contactOrder.studentPhone}...`, 'info');
                  setContactOrder(null);
                }}
                className="flex-1 py-2.5 bg-[#16A36A] hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                Call Student
              </button>
              <button
                onClick={() => {
                  addToast(`Opening SMS/WhatsApp chat to ${contactOrder.studentPhone}...`, 'info');
                  setContactOrder(null);
                }}
                className="px-4 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-50"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
