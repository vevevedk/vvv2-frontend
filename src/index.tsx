import React from "react"
import App from "./App"
import AppWrapper from "./AppWrapper"
import { createRoot } from "react-dom/client"

const container = document.getElementById("root")
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </React.StrictMode>
)
