import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { POSView } from './components/POSView';
import { KDSView } from './components/KDSView';
import { InventoryView } from './components/InventoryView';
import { FloorView } from './components/FloorView';
import { AnalyticsView } from './components/AnalyticsView';
import { HotkeyModal } from './components/HotkeyModal';
import { DemoTourModal } from './components/DemoTourModal';
import { useRestaurantStore } from './store/useRestaurantStore';
import { useHotkeys } from './hooks/useHotkeys';
import { useSimulation } from './hooks/useSimulation';

export default function App() {
  useSimulation();

  const {
    currentView,
    setView,
    toggleHotkeyModal,
    clearCart
  } = useRestaurantStore();

  // Register Global Navigation Hotkeys
  useHotkeys([
    {
      key: '1',
      altKey: true,
      action: () => setView('POS'),
      desc: 'Go to POS'
    },
    {
      key: '2',
      altKey: true,
      action: () => setView('KDS'),
      desc: 'Go to KDS'
    },
    {
      key: '3',
      altKey: true,
      action: () => setView('INVENTORY'),
      desc: 'Go to Inventory'
    },
    {
      key: '4',
      altKey: true,
      action: () => setView('FLOOR'),
      desc: 'Go to Floor Plan'
    },
    {
      key: '5',
      altKey: true,
      action: () => setView('ANALYTICS'),
      desc: 'Go to Analytics'
    },
    {
      key: 'n',
      altKey: true,
      action: () => {
        setView('POS');
        clearCart();
      },
      desc: 'New Order'
    },
    {
      key: '?',
      shiftKey: true,
      action: () => toggleHotkeyModal(),
      desc: 'Toggle Hotkeys Cheat Sheet'
    },
    {
      key: 'F1',
      action: () => toggleHotkeyModal(),
      desc: 'Toggle Hotkeys Cheat Sheet'
    }
  ]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <Header />

        {/* View Router */}
        <main className="flex-1 flex overflow-hidden relative">
          {currentView === 'POS' && <POSView />}
          {currentView === 'KDS' && <KDSView />}
          {currentView === 'INVENTORY' && <InventoryView />}
          {currentView === 'FLOOR' && <FloorView />}
          {currentView === 'ANALYTICS' && <AnalyticsView />}
        </main>
      </div>

      {/* Global Hotkey Dialog Helper */}
      <HotkeyModal />

      {/* Hands-On Customer Demo Tour Guide Modal */}
      <DemoTourModal />
    </div>
  );
}
