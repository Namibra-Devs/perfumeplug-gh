import { FC } from "react";
import { Truck, Store } from "lucide-react";

interface Props {
  value: 'delivery' | 'pickup';
  onChange: (method: 'delivery' | 'pickup') => void;
}

const ShippingMethodSelector: FC<Props> = ({ value, onChange }) => {
  return (
    <div className="bg-black/20 border border-yellow-500/30 rounded-xl p-6 mb-6">
      <h3 className="text-xl text-purple-600 mb-4">Shipping Method</h3>
      
      <div className="space-y-3">
        {/* DELIVERY OPTION */}
        <label 
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
            value === 'delivery'
              ? 'border-yellow-500 bg-yellow-500/10'
              : 'border-yellow-600/20 hover:bg-yellow-500/5'
          }`}
        >
          <input
            type="radio"
            name="shippingMethod"
            value="delivery"
            checked={value === 'delivery'}
            onChange={(e) => onChange(e.target.value as 'delivery')}
            className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
          />
          <Truck className="ml-3 h-5 w-5 text-yellow-500" />
          <div className="ml-3 flex-1">
            <div className="text-white font-medium">Home Delivery</div>
            <div className="text-gray-400 text-sm">We'll deliver to your address</div>
          </div>
          {value === 'delivery' && (
            <div className="text-yellow-500 text-sm font-semibold">Selected</div>
          )}
        </label>
        
        {/* PICKUP OPTION */}
        <label 
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
            value === 'pickup'
              ? 'border-yellow-500 bg-yellow-500/10'
              : 'border-yellow-600/20 hover:bg-yellow-500/5'
          }`}
        >
          <input
            type="radio"
            name="shippingMethod"
            value="pickup"
            checked={value === 'pickup'}
            onChange={(e) => onChange(e.target.value as 'pickup')}
            className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
          />
          <Store className="ml-3 h-5 w-5 text-yellow-500" />
          <div className="ml-3 flex-1">
            <div className="text-white font-medium">Store Pickup</div>
            <div className="text-gray-400 text-sm">Pick up from our store</div>
          </div>
          {value === 'pickup' && (
            <div className="text-yellow-500 text-sm font-semibold">Selected</div>
          )}
        </label>
      </div>

      {value === 'pickup' && (
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 text-sm">
            <strong>Store Location:</strong> You can pick up your order from our main store. 
            We'll notify you when it's ready for collection.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingMethodSelector;
