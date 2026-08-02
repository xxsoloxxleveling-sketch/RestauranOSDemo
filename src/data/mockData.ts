import { MenuItem, DiningTable, Ingredient, OrderTicket } from '../types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Starters
  {
    id: 'm1',
    name: 'Truffle Parmesan Fries',
    code: 'A01',
    category: 'Starters',
    price: 12.50,
    station: 'FRYER',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing1', amountNeeded: 0.3 }, // Potatoes
      { ingredientId: 'ing2', amountNeeded: 0.02 } // Truffle Oil
    ],
    description: 'Crispy cut fries topped with white truffle oil and shaved parmesan.'
  },
  {
    id: 'm2',
    name: 'Wagyu Beef Sliders (3x)',
    code: 'A02',
    category: 'Starters',
    price: 18.00,
    station: 'GRILL',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing3', amountNeeded: 0.25 }, // Wagyu Beef
      { ingredientId: 'ing4', amountNeeded: 3 }    // Slider Buns
    ],
    description: 'Grade A5 Wagyu patties with smoked gouda & caramelized onion jam.'
  },
  {
    id: 'm3',
    name: 'Crispy Calamari',
    code: 'A03',
    category: 'Starters',
    price: 15.00,
    station: 'FRYER',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing5', amountNeeded: 0.25 } // Squid
    ],
    description: 'Wild squid tossed in lemon pepper breading with garlic aioli.'
  },
  {
    id: 'm4',
    name: 'Heirloom Tomato Caprese',
    code: 'A04',
    category: 'Starters',
    price: 14.00,
    station: 'PANTRY',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing6', amountNeeded: 0.2 } // Tomatoes
    ],
    description: 'Fresh mozzarella, basil pesto, aged balsamic reduction.'
  },

  // Mains
  {
    id: 'm5',
    name: 'Dry-Aged Ribeye 12oz',
    code: 'M01',
    category: 'Mains',
    price: 48.00,
    station: 'GRILL',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing7', amountNeeded: 0.35 } // Ribeye Steak
    ],
    description: '45-day dry aged ribeye served with roasted garlic herb butter.'
  },
  {
    id: 'm6',
    name: 'Pan-Seared Atlantic Salmon',
    code: 'M02',
    category: 'Mains',
    price: 32.00,
    station: 'GRILL',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing8', amountNeeded: 0.25 } // Salmon Fillet
    ],
    description: 'Wild caught salmon over wild mushroom risotto & lemon dill emulsion.'
  },
  {
    id: 'm7',
    name: 'Wood-Fired Margherita Pizza',
    code: 'M03',
    category: 'Mains',
    price: 21.00,
    station: 'ASSEMBLY',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing6', amountNeeded: 0.15 }, // Tomatoes
      { ingredientId: 'ing9', amountNeeded: 0.2 }  // Mozzarella
    ],
    description: 'San Marzano tomatoes, fresh buffalo mozzarella, sweet basil.'
  },
  {
    id: 'm8',
    name: 'Smoked Bacon Cheeseburger',
    code: 'M04',
    category: 'Mains',
    price: 22.00,
    station: 'GRILL',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing3', amountNeeded: 0.2 },
      { ingredientId: 'ing10', amountNeeded: 0.05 } // Smoked Bacon
    ],
    description: 'Custom blend beef patty, thick cut bacon, sharp cheddar on brioche.'
  },

  // Beverages
  {
    id: 'm9',
    name: 'Smoked Old Fashioned',
    code: 'B01',
    category: 'Beverages',
    price: 16.00,
    station: 'BAR',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing11', amountNeeded: 0.06 } // Bourbon
    ],
    description: 'Bourbon, Angostura bitters, raw sugar cube, hickory smoked glass.'
  },
  {
    id: 'm10',
    name: 'Craft IPA Pint',
    code: 'B02',
    category: 'Beverages',
    price: 8.50,
    station: 'BAR',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing12', amountNeeded: 0.5 } // Craft Beer
    ],
    description: 'Hazy Citrus West Coast IPA on draught.'
  },
  {
    id: 'm11',
    name: 'Artisanal Espresso',
    code: 'B03',
    category: 'Beverages',
    price: 4.50,
    station: 'BAR',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing13', amountNeeded: 0.018 } // Coffee Beans
    ],
    description: 'Double shot roasted Arabica blend.'
  },
  {
    id: 'm12',
    name: 'Sparkling Mineral Water 750ml',
    code: 'B04',
    category: 'Beverages',
    price: 6.00,
    station: 'BAR',
    inStock: true,
    ingredients: [],
    description: 'San Pellegrino glass bottle.'
  },

  // Desserts
  {
    id: 'm13',
    name: 'Valrhona Dark Chocolate Lava Cake',
    code: 'D01',
    category: 'Desserts',
    price: 13.00,
    station: 'PANTRY',
    inStock: true,
    ingredients: [],
    description: 'Warm molten center with Madagascar vanilla bean gelato.'
  },
  {
    id: 'm14',
    name: 'Classic Italian Tiramisu',
    code: 'D02',
    category: 'Desserts',
    price: 11.00,
    station: 'PANTRY',
    inStock: true,
    ingredients: [
      { ingredientId: 'ing13', amountNeeded: 0.01 }
    ],
    description: 'Espresso-soaked ladyfingers, mascarpone cream, dark cocoa powder.'
  }
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  {
    id: 'ing1',
    name: 'Russet Potatoes',
    sku: 'ING-POT-01',
    category: 'Produce',
    currentStock: 45.0,
    minThreshold: 15.0,
    unit: 'kg',
    costPerUnit: 1.80,
    supplier: 'FarmFresh Produce Co',
    lastRestocked: '2026-07-30T08:00:00Z'
  },
  {
    id: 'ing2',
    name: 'White Truffle Oil',
    sku: 'ING-TRF-02',
    category: 'Oils & Condiments',
    currentStock: 1.2,
    minThreshold: 2.0, // Low stock alert trigger!
    unit: 'liters',
    costPerUnit: 65.00,
    supplier: 'Gourmet Imports Ltd',
    lastRestocked: '2026-07-20T10:30:00Z'
  },
  {
    id: 'ing3',
    name: 'A5 Wagyu Beef Grind',
    sku: 'ING-WAG-03',
    category: 'Meat & Poultry',
    currentStock: 18.5,
    minThreshold: 10.0,
    unit: 'kg',
    costPerUnit: 38.00,
    supplier: 'Prime Butcher Select',
    lastRestocked: '2026-08-01T06:00:00Z'
  },
  {
    id: 'ing4',
    name: 'Brioche Slider Buns',
    sku: 'ING-BUN-04',
    category: 'Bakery',
    currentStock: 80,
    minThreshold: 30,
    unit: 'units',
    costPerUnit: 0.45,
    supplier: 'Artisan Bakery Hub',
    lastRestocked: '2026-08-01T05:30:00Z'
  },
  {
    id: 'ing5',
    name: 'Wild Calamari Squid',
    sku: 'ING-CAL-05',
    category: 'Seafood',
    currentStock: 3.5,
    minThreshold: 8.0, // Low stock alert!
    unit: 'kg',
    costPerUnit: 22.00,
    supplier: 'Oceanic Wholesalers',
    lastRestocked: '2026-07-29T09:15:00Z'
  },
  {
    id: 'ing6',
    name: 'Heirloom San Marzano Tomatoes',
    sku: 'ING-TOM-06',
    category: 'Produce',
    currentStock: 28.0,
    minThreshold: 12.0,
    unit: 'kg',
    costPerUnit: 3.20,
    supplier: 'FarmFresh Produce Co',
    lastRestocked: '2026-07-31T11:00:00Z'
  },
  {
    id: 'ing7',
    name: 'Dry-Aged Ribeye Primal',
    sku: 'ING-RIB-07',
    category: 'Meat & Poultry',
    currentStock: 14.0,
    minThreshold: 5.0,
    unit: 'kg',
    costPerUnit: 52.00,
    supplier: 'Prime Butcher Select',
    lastRestocked: '2026-07-28T07:45:00Z'
  },
  {
    id: 'ing8',
    name: 'Fresh Salmon Sides',
    sku: 'ING-SLM-08',
    category: 'Seafood',
    currentStock: 9.2,
    minThreshold: 4.0,
    unit: 'kg',
    costPerUnit: 26.50,
    supplier: 'Oceanic Wholesalers',
    lastRestocked: '2026-08-01T06:30:00Z'
  },
  {
    id: 'ing9',
    name: 'Fresh Buffalo Mozzarella',
    sku: 'ING-MOZ-09',
    category: 'Dairy',
    currentStock: 12.0,
    minThreshold: 5.0,
    unit: 'kg',
    costPerUnit: 14.00,
    supplier: 'MilkyWay Foods',
    lastRestocked: '2026-07-30T10:00:00Z'
  },
  {
    id: 'ing10',
    name: 'Thick Cut Smoked Bacon',
    sku: 'ING-BAC-10',
    category: 'Meat & Poultry',
    currentStock: 7.5,
    minThreshold: 3.0,
    unit: 'kg',
    costPerUnit: 12.00,
    supplier: 'Prime Butcher Select',
    lastRestocked: '2026-07-31T08:00:00Z'
  },
  {
    id: 'ing11',
    name: 'Bourbon Whiskey 750ml',
    sku: 'ING-BRB-11',
    category: 'Beverages / Spirits',
    currentStock: 6.0,
    minThreshold: 3.0,
    unit: 'liters',
    costPerUnit: 28.00,
    supplier: 'Metro Beverage Co',
    lastRestocked: '2026-07-25T14:00:00Z'
  },
  {
    id: 'ing12',
    name: 'IPA Draught Keg 50L',
    sku: 'ING-IPA-12',
    category: 'Beverages / Beer',
    currentStock: 1.5,
    minThreshold: 2.0, // Low stock alert!
    unit: 'kegs',
    costPerUnit: 180.00,
    supplier: 'Metro Beverage Co',
    lastRestocked: '2026-07-20T16:00:00Z'
  },
  {
    id: 'ing13',
    name: 'Arabica Whole Espresso Beans',
    sku: 'ING-COF-13',
    category: 'Coffee & Tea',
    currentStock: 8.5,
    minThreshold: 3.0,
    unit: 'kg',
    costPerUnit: 22.00,
    supplier: 'Roaster Guild Direct',
    lastRestocked: '2026-07-29T11:30:00Z'
  }
];

