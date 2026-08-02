import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Filter,
  Check,
  Flame,
  UtensilsCrossed,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { useRestaurantStore } from '../store/useRestaurantStore';
import { useHotkeys } from '../hooks/useHotkeys';
import { OrderStatus, StationType, OrderTicket } from '../types';

export const KDSView: React.FC = () => {
  const {
    orders,
    menuItems,
    kdsStationFilter,
    setKdsStationFilter,
    bumpKdsTicket,
    updateOrderStatus,
    recallLastTicket
  } = useRestaurantStore();

  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // KDS hotkeys
  useHotkeys([
    {
      key: 'r',
      altKey: true,
      action: () => recallLastTicket(),
      desc: 'Recall Last Ticket'
    },
    {
      key: 'a',
      altKey: true,
      action: () => setKdsStationFilter('ALL'),
      desc: 'Filter All Stations'
    },
    {
      key: 'g',
      altKey: true,
      action: () => setKdsStationFilter('GRILL'),
      desc: 'Filter Grill Station'
    }
  ]);

  // Update timer every 5 seconds for real-time wait duration
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  const stations: StationType[] = ['ALL', 'GRILL', 'PANTRY', 'FRYER', 'BAR', 'ASSEMBLY'];

  // Toggle item-level cooking completion
  const toggleItemDone = (orderId: string, itemId: string) => {
    const key = `${orderId}-${itemId}`;
    setCompletedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter orders by station
  const filteredOrders = orders.filter((order) => {
    if (order.status === 'CANCELLED') return false;
    if (kdsStationFilter === 'ALL') return true;

    // Check if order contains items matching station
    return order.items.some((item) => {
      const match = menuItems.find((m) => m.id === item.menuItemId || m.name === item.name);
      return match ? match.station === kdsStationFilter : true;
    });
  });

  // Calculate elapsed minutes
  const getElapsedMinutes = (createdAtISO: string) => {
    const created = new Date(createdAtISO).getTime();
    return Math.max(0, Math.floor((currentTime - created) / 60000));
  };

  // Get ticket color badge based on duration
  const getDurationBadge = (elapsedMins: number) => {
    if (elapsedMins >= 20) {
      return {
        bg: 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse',
        headerBg: 'bg-rose-950 border-rose-700',
        text: `${elapsedMins}m CRITICAL`
      };
    }
    if (elapsedMins >= 10) {
      return {
        bg: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
        headerBg: 'bg-amber-950/80 border-amber-800',
        text: `${elapsedMins}m DELAYED`
      };
    }
    return {
      bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
      headerBg: 'bg-slate-900 border-slate-800',
      text: `${elapsedMins}m`
    };
  };

  const columns: { status: OrderStatus; title: string; count: number; color: string }[] = [
    {
      status: 'NEW',
      title: 'INCOMING (NEW)',
      count: filteredOrders.filter((o) => o.status === 'NEW').length,
      color: 'border-blue-500/50 text-blue-400'
    },
    {
      status: 'PREPARING',
      title: 'PREPARING (GRILL / PASS)',
      count: filteredOrders.filter((o) => o.status === 'PREPARING').length,
      color: 'border-amber-500/50 text-amber-400'
    },
    {
      status: 'READY',
      title: 'READY FOR RUNNER',
      count: filteredOrders.filter((o) => o.status === 'READY').length,
      color: 'border-emerald-500/50 text-emerald-400'
    },
    {
      status: 'SERVED',
      title: 'SERVED (HISTORIC)',
      count: filteredOrders.filter((o) => o.status === 'SERVED').length,
      color: 'border-slate-700 text-slate-400'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* KDS Header & Station Filter Toolbar */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 font-mono">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 uppercase">
              KDS Display Board • Station: <span className="text-amber-400">{kdsStationFilter}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Auto-sync active kitchen tickets with real-time timers
            </div>
          </div>
        </div>

        {/* Station Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded border border-slate-800">
          <span className="text-[10px] text-slate-500 px-1 font-bold">STATION:</span>
          {stations.map((s) => (
            <button
              key={s}
              onClick={() => setKdsStationFilter(s)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                kdsStationFilter === s
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Action Recall Button */}
        <button
          onClick={recallLastTicket}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          title="Recall Last Bumped Ticket (Alt + R)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Recall Ticket</span>
          <span className="text-[10px] text-slate-400 bg-slate-900 px-1 rounded">Alt+R</span>
        </button>
      </div>

      {/* KDS Kanban Board Grid */}
      <div className="flex-1 p-3 overflow-x-auto overflow-y-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {columns.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-slate-900/60 rounded-lg border border-slate-800 flex flex-col overflow-hidden"
            >
              {/* Column Header */}
              <div className={`p-2.5 border-b bg-slate-950 flex items-center justify-between font-mono text-xs font-bold ${col.color}`}>
                <span className="truncate">{col.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-[11px]">
                  {col.count}
                </span>
              </div>

              {/* Tickets Stack */}
              <div className="flex-1 p-2 overflow-y-auto space-y-2.5">
                {colOrders.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center text-slate-600 font-mono text-xs">
                    <span>No active tickets</span>
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const elapsed = getElapsedMinutes(order.createdAt);
                    const durBadge = getDurationBadge(elapsed);

                    return (
                      <div
                        key={order.id}
                        className="bg-slate-900 rounded border border-slate-800 overflow-hidden shadow-lg flex flex-col transition-all hover:border-slate-700 font-mono"
                      >
                        {/* Ticket Header */}
                        <div className={`p-2 border-b flex items-center justify-between ${durBadge.headerBg}`}>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-100">
                              #{order.orderNumber}
                            </span>
                            {order.tableName && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40">
                                {order.tableName}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 uppercase">
                              {order.type}
                            </span>
                          </div>

                          {/* Elapsed Timer Badge */}
                          <div
                            className={`px-1.5 py-0.5 rounded text-xs font-bold border flex items-center gap-1 ${durBadge.bg}`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{durBadge.text}</span>
                          </div>
                        </div>

                        {/* Ticket Info */}
                        <div className="p-2 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between border-b border-slate-800/60">
                          <span>Server: <strong className="text-slate-200">{order.serverName}</strong></span>
                          <span>Time: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Ticket Line Items */}
                        <div className="p-2 space-y-1.5 flex-1 divide-y divide-slate-800/40 text-xs">
                          {order.items.map((item) => {
                            const itemKey = `${order.id}-${item.id}`;
                            const isDone = completedItems[itemKey];

                            return (
                              <button
                                key={item.id}
                                onClick={() => toggleItemDone(order.id, item.id)}
                                className={`w-full text-left pt-1.5 first:pt-0 flex items-start justify-between transition-opacity ${
                                  isDone ? 'line-through opacity-40 text-slate-500' : 'text-slate-200'
                                }`}
                              >
                                <div className="flex items-start gap-1.5 pr-2">
                                  <span className="font-bold text-amber-400">
                                    {item.quantity}x
                                  </span>
                                  <div>
                                    <span className="font-semibold">{item.name}</span>
                                    {item.notes && (
                                      <div className="text-[10px] text-amber-300 not-italic font-sans italic mt-0.5 bg-amber-950/40 px-1 rounded">
                                        ★ {item.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                                    isDone
                                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                      : 'border-slate-700 bg-slate-800'
                                  }`}
                                >
                                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Action Footer: Bump / Advance */}
                        <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                          <button
                            onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                            className="text-[10px] text-rose-400 hover:underline"
                          >
                            Void
                          </button>

                          {order.status !== 'SERVED' ? (
                            <button
                              onClick={() => bumpKdsTicket(order.id)}
                              className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <span>BUMP TICKET</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-bold">
                              SERVED ✓
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
