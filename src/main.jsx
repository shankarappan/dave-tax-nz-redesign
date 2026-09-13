import { installMediaAnalytics } from "./media-analytics.js";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

const container = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App initialPath={window.location.pathname} />
  </React.StrictMode>
);

// Cloudflare may normalise the prerendered HTML before delivery. Mount the
// interactive app cleanly so those edge transformations cannot cause a
// production hydration mismatch while the static HTML remains available to
// crawlers and no-JavaScript visitors.
container.replaceChildren();
createRoot(container).render(app);

installMediaAnalytics("G-S4BDKMVWDC");
