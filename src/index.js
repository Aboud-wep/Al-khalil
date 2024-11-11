import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PageProvider } from "./Quran/PageContext";
import { UserProvider } from "./UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <UserProvider>
      <PageProvider>
        <App />
      </PageProvider>
    </UserProvider>
  </BrowserRouter>
);
