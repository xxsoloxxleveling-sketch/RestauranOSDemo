import React, { useState, useEffect } from 'react';
import {
  Search,
  Zap,
  User,
  DollarSign,
  PlusCircle,
  Printer,
  Bell,
  Clock,
  Keyboard
} from 'lucide-react';
import { useRestaurantStore } from '../store/useRestaurantStore';

export const Header: React.FC = () => {
  const {
    currentView,
    searchQuery,
    setSearchQuery,
    activeServer,
    setActiveServer,
    toggleHotkeyModal,
    setView,
    clearCart,
    orders,
    isSimulationActive,
    toggleSimulation,
    simulateRandomOrder
  } = useRestaurantStore();

  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalTodaySales = orders
    .filter((o) => o.paid)
    .reduce((acc, o) => acc + o.total, 0);

  const viewTitles: Record<string, string> = {
    POS: 'Point of Sale (Terminal #01)',
    KDS: 'Kitchen Display System (KDS Live)',
    INVENTORY: 'Stock & Raw Ingredient Tracking',
    FLOOR: 'Floor Layout & Table State Overview',
    ANALYTICS: 'Shift Register & Daily Summary'
  };

  const handleNewOrder = () => {
    setView('POS');
    clearCart();
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-20 shrink-0 text-slate-200 select-none">
      {/* Title & View Info */}
      <div className="flex items-center space-x-3">
        <h1 className="text-sm font-bold tracking-wide uppercase text-slate-100 flex items-center gap-2">
          <span>{viewTitles[currentView]}</span>
        </h1>
        <span className="hidden md:inline-block w-px h-4 bg-slate-700"></span>
        <div className="hidden md:flex items-center text-xs font-mono text-slate-400 gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-emerald-400">{time}</span>
        </div>
      </div>

      {/* Global Quick Search Input */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search menu items (code or name) or orders... [Ctrl + K]"
            className="w-full pl-9 pr-12 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            Ctrl+K
          </span>
        </div>
      </div>

      {/* Action Controls & User Metrics */}
      <div className="flex items-center space-x-2.5 text-xs font-mono">
        {/* Register Cash Metric */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] text-slate-400">Drawer:</span>
          <span className="font-bold text-emerald-400">${totalTodaySales.toFixed(2)}</span>
        </div>

        {/* Server Switcher */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200">
          <User className="w-3.5 h-3.5 text-amber-400" />
          <select
            value={activeServer}
            onChange={(e) => setActiveServer(e.target.value)}
            className="bg-transparent border-none text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="Alex M. (Staff #104)">Alex M.</option>
            <option value="Sarah K. (Staff #108)">Sarah K.</option>
            <option value="Mike R. (Bartender)">Mike R.</option>
            <option value="David L. (Host)">David L.</option>
          </select>
        </div>

        {/* New Order Trigger */}
        <button
          onClick={handleNewOrder}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors shadow-sm"
          title="New Order (Alt + N)"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">New Order</span>
          <span className="text-[10px] bg-slate-950/20 px-1 rounded font-mono">Alt+N</span>
        </button>

        {/* Live Traffic Simulation Toggle */}
        <button
          onClick={() => toggleSimulation()}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold transition-all border ${
            isSimulationActive
              ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
          title="Toggle Auto Traffic Simulation"
        >
          <Zap className={`w-3.5 h-3.5 ${isSimulationActive ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="hidden md:inline">{isSimulationActive ? 'Traffic: ON' : 'Traffic: OFF'}</span>
        </button>

        {/* Trigger Single Simulated Order Button */}
        <button
          onClick={() => simulateRandomOrder()}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-300 border border-slate-700 transition-colors"
          title="Simulate Single Incoming Order"
        >
          <PlusCircle className="w-4 h-4 text-indigo-400" />
        </button>

        {/* Hotkeys Button */}
        <button
          onClick={() => toggleHotkeyModal(true)}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title="Hotkey Cheat Sheet (? or F1)"
        >
          <Keyboard className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </header>
  );
};
