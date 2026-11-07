import React, { useState } from 'react';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  Key, 
  Server, 
  Sparkles, 
  ShieldCheck,
  Terminal,
  Layers
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'sql'>('guide');
  const configured = isSupabaseConfigured();

  if (!isOpen) return null;

  const sqlSchema = `-- ====================================================================
-- CampusBite - Supabase PostgreSQL Schema
-- Developed by #TEAMSQUAD
-- "Your Campus. Your Food. Your Way."
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Food Items Table
CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    is_veg BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 2) DEFAULT 4.80,
    rating_count INT DEFAULT 1,
    prep_time_minutes INT DEFAULT 10,
    description TEXT,
    image_url TEXT,
    is_special BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Hostel Addresses Table
CREATE TABLE IF NOT EXISTS public.hostel_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    label TEXT NOT NULL,
    hostel_name TEXT NOT NULL,
    building_name TEXT NOT NULL,
    block TEXT NOT NULL,
    floor_number TEXT NOT NULL,
    room_number TEXT NOT NULL,
    student_phone_number TEXT NOT NULL,
    delivery_instructions TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'pickup' or 'delivery'
    status TEXT DEFAULT 'placed',
    item_total NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    promo_code_applied TEXT,
    final_amount NUMERIC(10, 2) NOT NULL,
    student_name TEXT NOT NULL,
    student_phone TEXT NOT NULL,
    student_id TEXT NOT NULL,
    delivery_slot TEXT,
    delivery_pin TEXT,
    pickup_slot TEXT,
    pickup_counter TEXT,
    pickup_qr_code TEXT,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'Paid',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Delivery Slots Table
CREATE TABLE IF NOT EXISTS public.delivery_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    time_window TEXT NOT NULL,
    slot_type TEXT NOT NULL,
    max_capacity INT DEFAULT 35,
    booked_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for food items" ON public.food_items FOR SELECT USING (true);
CREATE POLICY "Allow public read for orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public read for addresses" ON public.hostel_addresses FOR ALL USING (true);

-- 7. Seed Initial Canteen Menu
INSERT INTO public.food_items (name, category, price, is_veg, is_available, description, is_special) VALUES
('Campus Jumbo Burger Combo', 'Combos', 189, false, true, 'Toasted burger with peri peri fries & cold drink', true),
('Butter Paneer Tikka Kathi Roll', 'Snacks', 135, true, true, 'Smoky paneer cubes in flaky butter paratha', false),
('Crispy Mysore Masala Dosa', 'Breakfast', 95, true, true, 'Golden dosa with potato masala & fresh coconut chutney', true),
('Cheesy Veggie Delight Pan Pizza', 'Fast Food', 199, true, true, '100% mozzarella cheese pan pizza with bell peppers', true),
('Campus Artisan Cold Coffee & Brownie', 'Beverages', 110, true, true, 'Chilled frothy cold coffee with chocolate fudge brownie', true);
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col justify-between animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-[#FFF9F3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base text-stone-900">
                  Supabase Database Integration
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  configured 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {configured ? '● Connected' : 'Demo Mode (Local)'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                CampusBite PostgreSQL Cloud Sync by #TEAMSQUAD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 flex gap-2 border-b border-stone-100 bg-[#FFF9F3]/40">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'guide' ? 'border-[#F07832] text-[#F07832]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Step-by-Step Setup Guide (Hindi / English)
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sql' ? 'border-[#F07832] text-[#F07832]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Ready SQL Schema (1-Click Copy)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-stone-700">
          
          {activeTab === 'guide' && (
            <div className="space-y-5">
              
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 leading-relaxed">
                <strong>Supabase क्या है?</strong> Supabase एक फ्री क्लाउड PostgreSQL डेटाबेस है। जब आप इसे जोड़ेंगे, तो आपके सभी Canteen Food Items, Orders और Hostel Addresses सीधे क्लाउड में सेव होंगे।
              </div>

              {/* 4 Clear Steps */}
              <div className="space-y-4">
                
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F07832] text-white flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="font-heading font-bold text-stone-900 text-sm">
                      Supabase पर फ्री प्रोजेक्ट बनाएं
                    </p>
                    <p className="text-stone-600">
                      <a 
                        href="https://supabase.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[#F07832] font-semibold underline inline-flex items-center gap-1"
                      >
                        supabase.com <ExternalLink className="w-3 h-3" />
                      </a> पर जाएं, लॉगिन करें और <strong>"New Project"</strong> पर क्लिक करें। अपने प्रोजेक्ट का नाम <strong>CampusBite</strong> रखें और पासवर्ड सेट करें।
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F07832] text-white flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="font-heading font-bold text-stone-900 text-sm">
                      SQL Editor में Schema Run करें
                    </p>
                    <p className="text-stone-600">
                      Supabase डैशबोर्ड में बाईं तरफ <strong>SQL Editor</strong> पर क्लिक करें। ऊपर दिए गए <strong>"Ready SQL Schema"</strong> टैब से कोड कॉपी करके पेस्ट करें और <strong>RUN</strong> बटन दबाएं।
                    </p>
                    <button
                      onClick={() => setActiveTab('sql')}
                      className="mt-1 text-xs font-semibold text-[#F07832] hover:underline"
                    >
                      → SQL Schema देखें और कॉपी करें
                    </button>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F07832] text-white flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="font-heading font-bold text-stone-900 text-sm">
                      API Keys कॉपी करें
                    </p>
                    <p className="text-stone-600">
                      प्रोजेक्ट सेटिंग्स में जाएं: <strong>Project Settings $\to$ API</strong>।
                    </p>
                    <ul className="list-disc list-inside text-stone-600 space-y-0.5 pl-1">
                      <li><strong>Project URL</strong> (उदा. <code className="bg-stone-100 px-1 py-0.5 rounded">https://xyz.supabase.co</code>)</li>
                      <li><strong>anon public key</strong> (लंबा टोकन)</li>
                    </ul>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F07832] text-white flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                    4
                  </div>
                  <div className="space-y-1">
                    <p className="font-heading font-bold text-stone-900 text-sm">
                      Environment Variables सेट करें
                    </p>
                    <p className="text-stone-600">
                      प्रोजेक्ट की <strong>.env</strong> फाइल में अपनी वैल्यूज पेस्ट कर दें:
                    </p>
                    <div className="p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
                      <p><span className="text-[#FF9A56]">VITE_SUPABASE_URL</span>="https://your-project.supabase.co"</p>
                      <p><span className="text-[#FF9A56]">VITE_SUPABASE_ANON_KEY</span>="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Status Note */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600">
                <strong>नोट:</strong> अगर आप Supabase नहीं भी जोड़ते, तब भी CampusBite अपने इनबिल्ट <strong>Local Storage Engine</strong> पर 100% स्मूथली काम करता रहेगा!
              </div>

            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800">PostgreSQL Table Creation Script</span>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-[#F07832] hover:bg-[#e06b25] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-stone-900 text-emerald-400 rounded-xl font-mono text-[11px] max-h-80 overflow-y-auto leading-relaxed border border-stone-800">
                  {sqlSchema}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-[#FFF9F3] flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Developed by <strong>#TEAMSQUAD</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
