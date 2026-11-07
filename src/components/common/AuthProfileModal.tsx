import React, { useState } from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { 
  X, 
  User, 
  Wallet, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Mail, 
  GraduationCap, 
  Building,
  ShieldCheck,
  CreditCard,
  Plus
} from 'lucide-react';

export const AuthProfileModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    user, 
    updateUser, 
    topUpWallet, 
    addToast 
  } = useCampusBite();

  const [activeTab, setActiveTab] = useState<'profile' | 'wallet'>('profile');
  
  // Profile edit fields
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phoneNumber || '+91 98765 43210');
  const [studentId, setStudentId] = useState(user.studentIdNumber || '2024CS084');
  const [department, setDepartment] = useState(user.department || 'Computer Science & Engineering (3rd Year)');

  // Top up amount
  const [topUpAmount, setTopUpAmount] = useState<number>(250);

  if (!isAuthModalOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      phoneNumber: phone,
      studentIdNumber: studentId,
      department
    });
    addToast('Student profile details updated', 'success');
  };

  const handleWalletRecharge = () => {
    topUpWallet(topUpAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col justify-between animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-[#FFF9F3]">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#F07832] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>CampusBite by #TEAMSQUAD</span>
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-900 mt-0.5">
              Student Account & Wallet
            </h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 flex gap-2 border-b border-stone-100 bg-[#FFF9F3]/40">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'profile' ? 'border-[#F07832] text-[#F07832]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Student Profile
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1 ${
              activeTab === 'wallet' ? 'border-[#F07832] text-[#F07832]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Campus Wallet (₹{user.walletBalance})</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Student Full Name</label>
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
                  <label className="font-semibold text-stone-800">Student Roll / ID</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Campus Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Department / Batch</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#F07832]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#F07832] hover:bg-[#e06b25] text-white font-semibold rounded-xl transition-colors shadow-xs"
              >
                Save Student Profile
              </button>
            </form>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-5">
              
              {/* Balance card */}
              <div className="bg-gradient-to-br from-[#F07832] to-[#FF9A56] p-5 rounded-2xl text-white shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                    Campus Student Meal Pass
                  </span>
                  <Wallet className="w-5 h-5 text-white/90" />
                </div>
                <div>
                  <span className="text-[10px] text-white/80 block">Current Available Balance</span>
                  <div className="font-heading font-black text-3xl tabular-nums">
                    ₹{user.walletBalance}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/90 pt-1 border-t border-white/20">
                  <span>Linked to ID: {user.studentIdNumber}</span>
                  <span>1-Click Pre-Book Ready</span>
                </div>
              </div>

              {/* Quick Recharge Amount */}
              <div className="space-y-3">
                <label className="font-semibold text-stone-800 block">
                  Select Quick Top-Up Amount
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                  {[100, 250, 500].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`p-2.5 rounded-xl border font-heading font-bold text-xs transition-all ${
                        topUpAmount === amt 
                          ? 'border-[#F07832] bg-[#FFF0E4] text-[#F07832]' 
                          : 'border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    min={10}
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    placeholder="Custom amount"
                    className="flex-1 p-2.5 rounded-xl border border-stone-200 outline-none text-xs"
                  />
                  <button
                    onClick={handleWalletRecharge}
                    className="px-4 py-2.5 bg-[#16A36A] hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Recharge via UPI</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-[11px] text-stone-500 space-y-1">
                <p className="font-bold text-stone-700">Wallet Benefits:</p>
                <p>• Zero transaction failures during peak lunch rush.</p>
                <p>• Automatic instant refund if an item is sold out.</p>
              </div>

            </div>
          )}

        </div>

        {/* Footer branding */}
        <div className="p-4 border-t border-stone-100 bg-[#FFF9F3] text-center text-[11px] text-stone-400">
          CampusBite · Developed by <strong className="text-stone-600">#TEAMSQUAD</strong>
        </div>

      </div>
    </div>
  );
};
