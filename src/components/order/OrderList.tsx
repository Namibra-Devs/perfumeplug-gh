
import { useCustomerOrders } from "../../hooks/useCustomerOrders";

interface OrderListProps {
  token: string | null;
}


export const OrderList = ({ token }: OrderListProps) => {
  const { orders, loading, error } = useCustomerOrders(token);

  // ─────────────────────────────────────────────
  // LOADING SKELETON
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="divide-y divide-yellow-600/20">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-6 border-b border-yellow-600/20 animate-pulse"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-700 rounded" />
                <div className="h-3 w-24 bg-gray-700 rounded" />
              </div>

              <div className="text-right space-y-2">
                <div className="h-4 w-20 bg-gray-700 rounded ml-auto" />
                <div className="h-5 w-16 bg-gray-700 rounded-full ml-auto" />
              </div>
            </div>

            {/* Items skeleton */}
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((__, j) => (
                <div key={j} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-700 rounded"></div>

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-700 rounded" />
                    <div className="h-3 w-20 bg-gray-700 rounded" />
                  </div>

                  <div className="h-4 w-12 bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────────
  if (error) {
    return (
      <div className="text-center text-xs py-10 text-red-500">
        Failed to load orders: {error}
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // EMPTY STATE
  // ─────────────────────────────────────────────
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        You have no orders yet.
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // ORDERS LIST
  // ─────────────────────────────────────────────
  return (
    <div className="divide-y divide-yellow-600/20">
      {orders.map(order => (
        <div
          key={order._id}
          className="p-6 border-b border-yellow-600/20"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="font-semibold text-purple-600">
                Order #{order._id}
              </div>
              <div className="text-sm text-gray-300">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-white">
                ₵{order.totalAmount.toFixed(2)}
              </div>

              <div
                className={`md:text-sm capitalize px-2 py-1 rounded-full text-xs ${
                  order.status === "delivered"
                    ? "bg-green-700/20 border border-green-600/40 text-green-400"
                    : order.status === "shipped"
                    ? "bg-blue-700/20 border border-blue-600/40 text-blue-400"
                    : order.status === "confirmed"
                    ? "bg-orange-700/20 border border-orange-600/40 text-orange-400"
                    : "bg-yellow-500/20 border border-yellow-500/40 text-yellow-500"
                }`}
              >
                {order.status}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <img
                  src={item.product.images[0]?.url}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="font-medium text-white text-sm">
                    {item.product.name}
                  </p>
                  <p className="text-gray-300 text-xs">Qty: {item.quantity}</p>
                </div>

                <div className="text-sm font-semibold text-white">
                  ₵{item.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
