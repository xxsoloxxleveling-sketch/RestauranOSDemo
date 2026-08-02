export type ViewMode = 'POS' | 'KDS' | 'INVENTORY' | 'FLOOR' | 'ANALYTICS';

export type OrderType = 'DINE_IN' | 'TAKEOUT' | 'DELIVERY';

export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'BILLED' | 'CLEANING';

export type StationType = 'ALL' | 'GRILL' | 'PANTRY' | 'BAR' | 'FRYER' | 'ASSEMBLY';

export interface MenuItem {
  id: string;
  name: string;
  code: string; // Short code e.g., "B01" for rapid key entry
  category: string;
  price: number;
  station: StationType;
  inStock: boolean;
  ingredients: { ingredientId: string; amountNeeded: number }[];
  description?: string;
}

export interface CartItem {
  id: string; // unique item instance id
  menuItemId: string;
  name: string;
  code: string;
  price: number;
  quantity: number;
  seatNumber?: number;
  notes?: string;
  modifiers?: string[];
}

export interface OrderTicket {
  id: string; // e.g., "ORD-1042"
  orderNumber: number;
  type: OrderType;
  tableId?: string;
  tableName?: string;
  serverName: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: string; // ISO timestamp
  updatedAt: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod?: 'CASH' | 'CARD' | 'SPLIT';
  paid: boolean;
  notes?: string;
}

export interface DiningTable {
  id: string;
  name: string; // e.g. "Table 12", "Bar 03"
  section: 'MAIN_ROOM' | 'PATIO' | 'BAR' | 'VIP';
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  guestCount?: number;
  serverName?: string;
  occupiedSince?: string; // ISO timestamp
  x: number; // grid column/pos
  y: number; // grid row/pos
  width: number;
  height: number;
}

export interface Ingredient {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string; // e.g., "kg", "liters", "units", "bags"
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
}

export interface HotkeyDefinition {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  description: string;
  category: 'NAVIGATION' | 'POS' | 'KDS' | 'SYSTEM';
}
