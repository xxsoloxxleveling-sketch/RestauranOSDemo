import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send,
  CreditCard,
  Banknote,
  Percent,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Utensils,
  Tag,
  Hash,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useRestaurantStore } from '../store/useRestaurantStore';
import { useHotkeys } from '../hooks/useHotkeys';
import { OrderType, MenuItem, OrderTicket } from '../types';
import { ReceiptModal } from './ReceiptModal';

export const POSView: React.FC = () => {
  const {
    menuItems,
    ingredients,
    tables,
    cart,
    selectedTableId,
    orderType,
    discountPercent,
    discountFixed,
    taxRate,
    cashReceived,
    searchQuery,
    addToCart,
    addCustomItemToCart,
    updateCartItemQty,
    updateCartItemNotes,
    removeFromCart,
    clearCart,
    selectTable,
    setOrderType,
    setDiscountPercent,
    setDiscountFixed,
    setCashReceived,
    submitPosOrder
  } = useRestaurantStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeSeat, setActiveSeat] = useState<number>(1);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');
  const [lastSubmittedOrderNum, setLastSubmittedOrderNum] = useState<number | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<'CARD' | 'CASH'>('CARD');
  const [completedOrder, setCompletedOrder] = useState<OrderTicket | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddToCart = (item: MenuItem) => {
    try {
      addToCart(item, activeSeat);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Cannot add item: Insufficient stock.');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleUpdateQty = (id: string, delta: number) => {
    try {
      updateCartItemQty(id, delta);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Cannot increase quantity: Insufficient stock.');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  // Register POS Hotkeys using the custom useHotkeys hook
  useHotkeys([
    {
      key: 'Enter',
      ctrlKey: true,
      action: () => handleSendOrder(false),
      desc: 'Send Order to Kitchen'
    },
    {
      key: 'p',
      altKey: true,
      action: () => handleSendOrder(true),
      desc: 'Pay & Submit Order'
    },
    {
      key: 'c',
      altKey: true,
      action: () => clearCart(),
      desc: 'Clear Cart'
    },
    {
      key: 'd',
      altKey: true,
      action: () => setDiscountPercent(discountPercent === 10 ? 0 : 10),
      desc: 'Toggle 10% Discount'
    }
  ]);

  const categories = ['ALL', 'Starters', 'Mains', 'Beverages', 'Desserts'];

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const categoryMatch = selectedCategory === 'ALL' || item.category === selectedCategory;
      const searchMatch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, ci) => acc + ci.price * ci.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (discountFixed > 0) return discountFixed;
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent, discountFixed]);

  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = taxableSubtotal * taxRate;
  const total = taxableSubtotal + tax;
  const changeDue = Math.max(0, cashReceived - total);

  const handleSendOrder = (paid: boolean) => {
    if (cart.length === 0) return;
    try {
      setErrorMessage(null);
      const order = submitPosOrder(paid, paid ? paymentMode : undefined);
      setCompletedOrder(order);
      setLastSubmittedOrderNum(order.orderNumber);
      setShowSuccessBanner(true);
      setTimeout(() => setShowSuccessBanner(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit order due to inventory limits.');
      setTimeout(() => setErrorMessage(null), 6000);
    }
  };

  const handleAddNoteSave = (cartItemId: string) => {
    updateCartItemNotes(cartItemId, noteInput);
    setEditingNotesId(null);
    setNoteInput('');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* LEFT / CENTER: MENU & CATEGORY SELECTION */}
      <div className="flex-1 flex flex-col border-r border-slate-800 overflow-hidden">
        {/* Category Filter Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0 select-none">
          <div className="flex items-center space-x-1.5">
            {categories.map((cat) => {
              const count =
                cat === 'ALL'
                  ? menuItems.length
                  : menuItems.filter((mi) => mi.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1 rounded ${
                      isSelected ? 'bg-slate-950/20 text-slate-900 font-extrabold' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Seat Number Selector */}
          <div className="flex items-center space-x-1 pl-3 border-l border-slate-800 shrink-0">
            <span className="text-[11px] font-mono text-slate-400 uppercase mr-1 hidden sm:inline">
              Target Seat:
            </span>
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <button
                key={s}
                onClick={() => setActiveSeat(s)}
                className={`w-7 h-7 rounded text-xs font-mono font-bold transition-colors ${
                  activeSeat === s
                    ? 'bg-amber-400 text-slate-950 border border-amber-300'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                S{s}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {filteredMenuItems.map((item) => {
            // Check ingredient availability
            const ingredientDetails = item.ingredients?.map((ing) => {
              const stockItem = ingredients.find((i) => i.id === ing.ingredientId);
              return {
                name: stockItem?.name || 'Item',
                currentStock: stockItem?.currentStock || 0,
                unit: stockItem?.unit || 'units',
                needed: ing.amountNeeded
              };
            });

            const isOutOfStock = !item.inStock || (ingredientDetails && ingredientDetails.some((i) => i.currentStock < i.needed));
            const lowestIngredient = ingredientDetails && ingredientDetails.length > 0
              ? ingredientDetails.reduce((min, i) => (i.currentStock < min.currentStock ? i : min), ingredientDetails[0])
              : null;

            return (
              <button
                key={item.id}
                disabled={isOutOfStock}
                onClick={() => handleAddToCart(item)}
                className={`group text-left p-3 rounded border flex flex-col justify-between transition-all relative overflow-hidden select-none active:scale-[0.98] ${
                  isOutOfStock
                    ? 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                {/* Header: Code & Station */}
                <div className="flex items-center justify-between mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[11px]">
                    [{item.code}]
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-800 px-1 rounded">
                    {item.station}
                  </span>
                </div>

                {/* Item Title & Desc */}
                <div className="my-1.5">
                  <div className="font-semibold text-xs text-slate-100 group-hover:text-emerald-300 line-clamp-1">
                    {item.name}
                  </div>
                  {item.description && (
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                      {item.description}
                    </div>
                  )}
                </div>

                {/* Live Ingredient Stock Tag */}
                {lowestIngredient && (
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-1.5 py-0.5 rounded my-1 border border-slate-800 flex items-center justify-between">
                    <span className="truncate max-w-[90px]">{lowestIngredient.name}:</span>
                    <span className={`font-bold ${lowestIngredient.currentStock <= 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {lowestIngredient.currentStock} {lowestIngredient.unit}
                    </span>
                  </div>
                )}

                {/* Footer: Price & Stock warning */}
                <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-800/80 font-mono">
                  <span className="text-sm font-bold text-emerald-400">
                    ${item.price.toFixed(2)}
                  </span>
                  {isOutOfStock ? (
                    <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-1 rounded">
                      OUT OF STOCK
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 font-bold flex items-center gap-1">
                      + ADD
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Quick Custom Item Tile */}
          <button
            onClick={() => {
              const name = prompt('Custom Item Name:', 'Special Request');
              const priceStr = prompt('Custom Price ($):', '5.00');
              if (name && priceStr) {
                addCustomItemToCart(name, parseFloat(priceStr));
              }
            }}
            className="p-3 rounded border border-dashed border-slate-700 bg-slate-950/50 hover:bg-slate-900 text-slate-400 hover:text-slate-200 flex flex-col items-center justify-center text-center transition-colors font-mono"
          >
            <Plus className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-xs font-bold text-slate-300">+ Custom Item</span>
            <span className="text-[10px] text-slate-500">Manual Price Entry</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE ORDER CART & CHECKOUT TERMINAL */}
      <div className="w-full lg:w-[420px] bg-slate-900 flex flex-col border-l border-slate-800 shrink-0 select-none">
        {/* Error Banner Overlay */}
        {errorMessage && (
          <div className="bg-rose-600 text-white font-bold text-xs p-3 flex items-start justify-between font-mono shadow-lg animate-in slide-in-from-top duration-200 border-b border-rose-500">
            <div className="flex items-start gap-2 pr-2">
              <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-200 hover:text-white font-bold text-xs shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success Banner Overlay */}
        {showSuccessBanner && lastSubmittedOrderNum && (
          <div className="bg-emerald-500 text-slate-950 font-bold text-xs p-2.5 flex flex-col gap-1 font-mono shadow-md animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-extrabold">
                <CheckCircle2 className="w-4 h-4 text-slate-950" /> Order #{lastSubmittedOrderNum} Submitted!
              </span>
              <span className="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded font-bold">INVENTORY SYNCED</span>
            </div>
            <div className="text-[10px] text-slate-950 bg-emerald-400/90 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <span>📦 Live Raw Ingredients Deducted from Inventory</span>
            </div>
          </div>
        )}

        {/* Cart Header: Table & Order Type Selector */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase font-bold flex items-center gap-1">
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" /> Active Order Cart
            </span>
            <span className="text-slate-400">
              Items: <strong className="text-slate-100">{cart.reduce((a, c) => a + c.quantity, 0)}</strong>
            </span>
          </div>

          {/* Table & Order Type Controls */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Assigned Table:</label>
              <select
                value={selectedTableId || ''}
                onChange={(e) => selectTable(e.target.value || null)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- No Table (Takeout) --</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.section}) - {t.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Order Type:</label>
              <div className="flex bg-slate-900 p-0.5 rounded border border-slate-700 text-xs font-mono">
                {(['DINE_IN', 'TAKEOUT', 'DELIVERY'] as OrderType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`flex-1 py-0.5 text-[10px] font-bold rounded transition-colors ${
                      orderType === type
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {type === 'DINE_IN' ? 'Dine' : type === 'TAKEOUT' ? 'Take' : 'Deliv'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2 font-mono divide-y divide-slate-800/60">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-6 space-y-2">
              <Utensils className="w-10 h-10 text-slate-700" />
              <p className="text-xs font-medium">Cart is empty.</p>
              <p className="text-[11px] text-slate-600">
                Click menu items on the left or press category shortcuts to build order.
              </p>
            </div>
          ) : (
            cart.map((ci) => (
              <div key={ci.id} className="pt-2 first:pt-0 space-y-1">
                <div className="flex items-start justify-between text-xs">
                  <div className="flex items-start gap-1.5 flex-1 pr-2">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1 rounded border border-amber-400/20 shrink-0">
                      S{ci.seatNumber || 1}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-100">{ci.name}</span>
                      <span className="text-[10px] text-slate-500 ml-1.5">[{ci.code}]</span>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400 shrink-0">
                    ${(ci.price * ci.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Notes Display / Edit */}
                {ci.notes && editingNotesId !== ci.id && (
                  <div className="text-[10px] text-amber-300 bg-amber-950/30 border border-amber-800/40 px-2 py-0.5 rounded flex items-center justify-between">
                    <span>Note: "{ci.notes}"</span>
                    <button
                      onClick={() => {
                        setEditingNotesId(ci.id);
                        setNoteInput(ci.notes || '');
                      }}
                      className="text-slate-400 hover:text-white underline text-[9px]"
                    >
                      Edit
                    </button>
                  </div>
                )}

                {editingNotesId === ci.id && (
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="e.g. No onions, Dressing on side..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-100 focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddNoteSave(ci.id)}
                      className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold rounded text-[10px]"
                    >
                      Save
                    </button>
                  </div>
                )}

                {/* Actions: Qty Controls, Note Trigger, Remove */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleUpdateQty(ci.id, -1)}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-100">{ci.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(ci.id, 1)}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!ci.notes && editingNotesId !== ci.id && (
                      <button
                        onClick={() => {
                          setEditingNotesId(ci.id);
                          setNoteInput('');
                        }}
                        className="text-[10px] text-slate-400 hover:text-amber-400 underline"
                      >
                        + Note
                      </button>
                    )}
                    <button
                      onClick={() => removeFromCart(ci.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Totals & Discount Controls */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 font-mono text-xs space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* Discount Line */}
          <div className="flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1">
              <span>Discount:</span>
              <button
                onClick={() => setDiscountPercent(discountPercent === 10 ? 0 : 10)}
                className={`px-1 rounded text-[10px] font-bold border ${
                  discountPercent === 10
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                10%
              </button>
              <button
                onClick={() => setDiscountPercent(discountPercent === 20 ? 0 : 20)}
                className={`px-1 rounded text-[10px] font-bold border ${
                  discountPercent === 20
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                20%
              </button>
            </div>
            <span className="text-amber-400">-${discountAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>Sales Tax (8%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-base font-bold text-emerald-400 border-t border-slate-800 pt-1.5">
            <span>Total Due:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Quick Cash Numpad / Tender Entry */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Cash Tendered:</span>
              {cashReceived > 0 && (
                <span className="text-emerald-400 font-bold">
                  Change: ${changeDue.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex gap-1.5">
              {[10, 20, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCashReceived(amt)}
                  className={`flex-1 py-1 rounded text-[11px] font-bold border transition-colors ${
                    cashReceived === amt
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  ${amt}
                </button>
              ))}
              <button
                onClick={() => setCashReceived(0)}
                className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[10px] hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Primary Payment Action Buttons */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono">
          <button
            disabled={cart.length === 0}
            onClick={() => handleSendOrder(false)}
            className="py-2.5 px-3 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-extrabold text-xs flex flex-col items-center justify-center transition-colors shadow-sm"
          >
            <div className="flex items-center gap-1">
              <Send className="w-3.5 h-3.5" />
              <span>SEND KITCHEN</span>
            </div>
            <span className="text-[9px] font-normal opacity-80">[Ctrl + Enter]</span>
          </button>

          <button
            disabled={cart.length === 0}
            onClick={() => handleSendOrder(true)}
            className="py-2.5 px-3 rounded bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-extrabold text-xs flex flex-col items-center justify-center transition-colors shadow-sm"
          >
            <div className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>PAY & CLOSE</span>
            </div>
            <span className="text-[9px] font-normal opacity-80">[Alt + P]</span>
          </button>
        </div>
      </div>

      {/* Customer Receipt Preview Modal */}
      <ReceiptModal order={completedOrder} onClose={() => setCompletedOrder(null)} />
    </div>
  );
};
