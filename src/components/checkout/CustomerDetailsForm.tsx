/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import { isEmpty, isEmail, isPhone } from "../../utils/validation";

interface Props {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  setData: (v: any) => void;
  onNext: () => void;
}

const CustomerDetailsForm: FC<Props> = ({ data, setData, onNext }) => {
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErr: any = {};

    if (isEmpty(data.firstName)) newErr.firstName = "First name required";
    if (isEmpty(data.lastName)) newErr.lastName = "Last name required";

    if (!isEmail(data.email)) newErr.email = "Invalid email format";

    if (!isPhone(data.phone)) newErr.phone = "Invalid phone number";

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validate()) onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/20 border border-yellow-500/30 rounded-xl p-6"
    >
      <h2 className="text-xl text-purple-600 mb-4">Customer Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            className="input w-full px-3 py-2.5 bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 outline-none rounded-lg"
            placeholder="First Name"
            value={data.firstName}
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
          />
          {errors.firstName && (
            <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <input
            className="input w-full px-3 py-2.5 bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 outline-none rounded-lg"
            placeholder="Last Name"
            value={data.lastName}
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
          />
          {errors.lastName && (
            <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        <div>
          <input
            className="input w-full px-3 py-2.5 bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 outline-none rounded-lg"
            placeholder="Email"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            className="input w-full px-3 py-2.5 bg-transparent text-white text-sm border border-yellow-600/20 rounded-lg"
            placeholder="Phone"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <button className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700">
        Continue to Delivery
      </button>
    </form>
  );
};

export default CustomerDetailsForm;
