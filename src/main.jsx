import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

const container = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App initialPath={window.location.pathname} />
  </React.StrictMode>
);

if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-event]");
  if (link && typeof window.gtag === "function") {
    window.gtag("event", link.dataset.event, { page_path: window.location.pathname });
  }
});
