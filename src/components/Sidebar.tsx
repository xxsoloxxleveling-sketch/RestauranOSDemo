import React from 'react';
import {
  ShoppingCart,
  ChefHat,
  Boxes,
  LayoutGrid,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Zap,
  HelpCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useRestaurantStore } from '../store/useRestaurantStore';
import { ViewMode } from '../types';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setView,
    sidebarCollapsed,
    toggleSidebar,
    toggleHotkeyModal,
    orders,
    ingredients,
    tables
  } = useRestaurantStore();

  // Metric counts
  const activeKdsCount = orders.filter((o) => o.status === 'NEW' || o.status === 'PREPARING').length;
  const lowStockCount = ingredients.filter((i) => i.currentStock <= i.minThreshold).length;
  const occupiedTablesCount = tables.filter((t) => t.status === 'OCCUPIED' || t.status === 'BILLED').length;

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; hotkey: string; badge?: number; badgeColor?: string }[] = [
    {
      id: 'POS',
      label: 'Point of Sale',
      icon: <ShoppingCart className="w-5 h-5" />,
      hotkey: 'Alt+1'
    },
    {
      id: 'KDS',
      label: 'Kitchen Display',
      icon: <ChefHat className="w-5 h-5" />,
      hotkey: 'Alt+2',
      badge: activeKdsCount,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    {
      id: 'INVENTORY',
      label: 'Inventory & Stock',
      icon: <Boxes className="w-5 h-5" />,
      hotkey: 'Alt+3',
      badge: lowStockCount,
      badgeColor: 'bg-rose-500 text-white font-bold'
    },
    {
      id: 'FLOOR',
      label: 'Floor Plan',
      icon: <LayoutGrid className="w-5 h-5" />,
      hotkey: 'Alt+4',
      badge: occupiedTablesCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
    },
    {
      id: 'ANALYTICS',
      label: 'Shift & Register',
      icon: <BarChart3 className="w-5 h-5" />,
      hotkey: 'Alt+5'
    }
  ];

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col justify-between transition-all duration-200 z-30 select-none ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between h-14 bg-slate-950/50">
        {!sidebarCollapsed ? (
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded bg-indigo-500 text-white flex items-center justify-center font-black tracking-wider text-xs shadow-sm shrink-0">
              ROSD
            </div>
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm tracking-tight text-slate-100 leading-none">
                RestauranOSDemo
              </span>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                STATION #01 • ONLINE
              </span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded bg-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
            ROSD
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:outline-none"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        {!sidebarCollapsed && (
          <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase font-mono">
            Core Operations
          </div>
        )}

        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded text-xs font-medium transition-colors group relative ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
              }`}
              title={`${item.label} (${item.hotkey})`}
            >
              <div className="flex items-center space-x-3 truncate">
                <span className={isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-200'}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!sidebarCollapsed ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono leading-none ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  <span
                    className={`font-mono text-[10px] px-1 py-0.5 rounded ${
                      isActive ? 'bg-slate-950/20 text-slate-900 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.hotkey}
                  </span>
                </div>
              ) : (
                item.badge !== undefined &&
                item.badge > 0 && (
                  <span
                    className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${
                      item.id === 'INVENTORY' ? 'bg-rose-500' : 'bg-amber-400'
                    }`}
                  />
                )
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Status Bar & Hotkeys Modal Trigger */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/40 space-y-2">
        {!sidebarCollapsed && (
          <div className="px-2 py-1.5 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" /> Kitchen Speed:
              </span>
              <span className="font-bold text-slate-200">14.2 min</span>
            </div>
            {lowStockCount > 0 && (
              <div className="flex items-center justify-between text-rose-400 font-medium">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Low Stock Items:
                </span>
                <span className="font-bold">{lowStockCount}</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => toggleHotkeyModal(true)}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors border border-slate-700"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          {!sidebarCollapsed && <span>Keyboard Shortcuts</span>}
          <span className="bg-slate-900 text-amber-400 border border-amber-400/30 px-1 rounded text-[10px]">
            ?
          </span>
        </button>
      </div>
    </aside>
  );
};
