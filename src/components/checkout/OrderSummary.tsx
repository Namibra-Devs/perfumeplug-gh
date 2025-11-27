/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";

interface Props {
  items: any[];
  subtotal: number;
  total: number;
}

const OrderSummary: FC<Props> = ({ items, subtotal, total }) => {
  return (
    <div className="bg-black/20 border border-yellow-500/30 rounded-xl p-6 sticky top-20">
      <h2 className="text-xl text-purple-600 mb-4">Order Summary</h2>

      {items.map((item) => (
        <div key={item.product._id} className="flex mb-4">
          <img
            src={item.product.images[0]?.url}
            alt={item.product.name}
            className="w-14 h-14 rounded object-cover"
          />
          <div className="ml-3">
            <p className="text-white">{item.product.name}</p>
            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
          </div>
        </div>
      ))}

      <div className="border-t border-yellow-500/30 mt-4 pt-4">
        <div className="flex justify-between">
          <span className="text-white">Subtotal</span>
          <span className="text-yellow-400">₵{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-white">Total</span>
          <span className="text-yellow-400">₵{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
