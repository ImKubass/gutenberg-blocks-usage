import type { ReactNode } from "react";

type ButtonProps = {
  id?: string;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  children: ReactNode;
};

export function Button({
  id,
  disabled = false,
  className,
  type = "button",
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      id={id}
      className={className}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
