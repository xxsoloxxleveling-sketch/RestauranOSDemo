import React, { useState } from 'react';
import { Sparkles, Play, Zap, ShoppingCart, ChefHat, LayoutGrid, Boxes, X, HelpCircle } from 'lucide-react';
import { useRestaurantStore } from '../store/useRestaurantStore';

export const DemoTourModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { toggleSimulation, setView, isSimulationActive } = useRestaurantStore();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-105 transition-transform flex items-center gap-2 text-xs font-bold font-mono"
        title="Open Interactive Demo Tour"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        <span>Demo Guide</span>
      </button>
    );
  }

  const handleStartDemo = (viewName: 'POS' | 'KDS' | 'FLOOR' | 'INVENTORY') => {
    setView(viewName);
    toggleSimulation(true);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 font-sans select-none animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col glass-card relative">
        {/* Glowing Ambient Top Bar */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"></div>

        {/* Modal Header */}
        <div className="p-6 pb-2 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg font-black text-lg">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-extrabold text-white tracking-tight">Welcome to RestauranOSDemo</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  HANDS-ON DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Next-Gen POS, Kitchen Display & Real-Time Restaurant Management</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="p-6 space-y-4 text-slate-200">
          <p className="text-xs leading-relaxed text-slate-300">
            This interactive workspace is loaded with simulated real-world restaurant data. Try placing orders, kitchen ticket bumping, table floor seating, and inventory tracking below:
          </p>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <button
              onClick={() => handleStartDemo('POS')}
              className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/60 text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-slate-400">Alt+1</span>
              </div>
              <div>
                <div className="font-bold text-slate-100 group-hover:text-indigo-300">Point of Sale (POS)</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">Tap menu items, select seats, apply discounts & print thermal receipts.</div>
              </div>
            </button>

            <button
              onClick={() => handleStartDemo('KDS')}
              className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/60 text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <ChefHat className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-slate-400">Alt+2</span>
              </div>
              <div>
                <div className="font-bold text-slate-100 group-hover:text-amber-300">Kitchen Display (KDS)</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">Filter stations, track preparation timers & bump order tickets live.</div>
              </div>
            </button>

            <button
              onClick={() => handleStartDemo('FLOOR')}
              className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/60 text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <LayoutGrid className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-slate-400">Alt+4</span>
              </div>
              <div>
                <div className="font-bold text-slate-100 group-hover:text-emerald-300">Floor Layout</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">Manage table availability, active dining guest count & server assignments.</div>
              </div>
            </button>

            <button
              onClick={() => handleStartDemo('INVENTORY')}
              className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/60 text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <Boxes className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-slate-400">Alt+3</span>
              </div>
              <div>
                <div className="font-bold text-slate-100 group-hover:text-rose-300">Inventory & Stock</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">Live stock deduction per menu order, reorder alerts & cost tracking.</div>
              </div>
            </button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Auto Traffic: <span className={isSimulationActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{isSimulationActive ? 'ACTIVE' : 'OFF'}</span></span>
          </div>

          <button
            onClick={() => handleStartDemo('POS')}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-102"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Exploring Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
