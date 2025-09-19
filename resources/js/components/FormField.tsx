import React from "react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  children?: React.ReactNode; // for select options
}

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  children,
}: FormFieldProps) {
  const isSelect = children !== undefined;

  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {isSelect ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="shadow border rounded w-full py-2 px-3"
        >
          {children}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="shadow border rounded w-full py-2 px-3"
        />
      )}

      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
}
