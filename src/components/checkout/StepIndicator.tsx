import { FC } from "react";
import { CreditCard, Truck, User } from "lucide-react";

interface StepIndicatorProps {
  current: string;
}

const steps = [
  { id: "customer", name: "Customer Details", icon: User },
  { id: "delivery", name: "Delivery", icon: Truck },
  { id: "payment", name: "Payment", icon: CreditCard },
];

const StepIndicator: FC<StepIndicatorProps> = ({ current }) => {
  return (
    <div className="flex justify-center mb-8">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                current === step.id
                  ? "border-purple-600 bg-purple-600 text-white"
                  : "border-gray-500 text-gray-500"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>

            {i < steps.length - 1 && (
              <div className="w-10 h-1 bg-gray-500 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