export const INITIAL_TABLES: DiningTable[] = [
  // Main Room
  { id: 't1', name: 'T-01', section: 'MAIN_ROOM', capacity: 2, status: 'OCCUPIED', currentOrderId: 'ORD-1001', guestCount: 2, serverName: 'Alex M.', occupiedSince: new Date(Date.now() - 22 * 60000).toISOString(), x: 1, y: 1, width: 1, height: 1 },
  { id: 't2', name: 'T-02', section: 'MAIN_ROOM', capacity: 4, status: 'AVAILABLE', x: 2, y: 1, width: 2, height: 1 },
  { id: 't3', name: 'T-03', section: 'MAIN_ROOM', capacity: 4, status: 'BILLED', currentOrderId: 'ORD-0998', guestCount: 4, serverName: 'Alex M.', occupiedSince: new Date(Date.now() - 58 * 60000).toISOString(), x: 4, y: 1, width: 2, height: 1 },
  { id: 't4', name: 'T-04', section: 'MAIN_ROOM', capacity: 6, status: 'OCCUPIED', currentOrderId: 'ORD-1002', guestCount: 5, serverName: 'Sarah K.', occupiedSince: new Date(Date.now() - 14 * 60000).toISOString(), x: 1, y: 3, width: 2, height: 2 },
  { id: 't5', name: 'T-05', section: 'MAIN_ROOM', capacity: 2, status: 'CLEANING', x: 4, y: 3, width: 1, height: 1 },
  { id: 't6', name: 'T-06', section: 'MAIN_ROOM', capacity: 4, status: 'RESERVED', serverName: 'David L.', x: 5, y: 3, width: 2, height: 1 },

  // Patio
  { id: 't7', name: 'P-01', section: 'PATIO', capacity: 2, status: 'AVAILABLE', x: 1, y: 1, width: 1, height: 1 },
  { id: 't8', name: 'P-02', section: 'PATIO', capacity: 4, status: 'OCCUPIED', currentOrderId: 'ORD-1003', guestCount: 3, serverName: 'Sarah K.', occupiedSince: new Date(Date.now() - 8 * 60000).toISOString(), x: 2, y: 1, width: 2, height: 1 },
  { id: 't9', name: 'P-03', section: 'PATIO', capacity: 4, status: 'AVAILABLE', x: 4, y: 1, width: 2, height: 1 },

  // Bar Area
  { id: 'b1', name: 'BAR-01', section: 'BAR', capacity: 1, status: 'OCCUPIED', currentOrderId: 'ORD-1004', guestCount: 1, serverName: 'Mike R. (Bartender)', occupiedSince: new Date(Date.now() - 5 * 60000).toISOString(), x: 1, y: 1, width: 1, height: 1 },
  { id: 'b2', name: 'BAR-02', section: 'BAR', capacity: 1, status: 'OCCUPIED', currentOrderId: 'ORD-1004', guestCount: 1, serverName: 'Mike R. (Bartender)', occupiedSince: new Date(Date.now() - 5 * 60000).toISOString(), x: 2, y: 1, width: 1, height: 1 },
  { id: 'b3', name: 'BAR-03', section: 'BAR', capacity: 1, status: 'AVAILABLE', x: 3, y: 1, width: 1, height: 1 },
  { id: 'b4', name: 'BAR-04', section: 'BAR', capacity: 1, status: 'AVAILABLE', x: 4, y: 1, width: 1, height: 1 },

  // VIP Lounge
  { id: 'v1', name: 'VIP-BOOTH 1', section: 'VIP', capacity: 8, status: 'RESERVED', x: 1, y: 1, width: 3, height: 2 },
  { id: 'v2', name: 'VIP-BOOTH 2', section: 'VIP', capacity: 10, status: 'AVAILABLE', x: 4, y: 1, width: 3, height: 2 }
];

