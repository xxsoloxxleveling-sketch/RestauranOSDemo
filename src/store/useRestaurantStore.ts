import { create } from 'zustand';
import {
  ViewMode,
  MenuItem,
  Ingredient,
  DiningTable,
  OrderTicket,
  CartItem,
  OrderType,
  OrderStatus,
  TableStatus,
  StationType
} from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_INGREDIENTS, INITIAL_TABLES, INITIAL_ORDERS } from '../data/mockData';

// Helper to sync menu items inStock state based on live ingredient levels
export function syncMenuItemsInStock(menuItems: MenuItem[], ingredients: Ingredient[]): MenuItem[] {
  return menuItems.map((mi) => {
    if (!mi.ingredients || mi.ingredients.length === 0) return mi;
    const hasEnoughStock = mi.ingredients.every((ingReq) => {
      const ing = ingredients.find((i) => i.id === ingReq.ingredientId);
      return ing ? ing.currentStock >= ingReq.amountNeeded : true;
    });
    return { ...mi, inStock: hasEnoughStock };
  });
}

// Helper to deduct stock for a list of cart items
export function deductIngredientsForCart(cart: CartItem[], menuItems: MenuItem[], ingredients: Ingredient[]) {
  const updatedIngredients = [...ingredients];
  const deductedSummary: { name: string; amount: number; unit: string }[] = [];

  cart.forEach((cartItem) => {
    const mItem = menuItems.find((mi) => mi.id === cartItem.menuItemId);
    if (mItem && mItem.ingredients) {
      mItem.ingredients.forEach((ingReq) => {
        const ingIndex = updatedIngredients.findIndex((i) => i.id === ingReq.ingredientId);
        if (ingIndex >= 0) {
          const consumed = ingReq.amountNeeded * cartItem.quantity;
          const current = updatedIngredients[ingIndex].currentStock;
          const newStock = Math.max(0, current - consumed);
          updatedIngredients[ingIndex] = {
            ...updatedIngredients[ingIndex],
            currentStock: Number(newStock.toFixed(2))
          };
          deductedSummary.push({
            name: updatedIngredients[ingIndex].name,
            amount: Number(consumed.toFixed(2)),
            unit: updatedIngredients[ingIndex].unit
          });
        }
      });
    }
  });

  const updatedMenuItems = syncMenuItemsInStock(menuItems, updatedIngredients);
  return { updatedIngredients, updatedMenuItems, deductedSummary };
}

// Strict inventory availability validator for cart operations
export function checkCartStockAvailability(
  proposedCart: CartItem[],
  menuItems: MenuItem[],
  ingredients: Ingredient[]
): { valid: boolean; errorMsg?: string; ingredientName?: string } {
  const requiredStock: Record<string, { needed: number; name: string; unit: string }> = {};

  for (const item of proposedCart) {
    const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
    if (!menuItem || !menuItem.ingredients) continue;

    for (const req of menuItem.ingredients) {
      const ing = ingredients.find((i) => i.id === req.ingredientId);
      const ingName = ing ? ing.name : req.ingredientId;
      const ingUnit = ing ? ing.unit : 'units';
      const totalAmount = req.amountNeeded * item.quantity;

      if (!requiredStock[req.ingredientId]) {
        requiredStock[req.ingredientId] = { needed: 0, name: ingName, unit: ingUnit };
      }
      requiredStock[req.ingredientId].needed += totalAmount;
    }
  }

  for (const [ingId, req] of Object.entries(requiredStock)) {
    const ing = ingredients.find((i) => i.id === ingId);
    const available = ing ? ing.currentStock : 0;
    if (req.needed > available + 0.0001) {
      return {
        valid: false,
        ingredientName: req.name,
        errorMsg: `Insufficient stock for "${req.name}". Total cart needs ${req.needed.toFixed(2)} ${req.unit}, but only ${available.toFixed(2)} ${req.unit} available in inventory.`
      };
    }
  }

  return { valid: true };
}

