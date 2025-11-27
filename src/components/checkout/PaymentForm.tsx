/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";

interface Props {
  loading: boolean;
  total: number;
  error: string;
  onBack: () => void;
  onSubmit: (e: any) => void;
}

const PaymentForm: FC<Props> = ({
  loading,
  total,
  error,
  onBack,
  onSubmit
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-black/20 border border-yellow-500/30 rounded-xl p-6"
    >
      <h2 className="text-xl text-purple-600 mb-4">Payment Method</h2>

      {error && <p className="text-red-400 mb-3">{error}</p>}

      <p className="text-gray-300 text-sm mb-4">
        You will be redirected to Paystack to complete your payment.
      </p>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back
        </button>

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Processing..." : `Pay ₵${total.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
