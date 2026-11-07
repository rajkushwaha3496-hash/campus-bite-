/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CampusBiteProvider, useCampusBite } from './context/CampusBiteContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { StudentPortal } from './components/student/StudentPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { KitchenDashboard } from './components/kitchen/KitchenDashboard';
import { DeliveryDashboard } from './components/delivery/DeliveryDashboard';
import { CartDrawer } from './components/student/CartDrawer';
import { FoodCustomizationModal } from './components/student/FoodCustomizationModal';
import { AuthProfileModal } from './components/common/AuthProfileModal';
import { AboutTeamSquadModal } from './components/common/AboutTeamSquadModal';
import { SupabaseModal } from './components/common/SupabaseModal';

const MainLayout: React.FC = () => {
  const { role, isSupabaseModalOpen, setIsSupabaseModalOpen } = useCampusBite();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F3] text-[#242424] antialiased">
      {/* Top Navigation Bar with Role Switcher */}
      <Navbar />

      {/* Main Role-Based Content Area */}
      <main className="flex-1">
        {role === 'student' && <StudentPortal />}
        {role === 'admin' && <AdminDashboard />}
        {role === 'kitchen' && <KitchenDashboard />}
        {role === 'delivery' && <DeliveryDashboard />}
      </main>

      {/* Modals & Overlays */}
      <CartDrawer />
      <FoodCustomizationModal />
      <AuthProfileModal />
      <AboutTeamSquadModal />
      <SupabaseModal isOpen={isSupabaseModalOpen} onClose={() => setIsSupabaseModalOpen(false)} />
      <ToastContainer />

      {/* Footer with #TEAMSQUAD Branding */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <CampusBiteProvider>
      <MainLayout />
    </CampusBiteProvider>
  );
}
