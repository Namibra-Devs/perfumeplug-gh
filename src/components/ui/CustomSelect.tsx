import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, label, className }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div className="relative text-sm">
      {label && <span className="text-gray-200 mr-2">{label}</span>}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between ${className} border border-yellow-600/20 rounded-lg text-gray-200 bg-transparent hover:border-yellow-400 transition`}
      >
        <span>
          {options.find(opt => opt.value === value)?.label || "Select..."}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-yellow-600/25 backdrop-blur-lg overflow-hidden border border-yellow-600/20 rounded-lg shadow-lg z-20">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`flex items-center justify-between w-full text-left px-4 py-2 hover:bg-yellow-800/50 ${
                value === opt.value ? "text-yellow-400" : "text-gray-50"
              }`}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check className="w-4 h-4 text-yellow-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
