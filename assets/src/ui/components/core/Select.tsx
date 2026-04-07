import type { KeyboardEvent } from "react";

type SelectProps = {
  id?: string;
  value: string;
  disabled?: boolean;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  onEnter: () => void;
};

export function Select({
  id,
  value,
  disabled = false,
  options,
  placeholder,
  onChange,
  onEnter,
}: SelectProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLSelectElement>) => {
    if (event.key === "Enter") {
      onEnter();
    }
  };

  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={handleKeyDown}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
