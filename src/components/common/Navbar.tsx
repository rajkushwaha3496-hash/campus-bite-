import React, { useState } from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  Clock, 
  Menu as MenuIcon, 
  X, 
  Wallet, 
  ChefHat, 
  ShieldCheck, 
  Bike, 
  Sparkles,
  ChevronDown,
  Database
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    user, 
    studentView, 
    setStudentView, 
    cartTotalCount, 
    setIsCartOpen,
    setIsAuthModalOpen,
    setIsPresentationOpen,
    setIsSupabaseModalOpen
  } = useCampusBite();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'menu' | 'addresses' | 'orders' | 'about') => {
    setStudentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F3]/95 backdrop-blur-md border-b border-[#F07832]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F07832] to-[#FF9A56] flex items-center justify-center text-white shadow-sm shadow-[#F07832]/25">
                <span className="font-heading font-black text-xl tracking-tight">CB</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#242424] leading-tight">
                  Campus<span className="text-[#F07832]">Bite</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-stone-500">
                  by #TEAMSQUAD
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Student Mode) */}
          {role === 'student' ? (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
              <button 
                onClick={() => handleNavClick('home')}
                className={`transition-colors hover:text-[#F07832] whitespace-nowrap ${studentView === 'home' ? 'text-[#F07832] font-semibold' : ''}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('menu')}
                className={`transition-colors hover:text-[#F07832] whitespace-nowrap ${studentView === 'menu' ? 'text-[#F07832] font-semibold' : ''}`}
              >
                Food Menu
              </button>
              <button 
                onClick={() => handleNavClick('orders')}
                className={`transition-colors hover:text-[#F07832] whitespace-nowrap ${studentView === 'orders' || studentView === 'track' ? 'text-[#F07832] font-semibold' : ''}`}
              >
                My Orders & Tracking
              </button>
              <button 
                onClick={() => handleNavClick('addresses')}
                className={`transition-colors hover:text-[#F07832] whitespace-nowrap ${studentView === 'addresses' ? 'text-[#F07832] font-semibold' : ''}`}
              >
                Hostel Addresses
              </button>
              <button 
                onClick={() => setIsPresentationOpen(true)}
                className="transition-colors text-[#F07832] hover:text-[#F07832]/80 flex items-center gap-1.5 whitespace-nowrap font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                #TEAMSQUAD
              </button>
              <button 
                onClick={() => setIsSupabaseModalOpen(true)}
                className="transition-colors text-emerald-700 hover:text-emerald-800 flex items-center gap-1 whitespace-nowrap font-semibold text-xs bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200"
                title="Connect Supabase Database"
              >
                <Database className="w-3 h-3 text-emerald-600" />
                <span>Supabase</span>
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <div className="text-xs text-stone-600 bg-white border border-stone-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16A36A]"></span>
                <span className="font-semibold text-stone-900">
                  {role === 'admin' ? 'Admin Portal' : role === 'kitchen' ? 'Kitchen KDS Active' : 'Delivery Dispatch Active'}
                </span>
              </div>
            </div>
          )}

          {/* Zone 3: Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Role Switcher Pill / Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-200 text-stone-800 hover:border-[#F07832]/50 hover:bg-[#FFF9F3] transition-all"
                title="Switch User Role to test different dashboards"
              >
                {role === 'student' && <User className="w-3.5 h-3.5 text-[#F07832]" />}
                {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
                {role === 'kitchen' && <ChefHat className="w-3.5 h-3.5 text-amber-600" />}
                {role === 'delivery' && <Bike className="w-3.5 h-3.5 text-[#16A36A]" />}
                <span className="capitalize hidden sm:inline">{role}</span>
                <span className="capitalize sm:hidden text-[11px]">{role}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isRoleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Switch View & Role</p>
                  </div>
                  <button
                    onClick={() => { setRole('student'); setIsRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FFF9F3] transition-colors ${role === 'student' ? 'text-[#F07832] font-semibold bg-[#FFF9F3]' : 'text-stone-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#F07832]" />
                      <div>
                        <div>Student Portal</div>
                        <div className="text-[10px] text-stone-400 font-normal">Pre-order, customize, track</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setRole('admin'); setIsRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FFF9F3] transition-colors ${role === 'admin' ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-stone-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <div>
                        <div>Admin Dashboard</div>
                        <div className="text-[10px] text-stone-400 font-normal">Menu, stock, slots, analytics</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setRole('kitchen'); setIsRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FFF9F3] transition-colors ${role === 'kitchen' ? 'text-amber-600 font-semibold bg-amber-50/50' : 'text-stone-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-amber-600" />
                      <div>
                        <div>Kitchen Staff (KDS)</div>
                        <div className="text-[10px] text-stone-400 font-normal">Live orders & cooking tickets</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setRole('delivery'); setIsRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FFF9F3] transition-colors ${role === 'delivery' ? 'text-[#16A36A] font-semibold bg-green-50/50' : 'text-stone-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-[#16A36A]" />
                      <div>
                        <div>Delivery Partner</div>
                        <div className="text-[10px] text-stone-400 font-normal">Hostel routes & order dispatch</div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Student Wallet indicator */}
            {role === 'student' && (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 hover:border-[#F07832]/40 rounded-lg text-xs font-medium text-stone-800 transition-colors"
                title="Campus Wallet Balance"
              >
                <Wallet className="w-3.5 h-3.5 text-[#F07832]" />
                <span>₹{user.walletBalance}</span>
              </button>
            )}

            {/* Cart Button */}
            {role === 'student' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center p-2.5 bg-[#F07832] hover:bg-[#e06b25] text-white rounded-xl shadow-sm shadow-[#F07832]/30 transition-transform active:scale-95"
                aria-label="Open food tray"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#242424] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FFF9F3]">
                    {cartTotalCount}
                  </span>
                )}
              </button>
            )}

            {/* User profile / login button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1.5"
              title="Student Profile & Settings"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">{user.name.split(' ')[0]}</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FFF9F3] border-b border-stone-200 px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2">
          {role === 'student' && (
            <div className="flex flex-col space-y-2 text-sm font-medium">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-left py-2 px-3 rounded-lg ${studentView === 'home' ? 'bg-[#F07832]/10 text-[#F07832] font-semibold' : 'text-stone-700'}`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('menu')}
                className={`text-left py-2 px-3 rounded-lg ${studentView === 'menu' ? 'bg-[#F07832]/10 text-[#F07832] font-semibold' : 'text-stone-700'}`}
              >
                Food Menu & Categories
              </button>
              <button
                onClick={() => handleNavClick('orders')}
                className={`text-left py-2 px-3 rounded-lg ${studentView === 'orders' || studentView === 'track' ? 'bg-[#F07832]/10 text-[#F07832] font-semibold' : 'text-stone-700'}`}
              >
                My Orders & Live Tracker
              </button>
              <button
                onClick={() => handleNavClick('addresses')}
                className={`text-left py-2 px-3 rounded-lg ${studentView === 'addresses' ? 'bg-[#F07832]/10 text-[#F07832] font-semibold' : 'text-stone-700'}`}
              >
                Saved Hostel Addresses
              </button>
              <button
                onClick={() => { setIsPresentationOpen(true); setIsMobileMenuOpen(false); }}
                className="text-left py-2 px-3 rounded-lg text-[#F07832] font-semibold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                About #TEAMSQUAD Project
              </button>
              <button
                onClick={() => { setIsSupabaseModalOpen(true); setIsMobileMenuOpen(false); }}
                className="text-left py-2 px-3 rounded-lg text-emerald-700 font-semibold flex items-center gap-2"
              >
                <Database className="w-4 h-4 text-emerald-600" />
                Connect Supabase Database
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Wallet className="w-3.5 h-3.5 text-[#F07832]" />
              <span>Campus Wallet: <strong>₹{user.walletBalance}</strong></span>
            </div>
            <button
              onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
              className="text-[#F07832] font-semibold"
            >
              Top Up / Profile
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
