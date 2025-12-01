import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// إخفاء تحذيرات Clerk في بيئة التطوير
// Hide Clerk development warnings in console
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0]?.includes?.("Clerk has been loaded with development keys") ||
      args[0]
        ?.toString?.()
        .includes("Clerk has been loaded with development keys")
    ) {
      // تجاهل تحذير مفاتيح التطوير
      // Ignore development keys warning
      return;
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </ClerkProvider>
);
