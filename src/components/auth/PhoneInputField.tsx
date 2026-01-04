// src/components/auth/PhoneInputField.tsx
import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import InputField from "./InputField";
import { sanitizeGhanaPhoneNumber, isValidGhanaPhoneNumber } from "../../utils/phoneUtils";

interface PhoneInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({ label, value, onChange, error }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isValid, setIsValid] = useState(false);
  
  const handleChange = (inputValue: string) => {
    setDisplayValue(inputValue);
    onChange(inputValue);
    setIsValid(inputValue.trim() ? isValidGhanaPhoneNumber(inputValue) : false);
  };

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <InputField
      label={label}
      value={displayValue}
      type="tel"
      onChange={handleChange}
      error={error}
      icon={<Phone size={16} />}
      placeholder="e.g., 0240000000 or +233200000000"
      success={isValid}
      hint={value.trim() && isValid ? `Will be saved as: ${sanitizeGhanaPhoneNumber(value)}` : undefined}
    />
  );
};

export default PhoneInputField;