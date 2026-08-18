import React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

hydrateRoot(document.getElementById("root"),
  <React.StrictMode>
    <App initialPath={window.location.pathname} />
  </React.StrictMode>,
);

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-event]");
  if (link && typeof window.gtag === "function") {
    window.gtag("event", link.dataset.event, { page_path: window.location.pathname });
  }
});
