import React from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { Clock, ShieldCheck, Bike, Sparkles, ArrowRight, Flame } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setStudentView, orders, setTrackedOrderId } = useCampusBite();
  const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF0E4]/60 to-[#FFF9F3] pt-6 sm:pt-10 pb-12 border-b border-[#F07832]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Promotional notice bar */}
        <div className="flex items-center justify-between bg-white/80 border border-[#F07832]/20 rounded-xl px-4 py-2.5 mb-8 shadow-xs max-w-2xl">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#242424]">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#F07832]/15 text-[#F07832]">
              <Flame className="w-3.5 h-3.5 fill-[#F07832]" />
            </span>
            <span className="font-semibold text-[#F07832]">Special Offer:</span>
            <span>Use code <strong className="text-stone-900 font-bold bg-[#FFF0E4] px-1.5 py-0.5 rounded">CAMPUS50</strong> for ₹50 off</span>
          </div>
          <span className="text-[11px] text-stone-500 hidden sm:inline">Min. order ₹149</span>
        </div>

        {/* 2-Column Responsive Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0E4] text-[#F07832] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart College Canteen Pre-Booking</span>
              </div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#242424] leading-tight tracking-tight">
                Your Campus. <br />
                <span className="text-[#F07832]">Your Food.</span> Your Way.
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
                Skip 30-minute canteen queue lines! Pre-order your meals before lecture ends, customize toppings & spice level, and collect from the express counter or get direct delivery to your hostel room.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setStudentView('menu')}
                className="px-6 py-3 rounded-xl bg-[#F07832] hover:bg-[#e06b25] text-white font-semibold text-sm shadow-md shadow-[#F07832]/25 flex items-center gap-2 transition-all active:scale-98"
              >
                <span>Browse Food Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {activeOrder ? (
                <button
                  onClick={() => {
                    setTrackedOrderId(activeOrder.id);
                    setStudentView('track');
                  }}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#16A36A]"></span>
                  <span>Track Active Order #{activeOrder.orderNumber}</span>
                </button>
              ) : (
                <button
                  onClick={() => setStudentView('orders')}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Clock className="w-4 h-4 text-stone-500" />
                  <span>Recent Orders</span>
                </button>
              )}
            </div>

            {/* 3 Trust Markers */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200/80">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs sm:text-sm">
                  <Clock className="w-3.5 h-3.5 text-[#F07832]" />
                  <span>10-15 Min Prep</span>
                </div>
                <span className="text-[11px] text-stone-500">Live kitchen sync</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs sm:text-sm">
                  <Bike className="w-3.5 h-3.5 text-[#16A36A]" />
                  <span>Hostel Delivery</span>
                </div>
                <span className="text-[11px] text-stone-500">To your room door</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs sm:text-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F07832]" />
                  <span>FSSAI Certified</span>
                </div>
                <span className="text-[11px] text-stone-500">Hygiene inspected</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Image Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 bg-stone-100">
                <img
                  src="/src/assets/images/hero_campus_combo_1793819593119.jpg"
                  alt="Delicious CampusBite Canteen Meal Combo"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Highlight Card 1 */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-stone-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F07832]/10 flex items-center justify-center text-[#F07832] font-bold text-xs">
                    4.9★
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-stone-900">Student Favorite</p>
                    <p className="text-[10px] text-stone-500">Burger & Fries Combo</p>
                  </div>
                </div>

                {/* Floating Highlight Card 2 */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-stone-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A]"></span>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-stone-900">Express Counter Active</p>
                    <p className="text-[10px] text-stone-500">Current Wait: ~8 mins</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
