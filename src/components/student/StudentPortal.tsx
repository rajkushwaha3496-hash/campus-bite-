import React, { useState, useMemo } from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { HeroSection } from './HeroSection';
import { CategoryChips } from './CategoryChips';
import { FoodCard } from './FoodCard';
import { OrderTracker } from './OrderTracker';
import { SavedAddressesView } from './SavedAddressesView';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Flame, 
  Star, 
  ArrowRight, 
  Clock, 
  Filter,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { MenuItem } from '../../types';

export const StudentPortal: React.FC = () => {
  const { 
    studentView, 
    setStudentView, 
    menuItems, 
    orders, 
    setTrackedOrderId, 
    setIsPresentationOpen 
  } = useCampusBite();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegOnlyFilter, setVegOnlyFilter] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'priceAsc' | 'priceDesc' | 'rating' | 'prepTime'>('popularity');

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    menuItems.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [menuItems]);

  // Filtered menu
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesVeg = !vegOnlyFilter || item.isVeg;
      return matchesSearch && matchesCategory && matchesVeg;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'prepTime') return a.prepTimeMinutes - b.prepTimeMinutes;
      return (b.ratingCount || 0) - (a.ratingCount || 0); // default popularity
    });
  }, [menuItems, searchQuery, selectedCategory, vegOnlyFilter, sortBy]);

  // Curation collections
  const todaySpecials = useMemo(() => menuItems.filter(i => i.isSpecial), [menuItems]);
  const popularDishes = useMemo(() => menuItems.filter(i => i.isPopular), [menuItems]);
  const recommendedDishes = useMemo(() => menuItems.filter(i => i.isRecommended), [menuItems]);

  // Subview routing
  if (studentView === 'orders' || studentView === 'track') {
    return <OrderTracker />;
  }

  if (studentView === 'addresses') {
    return <SavedAddressesView />;
  }

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Hero Section (shown on Home view) */}
      {studentView === 'home' && <HeroSection />}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-4">
        
        {/* Search, Filter Bar & Sort Controls */}
        <section className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search canteen dishes, rolls, dosa, combos, cold coffee..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#F07832] transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Veg Only Toggle */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                  vegOnlyFilter 
                    ? 'bg-green-50 border-green-300 text-green-800' 
                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                <div className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center rounded-[3px]">
                  <div className={`w-2 h-2 rounded-full ${vegOnlyFilter ? 'bg-green-600' : 'bg-transparent'}`} />
                </div>
                <span>Veg Only</span>
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort dishes"
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white text-stone-800 outline-none focus:border-[#F07832]"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="prepTime">Fastest Prep Time</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Quick Category Chips with 3 per row on mobile */}
          <CategoryChips
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            categoryCounts={categoryCounts}
          />
        </section>

        {/* 2. Today's Special Section (If on Home view and no search active) */}
        {studentView === 'home' && !searchQuery && selectedCategory === 'All' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFF0E4] text-[#F07832] flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-[#F07832]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#242424]">
                    Today's Canteen Specials
                  </h3>
                  <p className="text-xs text-stone-500">Chef curated campus meals freshly prepared right now</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCategory('Combos')}
                className="text-xs font-semibold text-[#F07832] hover:underline flex items-center gap-1"
              >
                <span>View Combos</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {todaySpecials.slice(0, 3).map(item => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* 3. Popular Food Items Section (If on Home view and no search active) */}
        {studentView === 'home' && !searchQuery && selectedCategory === 'All' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#242424]">
                    Popular Campus Favorites
                  </h3>
                  <p className="text-xs text-stone-500">Highest rated dishes ordered by university students</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularDishes.slice(0, 3).map(item => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Complete Food Menu (or filtered search results) */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-[#242424]">
                {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === 'All' ? 'Complete Canteen Menu' : `${selectedCategory} Menu`}
              </h3>
              <p className="text-xs text-stone-500">
                Found {filteredItems.length} dishes available for pre-booking
              </p>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-sm text-stone-900">No matching food items</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We couldn't find any dishes matching your query. Try resetting filters or searching for "burger", "dosa", or "paneer".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setVegOnlyFilter(false);
                }}
                className="px-4 py-2 bg-[#F07832] text-white rounded-xl text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map(item => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* 5. Special Offers Strip */}
        <section className="bg-gradient-to-r from-[#F07832] to-[#FF9A56] rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
              Hostel Night Owl Special
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Midnight Exam Craving? Night Canteen Open Till 11:30 PM!
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl">
              Pre-book your late night hot cheese pizza or rolls with free delivery to all hostel blocks (H-1 to H-6 and GH-1 to GH-3).
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('Fast Food');
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl bg-white text-[#F07832] font-bold text-xs sm:text-sm hover:bg-stone-50 transition-colors shadow-md whitespace-nowrap"
          >
            Order Night Snacks
          </button>
        </section>

        {/* 6. Recent Orders Preview Section */}
        {orders.length > 0 && (
          <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F07832]" />
                <h4 className="font-heading font-bold text-base text-stone-900">
                  Your Recent Campus Orders
                </h4>
              </div>
              <button
                onClick={() => setStudentView('orders')}
                className="text-xs font-semibold text-[#F07832] hover:underline"
              >
                View All & Track
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {orders.slice(0, 3).map(order => (
                <div
                  key={order.id}
                  onClick={() => {
                    setTrackedOrderId(order.id);
                    setStudentView('track');
                  }}
                  className="p-3.5 rounded-xl border border-stone-200 hover:border-[#F07832]/50 hover:bg-[#FFF9F3] cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-stone-900">
                      #{order.orderNumber}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      order.status === 'delivered' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-[#FFF0E4] text-[#F07832]'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-1">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                    <span>{order.type === 'pickup' ? 'Counter Pickup' : 'Hostel Delivery'}</span>
                    <span className="font-bold text-stone-900 tabular-nums">₹{order.finalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
};
