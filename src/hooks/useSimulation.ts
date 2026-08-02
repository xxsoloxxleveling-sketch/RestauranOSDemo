import { useEffect } from 'react';
import { useRestaurantStore } from '../store/useRestaurantStore';

export function useSimulation() {
  const {
    isSimulationActive,
    simulateRandomOrder,
    orders,
    tables,
    bumpKdsTicket,
    updateTableStatus
  } = useRestaurantStore();

  useEffect(() => {
    if (!isSimulationActive) return;

    // 1. Order Generator Interval (Every 18 seconds)
    const orderInterval = setInterval(() => {
      simulateRandomOrder();
    }, 18000);

    // 2. Kitchen Progress Interval (Every 25 seconds)
    const kdsInterval = setInterval(() => {
      const activeOrders = orders.filter(
        (o) => o.status === 'NEW' || o.status === 'PREPARING'
      );
      if (activeOrders.length > 0) {
        // Pick the oldest active order
        const oldest = activeOrders[activeOrders.length - 1];
        bumpKdsTicket(oldest.id);
      }
    }, 25000);

    // 3. Table Turnover Interval (Every 35 seconds)
    const tableInterval = setInterval(() => {
      const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED');
      if (occupiedTables.length > 0) {
        const randomTable = occupiedTables[Math.floor(Math.random() * occupiedTables.length)];
        updateTableStatus(randomTable.id, 'BILLED');
      } else {
        const billedTables = tables.filter((t) => t.status === 'BILLED');
        if (billedTables.length > 0) {
          const randomBilled = billedTables[Math.floor(Math.random() * billedTables.length)];
          updateTableStatus(randomBilled.id, 'AVAILABLE');
        }
      }
    }, 35000);

    return () => {
      clearInterval(orderInterval);
      clearInterval(kdsInterval);
      clearInterval(tableInterval);
    };
  }, [isSimulationActive, orders, tables, bumpKdsTicket, updateTableStatus, simulateRandomOrder]);
}
