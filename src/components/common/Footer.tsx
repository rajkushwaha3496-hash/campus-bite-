import React from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { MapPin, Phone, Clock, Mail, Heart, Sparkles, Shield, ChefHat } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setStudentView, setIsPresentationOpen } = useCampusBite();

  return (
    <footer className="bg-[#242424] text-white border-t border-stone-800 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F07832] to-[#FF9A56] flex items-center justify-center text-white shadow-sm font-heading font-black text-lg">
                CB
              </div>
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                Campus<span className="text-[#F07832]">Bite</span>
              </span>
            </div>
            <p className="text-[#FF9A56] font-medium text-sm tracking-wide">
              Your Campus. Your Food. Your Way.
            </p>
            <p className="text-stone-400 text-xs leading-relaxed">
              Smart college canteen food pre-booking & customization platform. Eliminate long queue waits, customize spice & toppings, and enjoy hot counter pickup or hostel room delivery.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsPresentationOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F07832]/20 text-[#FF9A56] hover:bg-[#F07832]/30 text-xs font-semibold transition-colors border border-[#F07832]/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Meet #TEAMSQUAD & Tech Stack
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-sm tracking-wider uppercase text-stone-200">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setStudentView('home')} className="hover:text-white transition-colors">
                  Canteen Frontpage
                </button>
              </li>
              <li>
                <button onClick={() => setStudentView('menu')} className="hover:text-white transition-colors">
                  Complete Food Menu & Combos
                </button>
              </li>
              <li>
                <button onClick={() => setStudentView('orders')} className="hover:text-white transition-colors">
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setStudentView('addresses')} className="hover:text-white transition-colors">
                  Hostel Room Addresses
                </button>
              </li>
              <li>
                <button onClick={() => setIsPresentationOpen(true)} className="hover:text-white transition-colors">
                  Project Presentation & Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Canteen Timings */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-sm tracking-wider uppercase text-stone-200">
              Service Slots & Timing
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F07832] shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-200 font-medium">Operating Hours</p>
                  <p>Mon – Sun: 7:30 AM – 11:30 PM</p>
                </div>
              </div>
              <div className="pt-1">
                <p className="text-stone-200 font-medium">Meal Timings</p>
                <p>Breakfast: 07:30 AM – 11:00 AM</p>
                <p>Lunch Buffet: 12:00 PM – 03:00 PM</p>
                <p>Snacks & Fast Food: 03:30 PM – 07:00 PM</p>
                <p>Dinner & Night Canteen: 07:30 PM – 11:30 PM</p>
              </div>
            </div>
          </div>

          {/* Campus Location */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-sm tracking-wider uppercase text-stone-200">
              Canteen Dispatch Point
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F07832] shrink-0 mt-0.5" />
                <span>Central Campus Food Court, Ground Floor, Near Student Activity Center</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F07832] shrink-0" />
                <span>Intercom: 4402 / Helpline: +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F07832] shrink-0" />
                <span>canteen-desk@campusbite.edu</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with mandatory branding */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} CampusBite. All rights reserved.</p>
          <div className="flex items-center gap-2 font-medium text-stone-300">
            <span>Designed & Developed by</span>
            <span className="text-[#FF9A56] font-bold tracking-wide">#TEAMSQUAD</span>
          </div>
          <div className="flex items-center gap-4 text-stone-500 text-[11px]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Canteen Hygiene Certified</span>
            <span>·</span>
            <span>FSSAI Lic. #1289402910</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
