import React from 'react';
import { Printer, CheckCircle2, X, DollarSign, CreditCard } from 'lucide-react';
import { OrderTicket } from '../types';

interface ReceiptModalProps {
  order: OrderTicket | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 font-sans select-none animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-heading font-bold text-slate-100 text-sm">Order Completed & Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Card */}
        <div className="p-6 overflow-y-auto bg-slate-950 flex-1">
          <div className="bg-white text-slate-900 font-mono text-xs p-6 rounded shadow-inner space-y-4 border border-slate-300">
            {/* Store Brand */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-400">
              <h2 className="font-bold text-base tracking-wider text-black font-sans uppercase">RESTAURAN OS DEMO</h2>
              <p className="text-[10px] text-slate-600">104 Grand Avenue, Suite 200</p>
              <p className="text-[10px] text-slate-600">Tel: (555) 839-2000 • Tax ID: 84-29930</p>
            </div>

            {/* Order Info */}
            <div className="flex justify-between text-[11px] pb-2 border-b border-dashed border-slate-400">
              <div>
                <p><span className="font-bold">Ticket #:</span> {order.id}</p>
                <p><span className="font-bold">Table:</span> {order.tableName || 'Takeout'}</p>
                <p><span className="font-bold">Type:</span> {order.type}</p>
              </div>
              <div className="text-right">
                <p><span className="font-bold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><span className="font-bold">Time:</span> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p><span className="font-bold">Server:</span> {order.serverName}</p>
              </div>
            </div>

            {/* Itemized List */}
            <div className="space-y-2 py-1 border-b border-dashed border-slate-400">
              <div className="flex justify-between font-bold text-[10px] uppercase text-slate-700">
                <span>Qty Item</span>
                <span>Amount</span>
              </div>
              {order.items.map((item) => (
                <div key={item.id} className="space-y-0.5">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  {item.notes && (
                    <p className="text-[10px] text-slate-600 pl-4">Note: {item.notes}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-rose-700 font-semibold">
                  <span>Discount:</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-700">
                <span>Tax (8%):</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-black border-t border-slate-400 pt-1.5 mt-1">
                <span>TOTAL:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                <span>Payment Method:</span>
                <span className="font-semibold">{order.paymentMethod || 'PENDING'}</span>
              </div>
            </div>

            {/* Barcode & Thank You */}
            <div className="text-center pt-4 space-y-2 border-t border-dashed border-slate-400">
              <p className="text-[11px] font-bold">Thank you for dining with us!</p>
              <p className="text-[9px] text-slate-500">Please visit again soon.</p>
              <div className="font-mono text-center tracking-[0.3em] text-[10px] opacity-70">
                ||||| | |||| ||| |||||| | |||||
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-4 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Done / Next Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
