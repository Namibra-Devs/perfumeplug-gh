/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import { z } from "zod";
import { sanitizeGhanaPhoneNumber, isValidGhanaPhoneNumber } from "../../utils/phoneUtils";

// Zod schema for delivery details validation
const deliveryDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().refine((phone) => {
    if (!phone || phone.trim() === "") return true; // Optional field
    return isValidGhanaPhoneNumber(phone);
  }, "Enter a valid Ghana phone number (e.g., 0201113330)"),
  addressLine1: z.string().min(1, "Address is required"),
  email: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

interface Props {
  data: any;
  setData: (v: any) => void;
  onNext: () => void;
  onBack?: () => void;
  value: string;
}

const DeliveryDetailsForm: FC<Props> = ({
  data,
  setData,
  onNext,
  onBack,
  value
}) => {
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    try {
      // For pickup, we don't require address
      const schemaToUse = value === "pickup" 
        ? deliveryDetailsSchema.omit({ addressLine1: true })
        : deliveryDetailsSchema;
      
      schemaToUse.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: any = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            formattedErrors[issue.path[0]] = issue.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validate()) {
      // Sanitize phone number before proceeding
      if (data.phone && data.phone.trim()) {
        setData({ 
          ...data, 
          phone: sanitizeGhanaPhoneNumber(data.phone) 
        });
      }
      onNext();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/20 border border-yellow-500/30 rounded-xl p-6"
    >
      <h2 className="text-xl text-purple-600 mb-4">Delivery Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="grid grid-cols-1 md:grid-cols-2 col-span-3 gap-4">
          {/* FIRST NAME */}
          <div>
            <input
              className="input w-full px-3 py-2.5 outline-none bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 rounded-lg"
              placeholder="First Name"
              value={data.firstName}
              onChange={(e) => setData({ ...data, firstName: e.target.value })}
            />
            {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName}</p>}
          </div>

          {/* LAST NAME */}
          <div>
            <input
              className="input w-full px-3 py-2.5 outline-none bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 rounded-lg"
              placeholder="Last Name"
              value={data.lastName}
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
            />
            {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName}</p>}
          </div>

          {/* PHONE */}
          <div>
            <input
              type="tel"
              className="input w-full px-3 py-2.5 outline-none bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 rounded-lg"
              placeholder="Phone (e.g., 0240000000)"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
            {data.phone && data.phone.trim() && isValidGhanaPhoneNumber(data.phone) && (
              <p className="text-green-400 text-xs mt-1">
                ✓ Will be saved as: {sanitizeGhanaPhoneNumber(data.phone)}
              </p>
            )}
            {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
          </div>

          {/* ADDRESS LINE 1 */}
          {value === "delivery" ? (
            <div>
              <input
                className="input w-full px-3 py-2.5 outline-none bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 rounded-lg"
                placeholder="Address (Location)"
                value={data.addressLine1}
                onChange={(e) => setData({ ...data, addressLine1: e.target.value })}
              />
              {errors.addressLine1 && <p className="text-red-400 text-xs">{errors.addressLine1}</p>}
            </div>
          ) : (
            <>              
            </>
          )}
          
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="border-2 border-yellow-600/20 text-sm text-center text-yellow-500 px-8 py-2 hover:bg-yellow-800/40 hover:text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Back
        </button>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700">
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

export default DeliveryDetailsForm;
