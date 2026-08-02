import React from 'react';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  CreditCard,
  Banknote,
  Clock,
  Utensils,
  CheckCircle2,
  Printer,
  Calendar
} from 'lucide-react';
import { useRestaurantStore } from '../store/useRestaurantStore';

export const AnalyticsView: React.FC = () => {
  const { orders, menuItems, ingredients } = useRestaurantStore();

  const paidOrders = orders.filter((o) => o.paid);
  const totalSales = paidOrders.reduce((acc, o) => acc + o.total, 0);
  const cashSales = paidOrders
    .filter((o) => o.paymentMethod === 'CASH')
    .reduce((acc, o) => acc + o.total, 0);
  const cardSales = paidOrders
    .filter((o) => o.paymentMethod === 'CARD')
    .reduce((acc, o) => acc + o.total, 0);

  const avgTicket = paidOrders.length > 0 ? totalSales / paidOrders.length : 0;

  // Calculate top items
  const itemCounts: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemCounts[item.name]) {
        itemCounts[item.name] = { name: item.name, qty: 0, revenue: 0 };
      }
      itemCounts[item.name].qty += item.quantity;
      itemCounts[item.name].revenue += item.price * item.quantity;
    });
  });

  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 font-sans select-none space-y-4">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">TOTAL REGISTER SALES</div>
            <div className="text-xl font-bold text-emerald-400">${totalSales.toFixed(2)}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{paidOrders.length} Paid Tickets</div>
          </div>
          <DollarSign className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">CASH DRAWER TENDER</div>
            <div className="text-xl font-bold text-amber-400">${cashSales.toFixed(2)}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Physical Cash Balance</div>
          </div>
          <Banknote className="w-6 h-6 text-amber-400" />
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">CARD / STRIPE PAYMENTS</div>
            <div className="text-xl font-bold text-blue-400">${cardSales.toFixed(2)}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Terminal Batch Total</div>
          </div>
          <CreditCard className="w-6 h-6 text-blue-400" />
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">AVERAGE ORDER VALUE</div>
            <div className="text-xl font-bold text-slate-100">${avgTicket.toFixed(2)}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Per Ticket Average</div>
          </div>
          <TrendingUp className="w-6 h-6 text-slate-400" />
        </div>
      </div>

      {/* Two Columns: Top Items & Recent Register Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Top Selling Items */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-400" /> Top Selling Items Today
            </h3>
            <span className="text-[10px] text-slate-400">By Quantity Sold</span>
          </div>

          <div className="space-y-2">
            {topItems.map((item, idx) => (
              <div
                key={item.name}
                className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[11px]">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-slate-200">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">{item.qty} sold</div>
                  <div className="text-[10px] text-slate-500">${item.revenue.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paid & Closed Register Tickets */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recent Shift Transactions
            </h3>
            <button
              onClick={() => alert('Shift Summary Z-Report printed to receipt printer!')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 border border-slate-700"
            >
              <Printer className="w-3 h-3 text-amber-400" /> Print Z-Report
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">#{order.orderNumber}</span>
                    {order.tableName && (
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1 rounded">
                        {order.tableName}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 uppercase">{order.type}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Server: {order.serverName} • {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-emerald-400">${order.total.toFixed(2)}</div>
                  <span
                    className={`text-[9px] px-1 rounded font-bold uppercase ${
                      order.paid
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {order.paid ? `${order.paymentMethod || 'PAID'}` : 'UNPAID'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
