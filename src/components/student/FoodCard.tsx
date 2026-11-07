import React from 'react';
import { MenuItem } from '../../types';
import { Star, Clock, SlidersHorizontal, Plus, Check } from 'lucide-react';
import { useCampusBite } from '../../context/CampusBiteContext';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addToCart, setCustomizingItem, cart } = useCampusBite();

  // Check if item is already in cart
  const inCartQuantity = cart
    .filter(c => c.menuItem.id === item.id)
    .reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className={`group flex flex-col bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
      item.isAvailable 
        ? 'border-stone-200 hover:border-[#F07832]/40' 
        : 'border-stone-200 opacity-75'
    }`}>
      
      {/* Food Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback gradient if path fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Veg / Non-Veg Indicator (Standard Indian Canteen Emblem) */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs border border-stone-200/80">
          <div 
            className={`w-3.5 h-3.5 border flex items-center justify-center rounded-[3px] ${
              item.isVeg ? 'border-green-600' : 'border-red-600'
            }`}
            title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div 
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? 'bg-green-600' : 'bg-red-600'
              }`}
            />
          </div>
        </div>

        {/* Availability Badge */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-semibold text-xs px-3 py-1 rounded-full shadow-md">
              Sold Out / Out of Stock
            </span>
          </div>
        )}

        {/* Rating and Prep Time Badges */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xs text-xs font-semibold px-2 py-0.5 rounded-md shadow-xs text-stone-800">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
            <span className="text-stone-400 text-[10px]">({item.ratingCount})</span>
          </div>

          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xs text-xs font-medium px-2 py-0.5 rounded-md shadow-xs text-stone-700">
            <Clock className="w-3 h-3 text-[#F07832]" />
            <span>{item.prepTimeMinutes}m</span>
          </div>
        </div>

        {/* Special tag */}
        {item.isSpecial && (
          <div className="absolute top-2.5 right-2.5 bg-[#F07832] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
            Special
          </div>
        )}
      </div>

      {/* Food Details & Actions */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-heading font-semibold text-sm sm:text-base text-[#242424] leading-snug line-clamp-1 group-hover:text-[#F07832] transition-colors">
              {item.name}
            </h4>
          </div>

          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-bold text-base sm:text-lg text-[#242424] tabular-nums">
              ₹{item.price}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          {/* Action Buttons: Customize & Add */}
          <div className="flex items-center gap-1.5">
            {/* Customize button */}
            <button
              onClick={() => setCustomizingItem(item)}
              disabled={!item.isAvailable}
              className="px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-[#F07832] hover:bg-[#FFF9F3] text-stone-700 hover:text-[#F07832] text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Customize spice, toppings, cheese, ingredients"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#F07832]" />
              <span className="hidden sm:inline">Customize</span>
            </button>

            {/* Quick Add Button */}
            <button
              onClick={() => addToCart(item)}
              disabled={!item.isAvailable}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                inCartQuantity > 0
                  ? 'bg-[#16A36A] hover:bg-emerald-700 text-white'
                  : 'bg-[#F07832] hover:bg-[#e06b25] text-white shadow-xs'
              }`}
            >
              {inCartQuantity > 0 ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>({inCartQuantity})</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
