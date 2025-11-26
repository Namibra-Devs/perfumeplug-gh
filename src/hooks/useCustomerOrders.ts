/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {  CustomerOrderSummary,  Pagination } from "../types/order";
import { getCustomerOrders } from "../services/orderService";
import { useToast } from "./useToast";

export function useCustomerOrders(token?: string | null) {
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        const orderList = await getCustomerOrders();

        // apiFetch ALREADY returns data.data, so we use the fields directly
        setOrders(orderList.orders);
        setPagination(orderList.pagination);

        toast.success("Orders loaded successfully!");
      } catch (err: any) {
        console.log(err);
        setError(err.message);
        // toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [toast, token]);

  return { orders, pagination, loading, error };
}