interface RestaurantState {
  // Navigation & UI State
  currentView: ViewMode;
  sidebarCollapsed: boolean;
  isHotkeyModalOpen: boolean;
  searchQuery: string;
  activeServer: string;

  // POS State
  cart: CartItem[];
  selectedTableId: string | null;
  orderType: OrderType;
  discountPercent: number;
  discountFixed: number;
  taxRate: number; // e.g. 0.08 (8%)
  cashReceived: number;

  // Data Store
  menuItems: MenuItem[];
  ingredients: Ingredient[];
  tables: DiningTable[];
  orders: OrderTicket[];

  // KDS Filter
  kdsStationFilter: StationType;

  // Actions - Navigation & UI
  setView: (view: ViewMode) => void;
  toggleSidebar: () => void;
  toggleHotkeyModal: (open?: boolean) => void;
  setSearchQuery: (q: string) => void;
  setActiveServer: (name: string) => void;

  // Actions - POS
  addToCart: (item: MenuItem, seatNumber?: number, notes?: string) => void;
  addCustomItemToCart: (name: string, price: number) => void;
  updateCartItemQty: (id: string, delta: number) => void;
  updateCartItemNotes: (id: string, notes: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  selectTable: (tableId: string | null) => void;
  setOrderType: (type: OrderType) => void;
  setDiscountPercent: (percent: number) => void;
  setDiscountFixed: (fixed: number) => void;
  setCashReceived: (amount: number) => void;
  submitPosOrder: (paid?: boolean, paymentMethod?: 'CASH' | 'CARD' | 'SPLIT') => OrderTicket;
  loadTableOrderToPOS: (tableId: string) => void;

  // Actions - KDS
  setKdsStationFilter: (station: StationType) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  bumpKdsTicket: (orderId: string) => void;
  recallLastTicket: () => void;

  // Actions - Inventory
  updateIngredientStock: (id: string, currentStock: number) => void;
  restockIngredient: (id: string, addedStock: number) => void;
  addIngredient: (ingredient: Ingredient) => void;

  // Actions - Floor & Table
  updateTableStatus: (tableId: string, status: TableStatus, guestCount?: number, serverName?: string) => void;
  clearTableBill: (tableId: string) => void;

  // Actions - Simulation Engine
  isSimulationActive: boolean;
  toggleSimulation: (active?: boolean) => void;
  simulateRandomOrder: () => void;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  // Initial States
  currentView: 'POS',
  sidebarCollapsed: false,
  isHotkeyModalOpen: false,
  searchQuery: '',
  activeServer: 'Alex M. (Staff #104)',

  cart: [],
  selectedTableId: 't1', // default to Table 1
  orderType: 'DINE_IN',
  discountPercent: 0,
  discountFixed: 0,
  taxRate: 0.08, // 8% sales tax
  cashReceived: 0,

  menuItems: INITIAL_MENU_ITEMS,
  ingredients: INITIAL_INGREDIENTS,
  tables: INITIAL_TABLES,
  orders: INITIAL_ORDERS,

  kdsStationFilter: 'ALL',

  // Actions implementation
  setView: (view) => set({ currentView: view }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  toggleHotkeyModal: (open) =>
    set((state) => ({
      isHotkeyModalOpen: open !== undefined ? open : !state.isHotkeyModalOpen
    })),

  setSearchQuery: (q) => set({ searchQuery: q }),

  setActiveServer: (name) => set({ activeServer: name }),

  addToCart: (menuItem, seatNumber = 1, notes = '') => {
    const state = get();
    // Build proposed cart
    const existingIndex = state.cart.findIndex(
      (ci) => ci.menuItemId === menuItem.id && ci.seatNumber === seatNumber && (ci.notes || '') === notes
    );

    let proposedCart: CartItem[];
    if (existingIndex >= 0) {
      proposedCart = [...state.cart];
      proposedCart[existingIndex] = {
        ...proposedCart[existingIndex],
        quantity: proposedCart[existingIndex].quantity + 1
      };
    } else {
      const newCartItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        code: menuItem.code,
        price: menuItem.price,
        quantity: 1,
        seatNumber,
        notes
      };
      proposedCart = [...state.cart, newCartItem];
    }

    // Verify inventory availability
    const check = checkCartStockAvailability(proposedCart, state.menuItems, state.ingredients);
    if (!check.valid) {
      throw new Error(check.errorMsg || 'Insufficient inventory stock to add item.');
    }

    set({ cart: proposedCart });
  },

  addCustomItemToCart: (name, price) => {
    set((state) => {
      const newCartItem: CartItem = {
        id: `cart-custom-${Date.now()}`,
        menuItemId: 'custom',
        name: name || 'Custom Item',
        code: 'CUS',
        price: price > 0 ? price : 1.0,
        quantity: 1,
        seatNumber: 1
      };
      return { cart: [...state.cart, newCartItem] };
    });
  },

  updateCartItemQty: (id, delta) => {
    const state = get();
    const proposedCart = state.cart
      .map((ci) => {
        if (ci.id === id) {
          const newQty = ci.quantity + delta;
          return newQty > 0 ? { ...ci, quantity: newQty } : null;
        }
        return ci;
      })
      .filter(Boolean) as CartItem[];

    if (delta > 0) {
      const check = checkCartStockAvailability(proposedCart, state.menuItems, state.ingredients);
      if (!check.valid) {
        throw new Error(check.errorMsg || 'Insufficient inventory stock.');
      }
    }

    set({ cart: proposedCart });
  },

  updateCartItemNotes: (id, notes) => {
    set((state) => ({
      cart: state.cart.map((ci) => (ci.id === id ? { ...ci, notes } : ci))
    }));
  },

  removeFromCart: (id) => {
    set((state) => ({ cart: state.cart.filter((ci) => ci.id !== id) }));
  },

  clearCart: () => set({ cart: [], discountPercent: 0, discountFixed: 0, cashReceived: 0 }),

  selectTable: (tableId) => {
    set({ selectedTableId: tableId });
    if (tableId) {
      get().loadTableOrderToPOS(tableId);
    }
  },

  setOrderType: (type) => set({ orderType: type }),

  setDiscountPercent: (percent) => set({ discountPercent: Math.min(100, Math.max(0, percent)) }),

  setDiscountFixed: (fixed) => set({ discountFixed: Math.max(0, fixed) }),

  setCashReceived: (amount) => set({ cashReceived: Math.max(0, amount) }),

  submitPosOrder: (paid = false, paymentMethod = 'CARD') => {
    const state = get();
    if (state.cart.length === 0) {
      throw new Error('Cart is empty');
    }

    // Verify inventory stock availability for entire cart
    const stockCheck = checkCartStockAvailability(state.cart, state.menuItems, state.ingredients);
    if (!stockCheck.valid) {
      throw new Error(stockCheck.errorMsg || 'Cannot submit order due to insufficient raw ingredient stock.');
    }

    // Calculate subtotal, tax, discount, total
    const subtotal = state.cart.reduce((acc, ci) => acc + ci.price * ci.quantity, 0);
    const discAmount = state.discountFixed > 0 ? state.discountFixed : (subtotal * state.discountPercent) / 100;
    const taxableSubtotal = Math.max(0, subtotal - discAmount);
    const tax = taxableSubtotal * state.taxRate;
    const total = taxableSubtotal + tax;

    const selectedTable = state.tables.find((t) => t.id === state.selectedTableId);
    const orderNum = state.orders.length > 0 ? Math.max(...state.orders.map((o) => o.orderNumber)) + 1 : 1005;

    const newOrder: OrderTicket = {
      id: `ORD-${orderNum}`,
      orderNumber: orderNum,
      type: state.orderType,
      tableId: state.selectedTableId || undefined,
      tableName: selectedTable ? selectedTable.name : undefined,
      serverName: state.activeServer,
      items: [...state.cart],
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtotal,
      tax,
      discount: discAmount,
      total,
      paid,
      paymentMethod: paid ? paymentMethod : undefined
    };

    // Deduct stock for ingredients & sync menu item availability
    const { updatedIngredients, updatedMenuItems } = deductIngredientsForCart(state.cart, state.menuItems, state.ingredients);

    // Update table status if DINE_IN
    let updatedTables = [...state.tables];
    if (state.orderType === 'DINE_IN' && state.selectedTableId) {
      updatedTables = updatedTables.map((t) => {
        if (t.id === state.selectedTableId) {
          return {
            ...t,
            status: paid ? 'BILLED' : 'OCCUPIED',
            currentOrderId: newOrder.id,
            occupiedSince: t.occupiedSince || new Date().toISOString(),
            serverName: state.activeServer
          };
        }
        return t;
      });
    }

    set({
      orders: [newOrder, ...state.orders],
      ingredients: updatedIngredients,
      menuItems: updatedMenuItems,
      tables: updatedTables,
      cart: [],
      discountPercent: 0,
      discountFixed: 0,
      cashReceived: 0
    });

    return newOrder;
  },

  loadTableOrderToPOS: (tableId) => {
    const state = get();
    const table = state.tables.find((t) => t.id === tableId);
    if (!table || !table.currentOrderId) {
      set({ cart: [] });
      return;
    }

    const order = state.orders.find((o) => o.id === table.currentOrderId);
    if (order && !order.paid) {
      set({
        cart: [...order.items],
        orderType: order.type,
        discountFixed: order.discount
      });
    } else {
      set({ cart: [] });
    }
  },

  // KDS actions
  setKdsStationFilter: (station) => set({ kdsStationFilter: station }),

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    }));
  },

  bumpKdsTicket: (orderId) => {
    const state = get();
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return;

    let nextStatus: OrderStatus = 'PREPARING';
    if (order.status === 'NEW') nextStatus = 'PREPARING';
    else if (order.status === 'PREPARING') nextStatus = 'READY';
    else if (order.status === 'READY') nextStatus = 'SERVED';

    state.updateOrderStatus(orderId, nextStatus);
  },

  recallLastTicket: () => {
    set((state) => {
      // Find the last served or ready order and set it back to PREPARING
      const sorted = [...state.orders].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      const lastBumped = sorted.find((o) => o.status === 'SERVED' || o.status === 'READY');

      if (lastBumped) {
        return {
          orders: state.orders.map((o) => (o.id === lastBumped.id ? { ...o, status: 'PREPARING', updatedAt: new Date().toISOString() } : o))
        };
      }
      return state;
    });
  },

  // Inventory actions
  updateIngredientStock: (id, currentStock) => {
    set((state) => {
      const newIngs = state.ingredients.map((i) => (i.id === id ? { ...i, currentStock: Math.max(0, currentStock) } : i));
      const syncedMenu = syncMenuItemsInStock(state.menuItems, newIngs);
      return { ingredients: newIngs, menuItems: syncedMenu };
    });
  },

  restockIngredient: (id, addedStock) => {
    set((state) => {
      const newIngs = state.ingredients.map((i) =>
        i.id === id
          ? {
              ...i,
              currentStock: Number((i.currentStock + addedStock).toFixed(2)),
              lastRestocked: new Date().toISOString()
            }
          : i
      );
      const syncedMenu = syncMenuItemsInStock(state.menuItems, newIngs);
      return { ingredients: newIngs, menuItems: syncedMenu };
    });
  },

  addIngredient: (ingredient) => {
    set((state) => ({
      ingredients: [ingredient, ...state.ingredients]
    }));
  },

  // Table Floor actions
  updateTableStatus: (tableId, status, guestCount, serverName) => {
    set((state) => ({
      tables: state.tables.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            status,
            guestCount: guestCount !== undefined ? guestCount : t.guestCount,
            serverName: serverName !== undefined ? serverName : t.serverName,
            occupiedSince: status === 'OCCUPIED' ? t.occupiedSince || new Date().toISOString() : status === 'AVAILABLE' ? undefined : t.occupiedSince,
            currentOrderId: status === 'AVAILABLE' ? undefined : t.currentOrderId
          };
        }
        return t;
      })
    }));
  },

  clearTableBill: (tableId) => {
    set((state) => ({
      tables: state.tables.map((t) => (t.id === tableId ? { ...t, status: 'CLEANING', currentOrderId: undefined } : t))
    }));
  },

  // Simulation Engine implementation
  isSimulationActive: false,

  toggleSimulation: (active) => {
    set((state) => ({
      isSimulationActive: active !== undefined ? active : !state.isSimulationActive
    }));
  },

  simulateRandomOrder: () => {
    const state = get();
    // Pick 1-3 random menu items
    const availableItems = state.menuItems.filter((i) => i.inStock);
    if (availableItems.length === 0) return;

    const itemCount = Math.floor(Math.random() * 3) + 1;
    const selectedItems = [];
    for (let i = 0; i < itemCount; i++) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      selectedItems.push(randomItem);
    }

    // Pick random server and order type
    const servers = ['Alex M.', 'Sarah K.', 'Mike R.'];
    const randomServer = servers[Math.floor(Math.random() * servers.length)];
    const types: OrderType[] = ['DINE_IN', 'TAKEOUT', 'DELIVERY'];
    const randomType = types[Math.floor(Math.random() * types.length)];

    // Find an available table if DINE_IN
    const availTables = state.tables.filter((t) => t.status === 'AVAILABLE');
    const table = randomType === 'DINE_IN' && availTables.length > 0
      ? availTables[Math.floor(Math.random() * availTables.length)]
      : null;

    const cartItems: CartItem[] = selectedItems.map((item, idx) => ({
      id: `sim-${Date.now()}-${idx}`,
      menuItemId: item.id,
      name: item.name,
      code: item.code,
      price: item.price,
      quantity: Math.floor(Math.random() * 2) + 1,
      seatNumber: idx + 1
    }));

    const subtotal = cartItems.reduce((acc, ci) => acc + ci.price * ci.quantity, 0);
    const tax = subtotal * state.taxRate;
    const total = subtotal + tax;

    const orderNum = state.orders.length > 0 ? Math.max(...state.orders.map((o) => o.orderNumber)) + 1 : 1005;

    const newOrder: OrderTicket = {
      id: `ORD-${orderNum}`,
      orderNumber: orderNum,
      type: randomType,
      tableId: table ? table.id : undefined,
      tableName: table ? table.name : undefined,
      serverName: randomServer,
      items: cartItems,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtotal,
      tax,
      discount: 0,
      total,
      paid: false
    };

    let updatedTables = [...state.tables];
    if (table) {
      updatedTables = updatedTables.map((t) => {
        if (t.id === table.id) {
          return {
            ...t,
            status: 'OCCUPIED',
            currentOrderId: newOrder.id,
            guestCount: Math.min(table.capacity, cartItems.length + 1),
            occupiedSince: new Date().toISOString(),
            serverName: randomServer
          };
        }
        return t;
      });
    }

    // Deduct stock for ingredients & sync menu item availability
    const { updatedIngredients, updatedMenuItems } = deductIngredientsForCart(cartItems, state.menuItems, state.ingredients);

    set({
      orders: [newOrder, ...state.orders],
      ingredients: updatedIngredients,
      menuItems: updatedMenuItems,
      tables: updatedTables
    });
  }
}));
