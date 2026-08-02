import React, { useState } from 'react';
import {
  LayoutGrid,
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  UserCheck,
  Plus,
  Receipt
} from 'lucide-react';
import { useRestaurantStore } from '../store/useRestaurantStore';
import { TableStatus, DiningTable } from '../types';

export const FloorView: React.FC = () => {
  const {
    tables,
    orders,
    updateTableStatus,
    selectTable,
    setView,
    clearTableBill
  } = useRestaurantStore();

  const [activeSection, setActiveSection] = useState<string>('ALL');
  const [selectedTable, setSelectedTable] = useState<DiningTable | null>(tables[0] || null);

  const sections = [
    { id: 'ALL', label: 'All Floor Sections' },
    { id: 'MAIN_ROOM', label: 'Main Dining Room' },
    { id: 'PATIO', label: 'Outdoor Patio' },
    { id: 'BAR', label: 'Bar & Lounge' },
    { id: 'VIP', label: 'VIP Booths' }
  ];

  const filteredTables = tables.filter(
    (t) => activeSection === 'ALL' || t.section === activeSection
  );

  // Status Metrics
  const availableCount = tables.filter((t) => t.status === 'AVAILABLE').length;
  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED').length;
  const billedCount = tables.filter((t) => t.status === 'BILLED').length;
  const reservedCount = tables.filter((t) => t.status === 'RESERVED').length;

  const getStatusStyle = (status: TableStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return {
          cardBg: 'bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          label: 'AVAILABLE'
        };
      case 'OCCUPIED':
        return {
          cardBg: 'bg-amber-950/20 hover:bg-amber-950/40 border-amber-500/50 text-amber-300',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          label: 'OCCUPIED'
        };
      case 'BILLED':
        return {
          cardBg: 'bg-blue-950/20 hover:bg-blue-950/40 border-blue-500/50 text-blue-300',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          label: 'BILLED'
        };
      case 'RESERVED':
        return {
          cardBg: 'bg-purple-950/20 hover:bg-purple-950/40 border-purple-500/40 text-purple-300',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          label: 'RESERVED'
        };
      case 'CLEANING':
        return {
          cardBg: 'bg-slate-900 hover:bg-slate-850 border-slate-700 text-slate-400',
          badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
          label: 'CLEANING'
        };
      default:
        return {
          cardBg: 'bg-slate-900 border-slate-800 text-slate-300',
          badgeBg: 'bg-slate-800 text-slate-300',
          label: status
        };
    }
  };

  const getOccupiedMinutes = (occupiedSinceISO?: string) => {
    if (!occupiedSinceISO) return null;
    const mins = Math.floor((Date.now() - new Date(occupiedSinceISO).getTime()) / 60000);
    return Math.max(0, mins);
  };

  const handleOpenPOSForTable = (tableId: string) => {
    selectTable(tableId);
    setView('POS');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* MAIN FLOOR GRID */}
      <div className="flex-1 flex flex-col border-r border-slate-800 overflow-hidden">
        {/* Floor Section Tabs & Metrics Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0 font-mono text-xs">
          <div className="flex items-center space-x-1.5">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-3 py-1.5 rounded font-bold transition-colors shrink-0 ${
                  activeSection === sec.id
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Table Counts Summary */}
          <div className="flex items-center space-x-3 text-[11px] shrink-0 border-l border-slate-800 pl-3">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Avail: {availableCount}
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Occ: {occupiedCount}
            </span>
            <span className="flex items-center gap-1 text-blue-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Billed: {billedCount}
            </span>
          </div>
        </div>

        {/* Spatial Floor Grid Layout */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 font-mono">
          {filteredTables.map((t) => {
            const style = getStatusStyle(t.status);
            const activeOrder = orders.find((o) => o.id === t.currentOrderId);
            const minsOccupied = getOccupiedMinutes(t.occupiedSince);
            const isSelected = selectedTable?.id === t.id;

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTable(t)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between shadow-lg relative overflow-hidden ${
                  style.cardBg
                } ${isSelected ? 'ring-2 ring-emerald-400 scale-[1.02]' : ''}`}
              >
                {/* Header: Table Name & Capacity */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold tracking-tight text-slate-100">
                      {t.name}
                    </span>
                    <span className="text-[10px] text-slate-400">({t.section})</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${style.badgeBg}`}>
                    {style.label}
                  </span>
                </div>

                {/* Table Details */}
                <div className="space-y-1.5 my-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Users className="w-3.5 h-3.5" /> Capacity:
                    </span>
                    <span className="font-bold">{t.capacity} Guests</span>
                  </div>

                  {t.serverName && (
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="text-slate-400">Server:</span>
                      <span className="font-semibold text-amber-300">{t.serverName}</span>
                    </div>
                  )}

                  {minsOccupied !== null && (
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-amber-400" /> Time Seated:
                      </span>
                      <span className="font-bold text-amber-400">{minsOccupied} mins</span>
                    </div>
                  )}

                  {activeOrder && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs font-bold text-emerald-400">
                      <span>Current Order:</span>
                      <span>${activeOrder.total.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPOSForTable(t.id);
                    }}
                    className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Open POS Terminal</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDEBAR: SELECTED TABLE CONTROLS & MANAGEMENT */}
      <div className="w-full lg:w-[360px] bg-slate-900 border-l border-slate-800 flex flex-col p-4 shrink-0 font-mono text-xs select-none">
        {selectedTable ? (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-emerald-400" />
                  {selectedTable.name} Details
                </h3>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  {selectedTable.section}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Capacity: {selectedTable.capacity} guests • Real-time status controller
              </p>
            </div>

            {/* Quick Status Buttons */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-bold block">
                Update Table State:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateTableStatus(selectedTable.id, 'AVAILABLE')}
                  className="p-2 rounded bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 font-bold text-xs transition-colors"
                >
                  ✓ Mark Available
                </button>
                <button
                  onClick={() => updateTableStatus(selectedTable.id, 'OCCUPIED', 2, 'Alex M.')}
                  className="p-2 rounded bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/50 text-amber-300 font-bold text-xs transition-colors"
                >
                  ● Mark Occupied
                </button>
                <button
                  onClick={() => updateTableStatus(selectedTable.id, 'BILLED')}
                  className="p-2 rounded bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/50 text-blue-300 font-bold text-xs transition-colors"
                >
                  $ Mark Billed
                </button>
                <button
                  onClick={() => clearTableBill(selectedTable.id)}
                  className="p-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  🧹 Clear & Clean
                </button>
              </div>
            </div>

            {/* Assigned Order Overview */}
            {selectedTable.currentOrderId ? (
              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
                  <span>Active Ticket #{selectedTable.currentOrderId}</span>
                  <Receipt className="w-4 h-4" />
                </div>
                {(() => {
                  const order = orders.find((o) => o.id === selectedTable.currentOrderId);
                  if (!order) return <span className="text-slate-500">Order not found</span>;
                  return (
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div className="flex justify-between text-slate-400">
                        <span>Items Count:</span>
                        <span>{order.items.reduce((a, c) => a + c.quantity, 0)} items</span>
                      </div>
                      <div className="flex justify-between font-bold text-emerald-400 text-xs pt-1 border-t border-slate-800">
                        <span>Subtotal:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => handleOpenPOSForTable(selectedTable.id)}
                        className="w-full mt-2 py-2 rounded bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                      >
                        Load Order in POS Terminal
                      </button>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="p-4 rounded bg-slate-950 border border-slate-800 text-center space-y-2">
                <span className="text-slate-500 text-xs">No active ticket for this table.</span>
                <button
                  onClick={() => handleOpenPOSForTable(selectedTable.id)}
                  className="w-full py-2 rounded bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  + Start New Order for {selectedTable.name}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-500 text-center py-10">Select a table to view state</div>
        )}
      </div>
    </div>
  );
};
