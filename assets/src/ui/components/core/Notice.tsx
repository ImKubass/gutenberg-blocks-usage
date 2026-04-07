import type { ReactNode } from "react";

type NoticeProps = {
  variant: "info" | "error";
  children: ReactNode;
};

export function Notice({ variant, children }: NoticeProps) {
  return <div className={`gbu-notice gbu-notice-${variant}`}>{children}</div>;
}
