import React from 'react';
import { X, Keyboard, Zap, Terminal } from 'lucide-react';
import { useRestaurantStore } from '../store/useRestaurantStore';

export const HotkeyModal: React.FC = () => {
  const { isHotkeyModalOpen, toggleHotkeyModal } = useRestaurantStore();

  if (!isHotkeyModalOpen) return null;

  const hotkeyGroups = [
    {
      category: 'Module Navigation',
      shortcuts: [
        { keys: ['Alt', '1'], desc: 'Switch to Point of Sale (POS)' },
        { keys: ['Alt', '2'], desc: 'Switch to Kitchen Display System (KDS)' },
        { keys: ['Alt', '3'], desc: 'Switch to Inventory & Stock Management' },
        { keys: ['Alt', '4'], desc: 'Switch to Table & Floor Management' },
        { keys: ['Alt', '5'], desc: 'Switch to Shift Register & Analytics' }
      ]
    },
    {
      category: 'POS View Controls',
      shortcuts: [
        { keys: ['Alt', 'N'], desc: 'Start New Order (Clear Cart)' },
        { keys: ['Ctrl', 'Enter'], desc: 'Send Order to Kitchen (Submit)' },
        { keys: ['Alt', 'P'], desc: 'Quick Pay / Complete Cash or Card' },
        { keys: ['Alt', 'C'], desc: 'Clear Current Cart' },
        { keys: ['Alt', 'D'], desc: 'Apply Quick Discount (10%)' },
        { keys: ['Ctrl', 'K'], desc: 'Focus Quick Search Bar' },
        { keys: ['Esc'], desc: 'Clear Search / Close Dialogs' }
      ]
    },
    {
      category: 'KDS Kitchen Display',
      shortcuts: [
        { keys: ['Space'], desc: 'Bump / Advance Focused Ticket Status' },
        { keys: ['Alt', 'R'], desc: 'Recall Last Bumped Ticket' },
        { keys: ['Alt', 'G'], desc: 'Filter Grill Station' },
        { keys: ['Alt', 'A'], desc: 'Filter All Stations' }
      ]
    },
    {
      category: 'System Primitives',
      shortcuts: [
        { keys: ['?'], desc: 'Toggle Hotkey Helper Cheat Sheet' },
        { keys: ['F1'], desc: 'Open System Operations Help' },
        { keys: ['Numpad 0-9'], desc: 'Rapid Price / Quantity / Cash Input' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight uppercase font-mono">
                Keyboard Hotkey Primitives
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Utilitarian speed shortcuts for high-efficiency touchless entry
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleHotkeyModal(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto font-mono">
          {hotkeyGroups.map((group) => (
            <div key={group.category} className="bg-slate-950/60 rounded border border-slate-800 p-3.5 space-y-2.5">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {group.category}
              </div>

              <div className="space-y-2">
                {group.shortcuts.map((sc) => (
                  <div key={sc.desc} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-sans text-xs">{sc.desc}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {sc.keys.map((k) => (
                        <kbd
                          key={k}
                          className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[10px] shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Press <kbd className="px-1 bg-slate-800 text-slate-200 rounded">Esc</kbd> anytime to dismiss
          </span>
          <button
            onClick={() => toggleHotkeyModal(false)}
            className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded hover:bg-emerald-400 transition-colors"
          >
            Got It [Esc]
          </button>
        </div>
      </div>
    </div>
  );
};
