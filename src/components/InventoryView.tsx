import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  Truck,
  DollarSign,
  TrendingDown,
  CheckCircle,
  Filter,
  Edit2
} from 'lucide-react';
import { useRestaurantStore } from '../store/useRestaurantStore';
import { Ingredient } from '../types';

export const InventoryView: React.FC = () => {
  const { ingredients, updateIngredientStock, restockIngredient, addIngredient } = useRestaurantStore();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);

  // New Ingredient Modal State
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    sku: 'ING-NEW-01',
    category: 'Produce',
    currentStock: 10,
    minThreshold: 5,
    unit: 'kg',
    costPerUnit: 5.0,
    supplier: 'FarmFresh Produce Co'
  });

  const categories = ['ALL', 'Produce', 'Meat & Poultry', 'Seafood', 'Dairy', 'Oils & Condiments', 'Bakery', 'Beverages / Beer', 'Coffee & Tea'];

  // Filter logic
  const filteredIngredients = ingredients.filter((ing) => {
    const catMatch = filterCategory === 'ALL' || ing.category === filterCategory;
    const searchMatch =
      !searchTerm ||
      ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ing.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ing.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const lowStockMatch = !showLowStockOnly || ing.currentStock <= ing.minThreshold;

    return catMatch && searchMatch && lowStockMatch;
  });

  // Metrics
  const totalValuation = ingredients.reduce((acc, i) => acc + i.currentStock * i.costPerUnit, 0);
  const lowStockCount = ingredients.filter((i) => i.currentStock <= i.minThreshold).length;

  const handleCreateIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredient.name) return;

    const created: Ingredient = {
      id: `ing-${Date.now()}`,
      name: newIngredient.name,
      sku: newIngredient.sku || `ING-${Math.floor(Math.random() * 1000)}`,
      category: newIngredient.category,
      currentStock: Number(newIngredient.currentStock),
      minThreshold: Number(newIngredient.minThreshold),
      unit: newIngredient.unit,
      costPerUnit: Number(newIngredient.costPerUnit),
      supplier: newIngredient.supplier,
      lastRestocked: new Date().toISOString()
    };

    addIngredient(created);
    setIsAddingNew(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Metrics Banner */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0 font-mono text-xs">
        <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[10px]">TOTAL INVENTORY VALUE</div>
            <div className="text-base font-bold text-emerald-400">${totalValuation.toFixed(2)}</div>
          </div>
          <DollarSign className="w-5 h-5 text-emerald-400/80" />
        </div>

        <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[10px]">TOTAL INGREDIENTS</div>
            <div className="text-base font-bold text-slate-100">{ingredients.length} items</div>
          </div>
          <Boxes className="w-5 h-5 text-slate-400" />
        </div>

        <div className={`p-2.5 rounded border flex items-center justify-between ${
          lowStockCount > 0 ? 'bg-rose-950/40 border-rose-800/80 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <div>
            <div className="text-[10px] uppercase font-bold">LOW STOCK ALERTS</div>
            <div className="text-base font-bold">{lowStockCount} items requiring reorder</div>
          </div>
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </div>

        <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[10px]">SUPPLIER VENDORS</div>
            <div className="text-base font-bold text-amber-400">6 Active Vendors</div>
          </div>
          <Truck className="w-5 h-5 text-amber-400/80" />
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0 font-mono text-xs">
        {/* Search & Low Stock Toggle */}
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ingredient, SKU, supplier..."
              className="w-full pl-8 pr-3 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-3 py-1 rounded border font-bold flex items-center gap-1.5 transition-colors ${
              showLowStockOnly
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock ({lowStockCount})</span>
          </button>
        </div>

        {/* Category selector */}
        <div className="flex items-center space-x-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsAddingNew(true)}
            className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Ingredient</span>
          </button>
        </div>
      </div>

      {/* Main Ingredient Data Grid */}
      <div className="flex-1 p-3 overflow-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <th className="p-2.5">SKU / Code</th>
              <th className="p-2.5">Ingredient Name</th>
              <th className="p-2.5">Category</th>
              <th className="p-2.5">Current Stock Level</th>
              <th className="p-2.5">Min Threshold</th>
              <th className="p-2.5">Unit Cost</th>
              <th className="p-2.5">Total Value</th>
              <th className="p-2.5">Supplier</th>
              <th className="p-2.5 text-right">Stock Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredIngredients.map((ing) => {
              const isLow = ing.currentStock <= ing.minThreshold;
              const stockPercentage = Math.min(100, Math.round((ing.currentStock / (ing.minThreshold * 2.5)) * 100));

              return (
                <tr
                  key={ing.id}
                  className={`hover:bg-slate-900/60 transition-colors ${
                    isLow ? 'bg-rose-950/20' : ''
                  }`}
                >
                  <td className="p-2.5 text-slate-400 font-bold">{ing.sku}</td>
                  <td className="p-2.5">
                    <div className="font-bold text-slate-100">{ing.name}</div>
                    <div className="text-[10px] text-slate-500">
                      Restocked: {new Date(ing.lastRestocked).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-2.5 text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                      {ing.category}
                    </span>
                  </td>

                  {/* Stock Level Progress Bar */}
                  <td className="p-2.5 w-48">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {ing.currentStock} {ing.unit}
                      </span>
                      {isLow && (
                        <span className="text-[9px] bg-rose-500 text-white font-bold px-1 rounded">
                          LOW ALERT
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${isLow ? 'bg-rose-500' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.max(5, stockPercentage)}%` }}
                      />
                    </div>
                  </td>

                  <td className="p-2.5 text-slate-400">
                    {ing.minThreshold} {ing.unit}
                  </td>
                  <td className="p-2.5 text-slate-300">${ing.costPerUnit.toFixed(2)}</td>
                  <td className="p-2.5 font-bold text-emerald-400">
                    ${(ing.currentStock * ing.costPerUnit).toFixed(2)}
                  </td>
                  <td className="p-2.5 text-slate-400">{ing.supplier}</td>

                  {/* Quick Action */}
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedIngredient(ing);
                        setRestockAmount(10);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold transition-colors"
                    >
                      + Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Restock Delivery Modal */}
      {selectedIngredient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-5 space-y-4 font-mono text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Restock Delivery Intake
              </h3>
              <button
                onClick={() => setSelectedIngredient(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400">Ingredient:</span>{' '}
                <strong className="text-slate-100">{selectedIngredient.name}</strong>
              </div>
              <div>
                <span className="text-slate-400">Current Stock:</span>{' '}
                <strong className="text-amber-400">
                  {selectedIngredient.currentStock} {selectedIngredient.unit}
                </strong>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Add Received Quantity ({selectedIngredient.unit}):</label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-400">
                New Stock Total will be:{' '}
                <strong className="text-emerald-400">
                  {selectedIngredient.currentStock + restockAmount} {selectedIngredient.unit}
                </strong>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedIngredient(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  restockIngredient(selectedIngredient.id, restockAmount);
                  setSelectedIngredient(null);
                }}
                className="px-4 py-1.5 rounded bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Ingredient Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateIngredient}
            className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-5 space-y-4 font-mono text-slate-100 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Boxes className="w-4 h-4" /> Register New Raw Ingredient
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Ingredient Name:</label>
                <input
                  type="text"
                  required
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  placeholder="e.g. Organic Avocados"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">SKU / Code:</label>
                <input
                  type="text"
                  value={newIngredient.sku}
                  onChange={(e) => setNewIngredient({ ...newIngredient, sku: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category:</label>
                <select
                  value={newIngredient.category}
                  onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {categories.filter((c) => c !== 'ALL').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Initial Stock:</label>
                <input
                  type="number"
                  value={newIngredient.currentStock}
                  onChange={(e) => setNewIngredient({ ...newIngredient, currentStock: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Min Threshold:</label>
                <input
                  type="number"
                  value={newIngredient.minThreshold}
                  onChange={(e) => setNewIngredient({ ...newIngredient, minThreshold: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Unit (kg, liters, units):</label>
                <input
                  type="text"
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cost Per Unit ($):</label>
                <input
                  type="number"
                  step="0.01"
                  value={newIngredient.costPerUnit}
                  onChange={(e) => setNewIngredient({ ...newIngredient, costPerUnit: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Supplier Vendor:</label>
                <input
                  type="text"
                  value={newIngredient.supplier}
                  onChange={(e) => setNewIngredient({ ...newIngredient, supplier: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
              >
                Save Ingredient
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
