import { useState, useRef, useEffect } from "react";
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
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  label,
  className,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle selection
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  // Auto close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative text-sm" onMouseLeave={() => setOpen(false)}>
      {label && <span className="text-gray-200 mr-2">{label}</span>}

      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between ${className} border border-yellow-600/20 rounded-lg text-gray-200 bg-transparent hover:border-yellow-400 transition px-3 py-2 w-full`}
      >
        <span>
          {options.find((opt) => opt.value === value)?.label || placeholder || "Select"}
        </span>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute mt-1 w-full 
            bg-yellow-600/25 backdrop-blur-lg 
            border border-yellow-600/20 
            rounded-lg shadow-xl z-20 
            max-h-48 overflow-y-auto
            animate-slideDown
          "
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`
                flex items-center justify-between 
                w-full text-left px-4 py-2 
                hover:bg-yellow-800/50
                ${
                  value === opt.value
                    ? "text-yellow-400 bg-yellow-800/30"
                    : "text-gray-50"
                }
              `}
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
