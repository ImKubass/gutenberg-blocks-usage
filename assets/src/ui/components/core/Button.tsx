import type { ReactNode } from "react";

type ButtonProps = {
  id?: string;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
  children: ReactNode;
};

export function Button({
  id,
  disabled = false,
  className,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      id={id}
      className={className}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
