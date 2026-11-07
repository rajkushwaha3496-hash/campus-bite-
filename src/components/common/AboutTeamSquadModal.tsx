import React from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Code2, 
  Database, 
  Server, 
  Smartphone, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const AboutTeamSquadModal: React.FC = () => {
  const { isPresentationOpen, setIsPresentationOpen } = useCampusBite();

  if (!isPresentationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E4] text-[#F07832] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Project Presentation</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
              Campus<span className="text-[#F07832]">Bite</span>
            </h2>
            <p className="text-sm font-semibold text-[#FF9A56]">
              Your Campus. Your Food. Your Way.
            </p>
          </div>
          <button 
            onClick={() => setIsPresentationOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            aria-label="Close presentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Developed by #TEAMSQUAD Badge */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FF9A56] uppercase tracking-wider">
              Engineering Team
            </span>
            <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-stone-300">
              College Canteen Capstone
            </span>
          </div>
          <h3 className="font-heading font-extrabold text-xl text-white">
            Designed & Developed by #TEAMSQUAD
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            A specialized student-led full-stack team focused on solving university campus logistics bottlenecks, queue waiting friction, and food waste reduction.
          </p>
        </div>

        {/* The Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100 space-y-1.5">
            <h4 className="font-heading font-bold text-red-900 text-sm">The Campus Problem:</h4>
            <ul className="space-y-1 text-red-800 list-disc list-inside">
              <li>25–40 minute rush hour queues during short lecture breaks.</li>
              <li>Students arriving only to find their favorite dishes sold out.</li>
              <li>No delivery options to hostel blocks during study sessions.</li>
              <li>Difficulty tailoring spice level or allergen exclusions.</li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1.5">
            <h4 className="font-heading font-bold text-emerald-900 text-sm">The CampusBite Solution:</h4>
            <ul className="space-y-1 text-emerald-800 list-disc list-inside">
              <li>Pre-book food in advance with 10-15 minute kitchen prep sync.</li>
              <li>Deep meal customization (spice, extra cheese, toppings, no onions).</li>
              <li>Hostel room doorstep delivery with time-slot management.</li>
              <li>Express pickup counter with digital QR code verification.</li>
            </ul>
          </div>
        </div>

        {/* 4 Role Architecture */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-stone-900">
            Four Role-Based Unified Workflows
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-center">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-[#F07832] block">1. Student</span>
              <span className="text-[10px] text-stone-500">Menu, Cart, Address, Tracker</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-blue-600 block">2. Admin</span>
              <span className="text-[10px] text-stone-500">Menu, Stock, Slots, Analytics</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-amber-600 block">3. Kitchen Staff</span>
              <span className="text-[10px] text-stone-500">Live KDS tickets & cooking steps</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-[#16A36A] block">4. Delivery Runner</span>
              <span className="text-[10px] text-stone-500">Hostel room delivery & PIN verify</span>
            </div>
          </div>
        </div>

        {/* Technical Architecture Stack */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-stone-900">
            System Architecture & Tech Stack
          </h4>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold">Frontend Framework</span>
                <p className="font-semibold text-stone-800">React 19 + TypeScript + Vite</p>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold">Styling System</span>
                <p className="font-semibold text-stone-800">Tailwind CSS v4 + Poppins/Inter</p>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold">State & Sync</span>
                <p className="font-semibold text-stone-800">CampusBite Context & Local Storage</p>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold">Audio Engine</span>
                <p className="font-semibold text-stone-800">Web Audio API Synthesized Chimes</p>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold">Fulfillment Flow</span>
                <p className="font-semibold text-stone-800">Counter QR & Hostel PIN Verify</p>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold">Target Cloud DB</span>
                <p className="font-semibold text-stone-800">Supabase PostgreSQL Schema</p>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features Roadmap (Distinguishing Working vs Planned per Requirement 13) */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-stone-900">
            Feature Readiness & Roadmap (Requirement 13)
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-950">Active & Working Features in Application:</p>
                <p className="text-emerald-800 text-[11px]">
                  Menu pre-booking, multi-attribute recipe customization, pickup vs hostel delivery slot engine, 5-stage visual order tracker, live KDS kitchen tickets, runner PIN verification, address manager, and wallet balances.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-blue-50 rounded-xl border border-blue-200">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-950">Planned Advanced Integrations:</p>
                <p className="text-blue-800 text-[11px]">
                  • <strong>AI-Based Food Recommendations:</strong> Personalized nutrient/calorie suggestions based on exam schedules.<br />
                  • <strong>Smart Demand Prediction:</strong> Machine learning forecasting for canteen inventory.<br />
                  • <strong>Real-time UPI Gateway:</strong> Direct Razorpay/Paytm webhook synchronization.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600">
            Developed by #TEAMSQUAD
          </span>
          <button
            onClick={() => setIsPresentationOpen(false)}
            className="px-5 py-2.5 bg-[#F07832] text-white rounded-xl text-xs font-semibold hover:bg-[#e06b25] transition-colors"
          >
            Back to Application
          </button>
        </div>

      </div>
    </div>
  );
};
