import type { ReactNode } from "react";

type ChipProps = {
  className?: string;
  children: ReactNode;
};

export function Chip({ className, children }: ChipProps) {
  return <span className={className}>{children}</span>;
}