export const INITIAL_ORDERS: OrderTicket[] = [
  {
    id: 'ORD-1001',
    orderNumber: 1001,
    type: 'DINE_IN',
    tableId: 't1',
    tableName: 'T-01',
    serverName: 'Alex M.',
    items: [
      { id: 'i1', menuItemId: 'm1', name: 'Truffle Parmesan Fries', code: 'A01', price: 12.50, quantity: 1, seatNumber: 1, notes: 'Extra crispy' },
      { id: 'i2', menuItemId: 'm5', name: 'Dry-Aged Ribeye 12oz', code: 'M01', price: 48.00, quantity: 1, seatNumber: 1, notes: 'Medium Rare' },
      { id: 'i3', menuItemId: 'm9', name: 'Smoked Old Fashioned', code: 'B01', price: 16.00, quantity: 2, seatNumber: 2 }
    ],
    status: 'PREPARING',
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(), // 22 minutes ago (Amber warning)
    updatedAt: new Date(Date.now() - 22 * 60000).toISOString(),
    subtotal: 92.50,
    tax: 7.40,
    discount: 0,
    total: 99.90,
    paid: false
  },
  {
    id: 'ORD-1002',
    orderNumber: 1002,
    type: 'DINE_IN',
    tableId: 't4',
    tableName: 'T-04',
    serverName: 'Sarah K.',
    items: [
      { id: 'i4', menuItemId: 'm2', name: 'Wagyu Beef Sliders (3x)', code: 'A02', price: 18.00, quantity: 2, seatNumber: 1 },
      { id: 'i5', menuItemId: 'm7', name: 'Wood-Fired Margherita Pizza', code: 'M03', price: 21.00, quantity: 2, seatNumber: 2, notes: 'Add chili flakes' },
      { id: 'i6', menuItemId: 'm10', name: 'Craft IPA Pint', code: 'B02', price: 8.50, quantity: 4, seatNumber: 3 }
    ],
    status: 'NEW',
    createdAt: new Date(Date.now() - 6 * 60000).toISOString(), // 6 mins ago (Green)
    updatedAt: new Date(Date.now() - 6 * 60000).toISOString(),
    subtotal: 112.00,
    tax: 8.96,
    discount: 0,
    total: 120.96,
    paid: false
  },
  {
    id: 'ORD-1003',
    orderNumber: 1003,
    type: 'DINE_IN',
    tableId: 't8',
    tableName: 'P-02',
    serverName: 'Sarah K.',
    items: [
      { id: 'i7', menuItemId: 'm6', name: 'Pan-Seared Atlantic Salmon', code: 'M02', price: 32.00, quantity: 1, notes: 'Sauce on side' },
      { id: 'i8', menuItemId: 'm4', name: 'Heirloom Tomato Caprese', code: 'A04', price: 14.00, quantity: 1 }
    ],
    status: 'PREPARING',
    createdAt: new Date(Date.now() - 26 * 60000).toISOString(), // 26 mins ago (Red critical alert!)
    updatedAt: new Date(Date.now() - 26 * 60000).toISOString(),
    subtotal: 46.00,
    tax: 3.68,
    discount: 0,
    total: 49.68,
    paid: false
  },
  {
    id: 'ORD-1004',
    orderNumber: 1004,
    type: 'DINE_IN',
    tableId: 'b1',
    tableName: 'BAR-01',
    serverName: 'Mike R.',
    items: [
      { id: 'i9', menuItemId: 'm9', name: 'Smoked Old Fashioned', code: 'B01', price: 16.00, quantity: 1 },
      { id: 'i10', menuItemId: 'm3', name: 'Crispy Calamari', code: 'A03', price: 15.00, quantity: 1 }
    ],
    status: 'READY',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60000).toISOString(),
    subtotal: 31.00,
    tax: 2.48,
    discount: 0,
    total: 33.48,
    paid: false
  },
  {
    id: 'ORD-0998',
    orderNumber: 998,
    type: 'DINE_IN',
    tableId: 't3',
    tableName: 'T-03',
    serverName: 'Alex M.',
    items: [
      { id: 'i11', menuItemId: 'm8', name: 'Smoked Bacon Cheeseburger', code: 'M04', price: 22.00, quantity: 2 },
      { id: 'i12', menuItemId: 'm13', name: 'Valrhona Dark Chocolate Lava Cake', code: 'D01', price: 13.00, quantity: 2 }
    ],
    status: 'SERVED',
    createdAt: new Date(Date.now() - 58 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    subtotal: 70.00,
    tax: 5.60,
    discount: 0,
    total: 75.60,
    paid: true,
    paymentMethod: 'CARD'
  }
];
