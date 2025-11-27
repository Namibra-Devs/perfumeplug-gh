/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import CustomSelect from "../ui/CustomSelect";
import { isEmail, isEmpty, isPhone } from "../../utils/validation";

interface Props {
  data: any;
  setData: (v: any) => void;
  notes: string;
  setNotes: (v: string) => void;
  onNext: () => void;
  onBack?: () => void;
  regions: any[];
  countries: any[];
}

const DeliveryDetailsForm: FC<Props> = ({
  data,
  setData,
  notes,
  setNotes,
  onNext,
  onBack,
  regions,
  countries
}) => {
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const err: any = {};

    if (isEmpty(data.firstName)) err.firstName = "Required";
    if (isEmpty(data.lastName)) err.lastName = "Required";
    if (!isPhone(data.phone)) err.phone = "Invalid phone";
    if (!isEmail(data.email)) err.email = "Invalid Email";

    if (isEmpty(data.addressLine1)) err.addressLine1 = "Required";
    if (isEmpty(data.city)) err.city = "Required";

    if (isEmpty(data.state)) err.state = "Select region";
    if (isEmpty(data.country)) err.country = "Select country";

    setErrors(err);
    return Object.keys(err).length === 0;
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
              className="input w-full px-3 py-2.5 outline-none bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 rounded-lg"
              placeholder="Phone"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
            {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <input
              className="input w-full px-3 py-2.5 outline-none bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 rounded-lg"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
          </div>

          {/* ADDRESS LINE 1 */}
          <div>
            <input
              className="input w-full px-3 py-2.5 outline-none bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 rounded-lg"
              placeholder="Address Line 1"
              value={data.addressLine1}
              onChange={(e) => setData({ ...data, addressLine1: e.target.value })}
            />
            {errors.addressLine1 && <p className="text-red-400 text-xs">{errors.addressLine1}</p>}
          </div>

          {/* ADDRESS LINE 2 */}
          {/* <div>
            <input
              className="input w-full px-3 py-2.5 outline-none bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 rounded-lg"
              placeholder="Address Line 2"
              value={data.addressLine2}
              onChange={(e) => setData({ ...data, addressLine2: e.target.value })}
            />
          </div> */}

          {/* CITY */}
          <div>
            <input
              className="input w-full px-3 py-2.5 outline-none bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 rounded-lg"
              placeholder="City"
              value={data.city}
              onChange={(e) => setData({ ...data, city: e.target.value })}
            />
            {errors.city && <p className="text-red-400 text-xs">{errors.city}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-3">

          <div>
            <CustomSelect
              value={data.state}
              placeholder="Select Region"
              onChange={(v) => setData({ ...data, state: v })}
              options={regions}
              className="px-6 py-2.5"
            />
            {errors.state && <p className="text-red-400 text-xs">{errors.state}</p>}
          </div>

          <input
            className="input w-full px-3 py-2.5 outline-none bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 rounded-lg"
            placeholder="Zip Code"
            value={data.zipCode}
            onChange={(e) => setData({ ...data, zipCode: e.target.value })}
          />

          <div>
            <CustomSelect
              value={data.country}
              placeholder="Select Country"
              onChange={(v) => setData({ ...data, country: v })}
              options={countries}
              className="px-6 py-2.5"
            />
            {errors.country && <p className="text-red-400 text-xs">{errors.country}</p>}
          </div>
        </div>

        <textarea
          className="w-full h-14 resize-none px-3 py-2.5 outline-none bg-transparent text-white text-sm border border-yellow-600/20 focus:ring-2 focus:ring-yellow-500 rounded-lg col-span-3"
          placeholder="Additional Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="border-2 border-yellow-600/20 text-sm text-center text-yellow-500 px-8 py-2.5 hover:bg-yellow-800/40 hover:text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Back
        </button>

        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700">
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

export default DeliveryDetailsForm;
