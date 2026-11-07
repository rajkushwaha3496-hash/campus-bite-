import React from 'react';
import { FoodCategory } from '../../types';
import { 
  Coffee, 
  UtensilsCrossed, 
  Cookie, 
  Pizza, 
  CupSoda, 
  CakeSlice, 
  Sparkles,
  Layers
} from 'lucide-react';

interface CategoryChipsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export const CATEGORIES_CONFIG: { id: string; name: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'All', name: 'All Dishes', icon: Layers },
  { id: 'Breakfast', name: 'Breakfast', icon: Coffee },
  { id: 'Lunch', name: 'Lunch', icon: UtensilsCrossed },
  { id: 'Snacks', name: 'Snacks', icon: Cookie },
  { id: 'Fast Food', name: 'Fast Food', icon: Pizza },
  { id: 'Beverages', name: 'Beverages', icon: CupSoda },
  { id: 'Desserts', name: 'Desserts', icon: CakeSlice },
  { id: 'Combos', name: 'Combos', icon: Sparkles }
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts
}) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg sm:text-xl text-[#242424]">
          Explore Food Categories
        </h3>
        <span className="text-xs text-stone-500">
          Showing {selectedCategory === 'All' ? 'All Items' : selectedCategory}
        </span>
      </div>

      {/* Grid: 3 per row on mobile screens (grid-cols-3) to fulfill prompt requirement! */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
        {CATEGORIES_CONFIG.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'All' 
            ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
            : (categoryCounts[cat.id] || 0);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center text-center p-2.5 sm:p-3 rounded-xl border transition-all active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-b from-[#FFF0E4] to-white border-[#F07832] shadow-sm text-[#F07832]'
                  : 'bg-white border-stone-200/90 text-stone-700 hover:border-[#F07832]/40 hover:bg-[#FFF9F3]'
              }`}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-1.5 transition-colors ${
                isSelected ? 'bg-[#F07832] text-white shadow-xs' : 'bg-stone-100 text-stone-600'
              }`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-heading font-medium text-[11px] sm:text-xs truncate w-full">
                {cat.name}
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5">
                {count} items
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
