import { createRoot } from "react-dom/client";
import { App } from "./ui/App";
import type { GbuConfig } from "./ui/types";

declare global {
  interface Window {
    GBU?: GbuConfig;
  }
}

const rootElement = document.getElementById("gbu-app-root");
const config = window.GBU;

if (!rootElement || !config) {
  throw new Error("GBU: Required app root or config is missing.");
}

createRoot(rootElement).render(<App config={config} />);
