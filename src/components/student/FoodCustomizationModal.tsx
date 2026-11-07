import React, { useState, useEffect } from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { CustomizationOptions } from '../../types';
import { 
  X, 
  Flame, 
  Check, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles,
  Info
} from 'lucide-react';

export const FoodCustomizationModal: React.FC = () => {
  const { customizingItem, setCustomizingItem, addToCart } = useCampusBite();

  const [quantity, setQuantity] = useState<number>(1);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Spicy' | 'Extra Fiery'>('Medium');
  const [extraCheese, setExtraCheese] = useState<boolean>(false);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Reset states when item changes
  useEffect(() => {
    if (customizingItem) {
      setQuantity(1);
      setSpiceLevel('Medium');
      setExtraCheese(false);
      setSelectedToppings([]);
      setRemovedIngredients([]);
      setSpecialInstructions('');
    }
  }, [customizingItem]);

  if (!customizingItem) return null;

  // Calculate dynamic unit price
  let unitPrice = customizingItem.price;
  if (extraCheese) unitPrice += 25;
  if (selectedToppings.length > 0) {
    unitPrice += selectedToppings.length * 20;
  }
  const calculatedTotal = unitPrice * quantity;

  const toggleTopping = (toppingName: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingName) 
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const toggleRemovedIngredient = (ingredient: string) => {
    setRemovedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleAddCustomizedToCart = () => {
    const customization: CustomizationOptions = {
      spiceLevel,
      extraCheese,
      extraToppings: selectedToppings,
      removedIngredients,
      specialInstructions: specialInstructions.trim()
    };
    addToCart(customizingItem, customization, quantity);
    setCustomizingItem(null);
  };

  const spiceOptions: { level: 'Mild' | 'Medium' | 'Spicy' | 'Extra Fiery'; color: string; desc: string }[] = [
    { level: 'Mild', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', desc: 'No chillies, gentle flavor' },
    { level: 'Medium', color: 'text-amber-600 bg-amber-50 border-amber-200', desc: 'Balanced canteen standard' },
    { level: 'Spicy', color: 'text-orange-600 bg-orange-50 border-orange-200', desc: 'Extra green chillies & pepper' },
    { level: 'Extra Fiery', color: 'text-red-600 bg-red-50 border-red-200', desc: 'Desi fiery tadka heat' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customization-title"
      >
        
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FFF9F3]">
          <div className="pr-8">
            <span className="text-[11px] font-bold text-[#F07832] uppercase tracking-wider">
              Meal Customization
            </span>
            <h3 id="customization-title" className="font-heading font-bold text-lg text-[#242424] leading-tight">
              {customizingItem.name}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Base Price: ₹{customizingItem.price} · Prepared Fresh
            </p>
          </div>
          <button
            onClick={() => setCustomizingItem(null)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm divide-y divide-stone-100">
          
          {/* 1. Spice Level Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-heading font-semibold text-stone-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#F07832]" />
                <span>Choose Spice Level</span>
              </label>
              <span className="text-xs text-stone-500">Required</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {spiceOptions.map(opt => (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => setSpiceLevel(opt.level)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    spiceLevel === opt.level
                      ? 'border-[#F07832] bg-[#FFF0E4] shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-stone-900">{opt.level}</span>
                    {spiceLevel === opt.level && <Check className="w-3.5 h-3.5 text-[#F07832]" />}
                  </div>
                  <span className="text-[10px] text-stone-500 block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Extra Cheese Add-on */}
          <div className="pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-heading font-semibold text-stone-900">
                Extra Cheese Upgrade
              </label>
              <span className="text-xs text-stone-500">+₹25 per item</span>
            </div>

            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              extraCheese 
                ? 'border-[#F07832] bg-[#FFF0E4]' 
                : 'border-stone-200 hover:border-stone-300 bg-white'
            }`}>
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={extraCheese}
                  onChange={(e) => setExtraCheese(e.target.checked)}
                  className="w-4 h-4 text-[#F07832] rounded focus:ring-[#F07832]"
                />
                <div>
                  <span className="font-semibold text-xs text-stone-900">Melted Amul Mozzarella / Cheese Slice</span>
                  <p className="text-[10px] text-stone-500">Generous hot melted cheese layer</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#F07832] tabular-nums">+₹25</span>
            </label>
          </div>

          {/* 3. Extra Toppings */}
          {customizingItem.availableToppings && customizingItem.availableToppings.length > 0 && (
            <div className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-heading font-semibold text-stone-900">
                  Add Extra Toppings & Upgrades
                </label>
                <span className="text-xs text-stone-500">Optional</span>
              </div>

              <div className="space-y-2">
                {customizingItem.availableToppings.map(topping => {
                  const isChecked = selectedToppings.includes(topping.name);
                  return (
                    <label 
                      key={topping.name}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'border-[#F07832] bg-[#FFF0E4]' 
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTopping(topping.name)}
                          className="w-4 h-4 text-[#F07832] rounded focus:ring-[#F07832]"
                        />
                        <span className="text-xs font-medium text-stone-800">{topping.name}</span>
                      </div>
                      <span className="text-xs font-bold text-stone-900 tabular-nums">
                        +₹{topping.price}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Remove Ingredients (Student dietary preferences) */}
          {customizingItem.removableIngredients && customizingItem.removableIngredients.length > 0 && (
            <div className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-heading font-semibold text-stone-900">
                  Remove Ingredients / Allergies
                </label>
                <span className="text-xs text-stone-500">Free custom request</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {customizingItem.removableIngredients.map(ing => {
                  const isRemoved = removedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => toggleRemovedIngredient(ing)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                        isRemoved 
                          ? 'bg-red-50 border-red-300 text-red-700 font-semibold' 
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span>{isRemoved ? `✕ No ${ing}` : `Remove ${ing}`}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Special Cooking Instructions */}
          <div className="pt-5 space-y-2">
            <label className="font-heading font-semibold text-stone-900 flex items-center justify-between">
              <span>Chef Notes & Instructions</span>
              <span className="text-[11px] text-stone-400">Optional</span>
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Make it extra crisp, keep chutney in separate cup, less salt..."
              className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:border-[#F07832] focus:ring-1 focus:ring-[#F07832] outline-none"
            />
          </div>

        </div>

        {/* Footer with Dynamic Price & Add Action */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FFF9F3] flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-heading font-bold text-sm w-6 text-center tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Total and Add Button */}
          <button
            onClick={handleAddCustomizedToCart}
            className="flex-1 px-5 py-3 rounded-xl bg-[#F07832] hover:bg-[#e06b25] text-white font-semibold text-xs sm:text-sm flex items-center justify-between shadow-md shadow-[#F07832]/20 transition-all active:scale-98"
          >
            <span>Add Customized to Tray</span>
            <span className="font-heading font-bold tabular-nums bg-white/20 px-2 py-0.5 rounded-md">
              ₹{calculatedTotal}
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};
